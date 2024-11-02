/// Const
var scriptConst = {
    name: "rePlace",
    version: "1.0.1",
    date: "2024-11-01",
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
        //creates a 3 by 3 grid of radiobuttons mimiking the Reference Point layout in Illustrator
        var rtnUI = new Object();

        var mainGrp = uiParent.add("group");
        mainGrp.orientation = "column";

        // first letter defines vertical position: T = top, C = center, B = bottom
        // second letter defines horizontal position: L = left, C = center, R = right

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
    updateRefPoint: function (uiInput) {
        // updates the reference point layout and the items drawn
        for (var i in uiRef) uiRef[i].value = false; // deactives all radiobuttons in the reference point grid (value = false)
        uiInput.value = true; // activates the ticked radiobutton

        // Check if constrains are set and disable the corresponding radiobuttons
        // You can't choose left or right if you already scaled the items to the width
        uiRef.CL.enabled = uiRef.CR.enabled = !uiConstrain.width.value; 
        uiRef.TC.enabled = uiRef.BC.enabled = !uiConstrain.height.value;
        uiRef.TL.enabled = uiRef.TR.enabled = uiRef.BL.enabled = uiRef.BR.enabled = uiConstrain.width.value || uiConstrain.height.value ? false : true;

        jgExe.updateTransform(); // updates the items position
    },
    updateWidth: function () {
        // sets the new reference point after the contrain was ticked
        // left and right will be set to center
        if (uiRef.TL.value || uiRef.TC.value || uiRef.TR.value) {
            jgUI.updateRefPoint(uiRef.TC);
            user.refPoint = Transformation.TOP;
        } else if (uiRef.CL.value || uiRef.CC.value || uiRef.CR.value) {
            jgUI.updateRefPoint(uiRef.CC);
            user.refPoint = Transformation.CENTER;
        } else if (uiRef.BL.value || uiRef.BC.value || uiRef.BR.value) {
            jgUI.updateRefPoint(uiRef.BC);
            user.refPoint = Transformation.BOTTOM;
        };
    },
    updateHeight: function () {
        // sets the new reference point after the contrain was ticked
        // top and bottom will be set to center
        if (uiRef.TL.value || uiRef.CL.value || uiRef.BL.value) {
            user.refPoint = Transformation.LEFT;
            jgUI.updateRefPoint(uiRef.CL);
        } else if (uiRef.TC.value || uiRef.CC.value || uiRef.BC.value) {
            user.refPoint = Transformation.CENTER;
            jgUI.updateRefPoint(uiRef.CC);
        } else if (uiRef.TR.value || uiRef.CR.value || uiRef.BR.value) {
            user.refPoint = Transformation.RIGHT;
            jgUI.updateRefPoint(uiRef.CR);
        };
    },

};

