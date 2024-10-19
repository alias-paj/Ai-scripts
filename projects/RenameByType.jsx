/// Const
var scriptConst = {
    name: "BatchRename",
    version: "1.0",
    date: "16.10.2024",
    author: "Philipp Jordan",
    webpage: "www.jordangraphics.eu",
};

/// function
var reName = function (xList, regExp, pattern, isGroup) {
    var regExp = typeof regExp == "undefined" ? /^(\.\.)+/ : regExp;    // set default regExp value to  /^(\.\.)+/
    var pattern = typeof pattern == "undefined" ? ".." : pattern;       // set default pattern value to ".."      
    var isGroup = typeof isGroup == "undefined" ? false : true;         // set default isGroup value to false
    for (i = 0; i < xList.length; i++) {
        if (isGroup && xList[i].clipped) { // override pattern and regExp if it is a group and clipped -> ClippingMask
            var pattern = "[]";
            var regExp = /^(\[\])+/;
        }
        if (xList[i].name != "" && xList[i].name.search(regExp) != 0) xList[i].name = (pattern + xList[i].name);
    }
};

var exeMain = function () {
    if (app.documents.length == 0) { // test if document is open
        alert("No active document was found.");
        return;
    };

    srcDoc = app.activeDocument; // get active Document

    reName(srcDoc.pathItems, /^(\<\>)+/, "<>");

    reName(srcDoc.groupItems, /^(\(\))+/, "()", true); //Groups are renamed seperately due to clipping value

    reName(srcDoc.compoundPathItems, /^(\+\+)+/, "++");

    reName(srcDoc.gridRepeatItems, /^(\|\|)+/, "||");
    reName(srcDoc.radialRepeatItems, /^(\|\|)+/, "||");
    reName(srcDoc.symmetryRepeatItems, /^(\|\|)+/, "||");

    reName(srcDoc.textFrames, /^##+/, "##");
    reName(srcDoc.legacyTextItems, /^##+/, "##");

    reName(srcDoc.pluginItems, /^(\*\*)+/, "**");

    // items not used often
    reName(srcDoc.symbolItems);
    reName(srcDoc.placedItems);
    reName(srcDoc.graphItems);
    reName(srcDoc.meshItems);
    reName(srcDoc.nonNativeItems);
    reName(srcDoc.embeddedItems);
    reName(srcDoc.rasterItems);
}

/// start
exeMain()