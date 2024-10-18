/// Const
var scriptConst = {
    name: "rePlace",
    version: "1.0.1",
    date: "2022-12-25",
    author: "Philipp Jordan",
    webpage: "www.JordanGraphics.eu",
    description: "Replaces all items with the first item in the list.",
    comment: "Stable version, fastest version."
};

var user = {
    chngWidth: false,
    chngHeight: false,
    chngOpacity: 3, // devides the opacity by the given value
    refPoint: Transformation.CENTER,
    undo: false,
    remove: false,
};

Array.prototype.add = function (value) {
    // does not test if calculation is possible
    switch (typeof value) {
        case "number":
            for (var i = 0; i < this.length; i++) {
                this[i] = this[i] + value;
            };
            return this;
        case "object":
            if (this.length = value.length) {
                for (var i = 0; i < this.length; i++) {
                    this[i] = this[i] + value[i];
                };
                return this;
            }
        default:
            return "undefined";
    };
}

Array.prototype.substract = function (value) {
    // does not test if calculation is possible
    switch (typeof value) {
        case "number":
            for (var i = 0; i < this.length; i++) {
                this[i] = this[i] - value;
            };
            return this;
        case "object":
            if (this.length = value.length) {
                for (var i = 0; i < this.length; i++) {
                    this[i] = this[i] - value[i];
                };
                return this;
            }
        default:
            return "undefined";
    };
}

//-------------------fucntions-------------------------

var jgUI = { // create & update UI
    txtTitel: scriptConst.name + " v" + scriptConst.version, // 
    txtInfo: scriptConst.webpage,

    createRefPoint: function (uiParent) {
        var rtnUI = new Object();

        var mainGrp = uiParent.add("group");
        mainGrp.orientation = "column";

        var topGrp = mainGrp.add("group");
        rtnUI.TL = topGrp.add("radiobutton")
        rtnUI.TC = topGrp.add("radiobutton")
        rtnUI.TR = topGrp.add("radiobutton")

        var centerGrp = mainGrp.add("group");
        rtnUI.CL = centerGrp.add("radiobutton")
        rtnUI.CC = centerGrp.add("radiobutton")
        rtnUI.CR = centerGrp.add("radiobutton")

        var bottomGrp = mainGrp.add("group");
        rtnUI.BL = bottomGrp.add("radiobutton")
        rtnUI.BC = bottomGrp.add("radiobutton")
        rtnUI.BR = bottomGrp.add("radiobutton")

        return rtnUI
    },
    updtRefPnt: function (uiInput) {
        for (var i in uiRef) uiRef[i].value = false;
        uiInput.value = true;

        uiRef.CL.enabled = uiRef.CR.enabled = !uiConstrain.width.value;
        uiRef.TC.enabled = uiRef.BC.enabled = !uiConstrain.height.value;
        uiRef.TL.enabled = uiRef.TR.enabled = uiRef.BL.enabled = uiRef.BR.enabled = uiConstrain.width.value || uiConstrain.height.value ? false : true;
    },
    updtWidth: function () {
        if (uiRef.TL.value || uiRef.TC.value || uiRef.TR.value) {
            jgUI.updtRefPnt(uiRef.TC);
            user.refPoint = Transformation.TOP;
        } else if (uiRef.CL.value || uiRef.CC.value || uiRef.CR.value) {
            jgUI.updtRefPnt(uiRef.CC);
            user.refPoint = Transformation.CENTER;
        } else if (uiRef.BL.value || uiRef.BC.value || uiRef.BR.value) {
            jgUI.updtRefPnt(uiRef.BC);
            user.refPoint = Transformation.BOTTOM;
        };
    },
    updtHeight: function () {
        if (uiRef.TL.value || uiRef.CL.value || uiRef.BL.value) {
            jgUI.updtRefPnt(uiRef.CL);
            user.refPoint = Transformation.LEFT;
        } else if (uiRef.TC.value || uiRef.CC.value || uiRef.BC.value) {
            jgUI.updtRefPnt(uiRef.CC);
            user.refPoint = Transformation.CENTER;
        } else if (uiRef.TR.value || uiRef.CR.value || uiRef.BR.value) {
            jgUI.updtRefPnt(uiRef.CR);
            user.refPoint = Transformation.RIGHT;
        };
    },
    updtTransform: function () {
        app.undo();
        for (var i = 0; i < srcItems.length; i++) jgExe.createItem(srcItems[i], user);
        app.redraw();
        user.undo = true;
    },
};

