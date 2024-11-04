/// Const
var scriptConst = {
    name: "BatchRename",
    version: "1.1",
    date: "04.11.2024",
    author: "Philipp Jordan",
    webpage: "www.jordangraphics.eu",
};

/// user defined values
var user = {
    pattern: {
        PathItems: "<>",
        GroupItems: "()",
        CompoundPathItems: "++",
        GridRepeatItems: "||",
        RadialRepeatItems: "||",
        SymmetryRepeatItems: "||",
        TextFrames: "##",
        LegacyTextItems: "##",
        PluginItems: "**",
        /*
        No symbols are defined for the following items
        SymbolItems: "..",
        PlacedItems: "..",
        GraphItems: "..",
        MeshItems: "..",
        NonNativeItems: "..",
        EmbeddedItems: "..",
        RasterItems: "..",
        */
        ClippingMasks: "[]",
        fallback: "..", // not used
    },
};

/// function
var reName = function (itemList) {
    for (i = 0; i < itemList.length; i++) {
        if (itemList[i].name == "") continue; // if item not named, continue with the next one.
        if (itemList[i].typename == "GroupItem" && itemList[i].clipped) var pattern = user.pattern.ClippingMasks; // override pattern and regExp if it is a group and clipped -> ClippingMask

        var xName = itemList[i].name;
        for (var itemType in user.pattern) {
            var pat = user.pattern[itemType]; // get pattern text
            xName = xName.replace("/^(" + pat + ")", ""); // remove pattern at the beginning if found
            if (xName.search("\\" + pat[0]) >= 0 && xName.search("\\" + pat[1]) >= 0) { // remove any pattern as long as both are found
                xName = xName.replace(pat[0], "");
                xName = xName.replace(pat[1], "");
            }
            //if (xName.search("\\" + pat[0]) == 0 && xName.search("\\" + pat[1]) == xName.length) { // remove pattern at the start and end if found
            //    xName = xName.substring(1, xName.length - 1);
            //};
        }
        itemList[i].name = pattern + xName;
    }
};

var exeMain = function () {
    if (app.documents.length == 0) { // test if document is open
        alert("No active document was found.");
        return;
    };

    var srcDoc = app.activeDocument; // get active Document

    for (var key in user.pattern) {
        var callList = key[0].toLowerCase() + key.slice(1)
        if (srcDoc.hasOwnProperty(callList)) reName(srcDoc[callList]);
    }
}

/// start
exeMain()