var jgExe = { // execution functions
    getRefPosition: function (item, refPoint) {
        // gets the position of the reference point relative to item position
        refPoint = typeof refPoint !== "undefined" ? refPoint : Transformation.TOPLEFT;
        switch (refPoint) {
            case Transformation.TOPLEFT:
                return [
                    0,
                    0
                ]
            case Transformation.TOP:
                return [
                    0 + (item.width / 2),
                    0
                ]
            case Transformation.TOPRIGHT:
                return [
                    0 + item.width,
                    0
                ]
            case Transformation.LEFT:
                return [
                    0,
                    0 - (item.height / 2)
                ]
            case Transformation.CENTER:
                return [
                    0 + (item.width / 2),
                    0 - (item.height / 2)
                ]
            case Transformation.RIGHT:
                return [
                    0 + item.width,
                    0 - (item.height / 2)
                ]
            case Transformation.BOTTOMLEFT:
                return [
                    0,
                    0 - item.height
                ]
            case Transformation.BOTTOM:
                return [
                    0 + (item.width / 2),
                    0 - item.height
                ]
            case Transformation.BOTTOMRIGHT:
                return [
                    0 + item.width,
                    0 - item.height
                ]
            default:
                return [0, 0]
        }
    },
    createItem: function (item, user) {
        var newItem = user.keyItem.duplicate(item, ElementPlacement.PLACEBEFORE); // creates a new item based on the KEY item

        newItem.width = user.chngWidth ? item.width : newItem.width; // set width to NEW or KEY item depending on users contrain
        newItem.height = user.chngHeight ? item.height : newItem.height; // set height to NEW or KEY item depending on users contrain

        newItem.name = item.name; // rename the item to KEY item's name
        newItem.opacity /= user.chngOpacity; // lower the opacity, value set in the user object

        var srcRef = this.getRefPosition(item, user.refPoint); // calcualte the relative reference position of the KEY item
        var keyRef = this.getRefPosition(newItem, user.refPoint); // calcualte the relative reference position of the OLD item

        newItem.position = item.position.add(srcRef).substract(keyRef); // change the position of the new item by adding relative reference position of the OLD item and subtracting the NEW

        if (user.remove) item.remove(); // remove the OLD item if true. Will be called once by "OK"
    },
    updateTransform: function () {
        if (user.undo) app.undo(); 
        for (var i = 0; i < srcItems.length; i++) this.createItem(srcItems[i], user); // creates for all selected items a new duplicate of the KEY item
        app.redraw(); // updates the drawing area
        user.undo = true; // toggles undo to be execute the next time
    },
}

var exeMain = function () { // main function
    if (app.documents.length = 0) {
        alert("No active document was found.");
        return;
    };

    srcItems = new Array();
    for (var i = 0; i < app.activeDocument.selection.length; i++) {
        var xItem = app.activeDocument.selection[i];
        if (xItem.typename == "PathItem" && xItem.guides) continue; // removes guides
        if (xItem.typename == "GroupItem" && xItem.clipped) continue; // removes clipping masks
        if (xItem.typename == "TextFrame") continue; // removes textframes
        srcItems.push(xItem);
    };

    if (srcItems.length <= 1) {
        alert("One or less items were selected.");
        return;
    };

    user.keyItem = srcItems.shift();
    jgUI.updateRefPoint(uiRef.CC)

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
    jgUI.updateRefPoint(this);
};
uiRef.TC.onClick = function () {
    user.refPoint = Transformation.TOP;
    jgUI.updateRefPoint(this);
};
uiRef.TR.onClick = function () {
    user.refPoint = Transformation.TOPRIGHT;
    jgUI.updateRefPoint(this);
};
uiRef.CL.onClick = function () {
    user.refPoint = Transformation.LEFT;
    jgUI.updateRefPoint(this);
};
uiRef.CC.onClick = function () {
    user.refPoint = Transformation.CENTER;
    jgUI.updateRefPoint(this);
};
uiRef.CR.onClick = function () {
    user.refPoint = Transformation.RIGHT;
    jgUI.updateRefPoint(this);
};
uiRef.BL.onClick = function () {
    user.refPoint = Transformation.BOTTOMLEFT;
    jgUI.updateRefPoint(this);
};
uiRef.BC.onClick = function () {
    user.refPoint = Transformation.BOTTOM;
    jgUI.updateRefPoint(this);
};
uiRef.BR.onClick = function () {
    user.refPoint = Transformation.BOTTOMRIGHT;
    jgUI.updateRefPoint(this);
};

uiConstrain.width.onClick = function () {
    user.chngWidth = this.value;
    jgUI.updateWidth(this.value);
}

uiConstrain.height.onClick = function () {
    user.chngHeight = this.value;
    jgUI.updateHeight(this.value);
}

exeOK.onClick = function () {
    user.remove = true;
    user.chngOpacity = 1;
    jgExe.updateTransform()
    mainWindow.close();
}

exeCancel.onClick = function () {
    app.undo();
    app.redraw();
    mainWindow.close();
}


//---------------Start Program---------------------
exeMain();