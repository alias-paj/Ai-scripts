/// Const
var scriptConst = {
    name: "SwapGroupLayer",
    version: "0.2.0",
    date: "2024-10-15",
    author: "Philipp Jordan",
    webpage: "www.JordanGraphics.eu",
};

var allSelectedWithin = function (xSel) { // checks if all ITEMS within the given LAYER are selected (quick and dirty)
    allItems = xSel.parent.pageItems;
    for (var i = 0; i < allItems.length; i++) {
        if (!allItems[i].selected) return false;
    }
    return true;
};

var toGroup = function (srcLayer) {
    var LayerToGroup = function (swapLayer) {
        var newGroup = swapLayer.groupItems.add(); // create new GROUPITEM within the old LAYER
        newGroup.name = swapLayer.name.search(/\(\)/) == 0 ? swapLayer.name : ("()" + swapLayer.name); // name the new GROUPITEM, add '()' if nessecary
        newGroup.move(swapLayer, ElementPlacement.PLACEBEFORE); // move the GROUPITEM before the old LAYER

        while (swapLayer.pageItems.length > 0) swapLayer.pageItems[0].move(newGroup, ElementPlacement.PLACEATEND); // move all ITEMS into the new GROUPITEM
        swapLayer.remove(); // delete the old LAYER
    };
    var groupWalk = function (currLayer) {
        while (currLayer.layers.length != 0) groupWalk(currLayer.layers[currLayer.layers.length - 1]); // if LAYERS are found open them
        LayerToGroup(currLayer); // convert LAYER to GROUPITEM, resulting in a reduction of LAYERS until non left 
    };

    srcLayer.layers.length == 0 ? LayerToGroup(srcLayer) : groupWalk(srcLayer); // check if the srcLayer does have layers within
};

var toLayer = function (srcGroup) {
    var GroupToLayer = function (swapGroup) {
        var newLayer = swapGroup.parent.layers.add(); // create a LAYER in the GROUPITEMS parent LAYER
        newLayer.name = swapGroup.name.search(/\(\)/) == 0 ? swapGroup.name.substr(2) : swapGroup.name; // name the LAYER, delete '()' if nessecary
        newLayer.move(swapGroup, ElementPlacement.PLACEBEFORE); // move the LAYER before the old GROUPITEM

        while (swapGroup.pageItems.length > 0) swapGroup.pageItems[0].move(newLayer, ElementPlacement.PLACEATEND); // move all ITEMS to the new LAYER
        swapGroup.remove(); // remove the GROUPITEM, this does Illustrator automatically but only after executing the script
        return (newLayer)
    };
    var layerWalk = function (currGroup) {
        var newLayer = GroupToLayer(currGroup); // convert GROUPITEM to LAYER, save the LAYER for reference
        while (newLayer.groupItems.length > 0) layerWalk(newLayer.groupItems[newLayer.groupItems.length - 1]); // start the layerWalk again if the new LAYER does have GROUPITMES
    };
    layerWalk(srcGroup)
}

var exeMain = function () {
    if (app.documents.length == 0) { // test if document is open
        alert("No active document was found.");
        return;
    };

    var srcSel = app.activeDocument.selection; // get selection

    if (srcSel.length == 0) {
        // test if a selection was made
        alert("Please select a group or a layer.");
        return;
    } else if (srcSel.length == 1 && srcSel[0].typename == "GroupItem" && !srcSel[0].clipped && !allSelectedWithin(srcSel[0])) {
        // test if single item was seleted AND selected item is "GroupItem" BUT NOT "ClippingMask" AND NOT all items within the main layer
        toLayer(srcSel[0]);
        return;
    } else if (srcSel[0].parent.parent.typename == "Document") {
        // test if selected layer is top layer
        alert("Can't execute script on top layer.");
        return;
    } else if (srcSel.length >= 1 && allSelectedWithin(srcSel[0])) {
        // test if more than 1 item was selected AND all items within a layer where selected
        toGroup(srcSel[0].parent);
        return;
    } else {
        alert("Neither a group or complete layer were selected.")
        return;
    };
}

/// main program
exeMain()