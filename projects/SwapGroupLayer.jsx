/// Const
var scriptConst = {
    name: "SwapGroupLayer",
    version: "0.2.0",
    date: "2024-10-15",
    author: "Philipp Jordan",
    webpage: "www.JordanGraphics.eu",
};

var jgSel = {
    selAllWithin : function (xLayer) {
        for (var i = 0; i < xLayer.pageItems.length; i++) if (!xLayer.pageItems[i].selected) return false;
        for (var i = 0; i < xLayer.layers.length; i++) if (!xLayer.layers[i].hasSelectedArtwork) return false;
        return true;
    },
    getTopLayers : function (xSel) {
        var rtnLayers = new Array();
        for (i = 0; i < xSel.length; i++) {
            var currLayer = xSel[i].parent;

            if (!this.selAllWithin(currLayer)) continue;

            while (currLayer.typename === "Layer") {
                if (!this.selAllWithin(currLayer.parent)) break;
                currLayer = currLayer.parent; // Move up one level
            }
            if (currLayer.jgToGroup !== true) {
                currLayer.jgToGroup = true;
                rtnLayers.push(currLayer);
            }
        }
        for (var i = 0; i < rtnLayers.length; i++) delete rtnLayers[i].jgToGroup
        return rtnLayers
    },
    isAllGroups: function (xSel) {
        for (i = 0; i < xSel.length; i++) {
            if (xSel[i].typename != "GroupItem") return false
            if (xSel[i].clipped) return false
            return true
        }
    },
}

var toGroup = function (layerSel) {
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
    for(i = 0; i < layerSel.length; i++) {
        layerSel[i].layers.length == 0 ? LayerToGroup(layerSel[i]) : groupWalk(layerSel[i]); // check if the layerSel[i] does have layers within
    }
};

var toLayer = function (groupSel) {
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
    for (i = 0; i < groupSel.length; i++) layerWalk(groupSel[i]);
}

var exeMain = function () {
    if (app.documents.length == 0) { // test if document is open
        alert("No active document was found.");
        return;
    };

    var srcSel = app.activeDocument.selection; // get selection

    if (srcSel.length == 0) { // test if a selection was made
        alert("Please select groups or layers.");
        return;
    }
    if (jgSel.isAllGroups(srcSel)) {
        toLayer(srcSel);
        return;
    };
    var layerSel = jgSel.getTopLayers(srcSel);
    if (layerSel.length !== 0) {
        toGroup(layerSel);
        return;
    }

    alert("Nothing done!\n\nThis script can process a selection of\n   * only groups or\n   * layers with all items selected.")
}

/// main program
exeMain()