var jgExe = { // execution functions
    subSelect: function (srcSel) {
        var rtnArray = new Array();
        for (var i = 0; i < srcSel.length; i++) {
            if (srcSel[i].typename == "PathItem" && srcSel[i].guides) continue; // removes guides
            if (srcSel[i].typename == "GroupItem" && srcSel[i].clipped) continue; // removes clipping masks
            if (srcSel[i].typename == "TextFrame") continue; // removes textframes
            rtnArray.push(srcSel[i]);
        };
        return rtnArray;
    },
    getRefPosition: function (item, refPoint) {
        refPoint = typeof refPoint !== "undefined" ? refPoint : Transformation.TOPLEFT;
        switch (refPoint) {
            case Transformation.TOPLEFT:
                return [0, 0]
            case Transformation.TOP:
                return [0 + (item.width / 2), 0]
            case Transformation.TOPRIGHT:
                return [0 + item.width, 0]
            case Transformation.LEFT:
                return [0, 0 - (item.height / 2)]
            case Transformation.CENTER:
                return [0 + (item.width / 2), 0 - (item.height / 2)]
            case Transformation.RIGHT:
                return [0 + item.width, 0 - (item.height / 2)]
            case Transformation.BOTTOMLEFT:
                return [0, 0 - item.height]
            case Transformation.BOTTOM:
                return [0 + (item.width / 2), 0 - item.height]
            case Transformation.BOTTOMRIGHT:
                return [0 + item.width, 0 - item.height]
            default:
                return [0, 0]
        }
    },
    createItem: function (item, user) {
        var newItem = user.keyItem.duplicate(item, ElementPlacement.PLACEBEFORE);

        if (newItem.width != 0) newItem.width = user.chngWidth ? item.width : newItem.width;
        if (newItem.height != 0) newItem.height = user.chngHeight ? item.height : newItem.height;

        newItem.name = item.name;
        newItem.opacity /= user.chngOpacity;

        var srcRef = this.getRefPosition(item, user.refPoint);
        var keyRef = this.getRefPosition(newItem, user.refPoint);

        newItem.position = item.position.add(srcRef).substract(keyRef);

        if (user.remove) item.remove();
    },
}

var exeMain = function () { // main function
    if (app.documents.length = 0) {
        alert("No active document was found.");
        return;
    };

    srcItems = jgExe.subSelect(app.activeDocument.selection); // get all items (no textframe , no guides)

    if (srcItems.length <= 1) {
        alert("One or less items were selected.");
        return;
    };

    user.keyItem = srcItems.shift();

    uiRef.CC.value = true
    uiConstrain.width.enabled = user.keyItem.width == 0 ? false : true;
    uiConstrain.height.enabled = user.keyItem.height == 0 ? false : true;

    for (var i = 0; i < srcItems.length; i++) jgExe.createItem(srcItems[i], user);
    app.redraw();

    mainWindow.show();
}

//--------------------UI------------------------

/// mainWindow
mainWindow = new Window("dialog")
mainWindow.text = jgUI.txtTitel;

/// uiGroupRadio
uiRef = jgUI.createRefPoint(mainWindow);

// constrain
uiConstrain = new Object();
uiConstrain.panel = mainWindow.add('panel');
uiConstrain.panel.text = "Scale item by";
uiConstrain.panel.orientation = 'row'
uiConstrain.panel.alignment = ["fill", "top"];

uiConstrain.width = uiConstrain.panel.add('checkbox {text: "Width"}');
uiConstrain.height = uiConstrain.panel.add('checkbox {text: "Height"}');

/// uiExe
uiExe = mainWindow.add("group");
var exeCancel = uiExe.add("button {text: 'Cancel'}");
var exeOK = uiExe.add("button {text: 'OK'}");

/// info
mainWindow.add("statictext").text = jgUI.txtInfo;


//---------------Ui Eventhandler---------------------
uiRef.TL.onClick = function () {
    user.refPoint = Transformation.TOPLEFT;
    jgUI.updtRefPnt(this);
    jgUI.updtTransform();
};
uiRef.TC.onClick = function () {
    user.refPoint = Transformation.TOP;
    jgUI.updtRefPnt(this);
    jgUI.updtTransform();
};
uiRef.TR.onClick = function () {
    user.refPoint = Transformation.TOPRIGHT;
    jgUI.updtRefPnt(this);
    jgUI.updtTransform();
};
uiRef.CL.onClick = function () {
    user.refPoint = Transformation.LEFT;
    jgUI.updtRefPnt(this);
    jgUI.updtTransform();
};
uiRef.CC.onClick = function () {
    user.refPoint = Transformation.CENTER;
    jgUI.updtRefPnt(this);
    jgUI.updtTransform();
};
uiRef.CR.onClick = function () {
    user.refPoint = Transformation.RIGHT;
    jgUI.updtRefPnt(this);
    jgUI.updtTransform();
};
uiRef.BL.onClick = function () {
    user.refPoint = Transformation.BOTTOMLEFT;
    jgUI.updtRefPnt(this);
    jgUI.updtTransform();
};
uiRef.BC.onClick = function () {
    user.refPoint = Transformation.BOTTOM;
    jgUI.updtRefPnt(this);
    jgUI.updtTransform();
};
uiRef.BR.onClick = function () {
    user.refPoint = Transformation.BOTTOMRIGHT;
    jgUI.updtRefPnt(this);
    jgUI.updtTransform();
};

uiConstrain.width.onClick = function () {
    user.chngWidth = this.value;
    jgUI.updtWidth(this.value);
    jgUI.updtTransform();
}

uiConstrain.height.onClick = function () {
    user.chngHeight = this.value;
    jgUI.updtHeight(this.value);
    jgUI.updtTransform();
}

exeOK.onClick = function () {
    user.remove = true;
    user.chngOpacity = 1;
    jgUI.updtTransform()
    mainWindow.close();
}

exeCancel.onClick = function () {
    app.undo();
    app.redraw();
    mainWindow.close();
}


//---------------Start Program---------------------
exeMain();