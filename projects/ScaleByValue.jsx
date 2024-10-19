/// Const
var scriptConst = {
    name: "reSize",
    version: "1.1.2",
    date: "2024-10-17",
    author: "Philipp Jordan",
    webpage: "www.JordanGraphics.eu",
    description: "Resize the hight and width of selected items individually in relation ot a user defined center.",
    comment: "Stable version, fastest version."
};

var user = {
    constrain: false,
    refPoint: Transformation.CENTER,
    width: {
        value: "",
        math: null,
        string: "",
    },
    height: {
        value: "",
        math: null,
        string: "",
    },
    toClear: "width",
    lastInput: "height",
    undo: false, // defines if undo() function should be called 
    calcComplete: true,
};

//-------------------fucntions-------------------------
var jgAi = { // Adobe Illustrator helper functions
    minDistance: 0.0001,
    unit: { // list of possible units in Adobe illustrator
        mm: { // milimeters
            nameShort: "mm",
            nameLong: "millimeters",
            value: 2.8346455078125
        },
        cm: { // centimeters
            nameShort: "cm",
            nameLong: "centimeters",
            value: 2.8346455078125 * 10
        },
        inches: { // Inches
            nameShort: "in",
            nameLong: "inches",
            value: 72
        },
        picas: { // Picas
            nameShort: "pic",
            nameLong: "picas",
            value: 12
        },
        pixel: { /// pixel
            nameShort: "px",
            nameLong: "pixel",
            value: 1
        },
        Q: { //Qs, whatever that is
            nameShort: "q",
            nameLong: "qs",
            value: 0.709
        },
        points: { // points are the standard calculation in adobe illustrator
            nameShort: "pt",
            nameLong: "points",
            value: 1
        },
        non: {
            nameShort: "noUnit",
            nameLong: "noUnit",
            value: 1
        }
    },
    getGlobalUnit: function () { // get document units
        switch (app.activeDocument.rulerUnits) {
            case RulerUnits.Centimeters:
                return this.unit.cm;
            case RulerUnits.Inches:
                return this.unit.inches;
            case RulerUnits.Millimeters:
                return this.unit.mm;
            case RulerUnits.Picas:
                return this.unit.picas;
            case RulerUnits.Points:
                return this.unit.points;
            case RulerUnits.Qs:
                return this.unit.Q;
            case RulerUnits.Pixels:
                return this.unit.pixel;
            case RulerUnits.Unkown:
            default:
                return this.unit.non;
        }
    },
};

var jgUI = { // create & update UI
    txtTitel: scriptConst.name + " v" + scriptConst.version, // 
    txtInfo: scriptConst.webpage,
    miscTip: "a blank value \"\" resets the property to its original value.\na value of 0 will be ignored",
    constrainTip: "Keep the height and width for each item constraint individually.",

    createRefPoint: function (uiParent) { // create radiobutton grid to select reference point
        var rtnUI = new Object();
        rtnUI.btn = new Object();

        rtnUI.mainGrp = uiParent.add("group");
        rtnUI.mainGrp.orientation = "column";

        // first letter defines vertical position: T = top, C = center, B = bottom
        // second letter defines horizontal position: L = left, C = center, R = right

        var topGrp = rtnUI.mainGrp.add("group");
        rtnUI.btn.TL = topGrp.add("radiobutton")
        rtnUI.btn.TC = topGrp.add("radiobutton")
        rtnUI.btn.TR = topGrp.add("radiobutton")

        var centerGrp = rtnUI.mainGrp.add("group");
        rtnUI.btn.CL = centerGrp.add("radiobutton")
        rtnUI.btn.CC = centerGrp.add("radiobutton")
        rtnUI.btn.CR = centerGrp.add("radiobutton")

        var centerGrp = rtnUI.mainGrp.add("group");
        rtnUI.btn.BL = centerGrp.add("radiobutton")
        rtnUI.btn.BC = centerGrp.add("radiobutton")
        rtnUI.btn.BR = centerGrp.add("radiobutton")

        return rtnUI
    },
};

var jgExe = { // execution functions
    subSelect: function (srcSel) {
        var rtnArray = new Array();
        for (var i = 0; i < srcSel.length; i++) {
            if (srcSel[i].typename == "PathItem" && srcSel[i].guides) continue; // removes guides
            if (srcSel[i].typename == "TextFrame") continue; // removes textframes
            rtnArray.push(srcSel[i]);
        };
        return rtnArray;
    },
    getRefPosition: function (item, aiTransformation) {
        aiTransformation = typeof aiTransformation !== "undefined" ? aiTransformation : Transformation.TOPLEFT;
        switch (aiTransformation) {
            case Transformation.TOPLEFT:
                return [
                    item.position[0],
                    item.position[1]
                ]
            case Transformation.TOP:
                return [
                    item.position[0] + (item.width / 2),
                    item.position[1]
                ]
            case Transformation.TOPRIGHT:
                return [
                    item.position[0] + item.width,
                    item.position[1]
                ]
            case Transformation.LEFT:
                return [
                    item.position[0],
                    item.position[1] - (item.height / 2)
                ]
            case Transformation.CENTER:
                return [
                    item.position[0] + (item.width / 2),
                    item.position[1] - (item.height / 2)
                ]
            case Transformation.RIGHT:
                return [
                    item.position[0] + item.width,
                    item.position[1] - (item.height / 2)
                ]
            case Transformation.BOTTOMLEFT:
                return [
                    item.position[0],
                    item.position[1] - item.height
                ]
            case Transformation.BOTTOM:
                return [
                    item.position[0] + (item.width / 2),
                    item.position[1] - item.height
                ]
            case Transformation.BOTTOMRIGHT:
                return [
                    item.position[0] + item.width,
                    item.position[1] - item.height
                ]
            default:
                return [0, 0]
        }
    },
    getClip: function (item) {
        for (var n = 0; n < item.pageItems.length; n++) {
            if (item.pageItems[n].clipping) return item.pageItems[n];
        }
        return item;
    },
    getScaleFactor: function (item) {
        var globalUnit = jgAi.getGlobalUnit().value;
        var rtnScale = [1, 1];

        var calcScale = function (input, itemDim) {
            if (itemDim == 0) return 1;
            if (input.math == null) return (input.value * globalUnit) / itemDim;
            if (input.math == "+") return (itemDim + (input.value * globalUnit)) / itemDim;
            if (input.math == "-") return (itemDim - (input.value * globalUnit)) / itemDim;
            if (input.math == "*") return (itemDim * input.value) / itemDim;
            if (input.math == "/") return (itemDim / input.value) / itemDim;
        };

        var scaleWidth = calcScale(user.width, item.width)
        var scaleHeight = calcScale(user.height, item.height)
        
        if (!user.constrain) {
            rtnScale[0] = user.width.value == "" ? 1 : scaleWidth;
            rtnScale[1] = user.height.value == "" ? 1 : scaleHeight;
        } else if (user.constrain) {
            rtnScale[0] = user.width.value == "" ? scaleHeight : scaleWidth;
            rtnScale[1] = user.height.value == "" ? scaleWidth : scaleHeight;
            if (user.width.value == "" && user.height.value == "") rtnScale = [1, 1];
        };
        user.calcComplete = scaleWidth < 0 || scaleHeight < 0 ? false : true;
        return rtnScale;
    },
    transform: function (item) {
        var xItem = item.typename == "GroupItem" && item.clipped ? this.getClip(item) : item;

        var xRef = this.getRefPosition(xItem, user.refPoint);
        var xScale = this.getScaleFactor(xItem);
        var xPosition = [
            xRef[0] - ((xRef[0] - item.position[0]) * xScale[0]),
            xRef[1] - ((xRef[1] - item.position[1]) * xScale[1])
        ]
        item.resize(xScale[0] * 100, xScale[1] * 100);
        item.position = xPosition;
    },
    updateRefPoint: function (uiInput) {
        for (var i in uiRef.btn) uiRef.btn[i].value = false;
        uiInput.value = true;

        jgExe.updateTransform();
    },
    updateTxtInput: function () {
        if (user.constrain) {
            user[user.toClear].value = "";
            user[user.toClear].math = null;
            user[user.toClear].string = "";
        }
        jgExe.updateTransform();
        if (!user.calcComplete) {
            user.calcComplete = true;
            user[user.lastInput].value = "";
            user[user.lastInput].math = null;
            user[user.lastInput].string = "";
            jgExe.updateTransform();
        }

        uiWidth.input.text = user.width.string;
        uiHeight.input.text = user.height.string;
    },
    updateTransform: function () {
        if (user.undo) app.undo();
        for (var i = 0; i < srcItems.length; i++) jgExe.transform(srcItems[i])
        app.redraw();
        user.undo = true;
    },
    evalTxtInput: function (xString) {
        if (xString == "") return { value: xString, math: null, string: xString } // check if blank: allows computation

        xString = xString.replace(",", "."); //convert , to .
        xString = xString.toLowerCase(); //convert all to lower case. Makes it easier to search for units

        xString = jgExe.convertUnit(xString); // allows computation

        xString = xString.replace(RegExp("[^0-9.+*/-]", "g"), ""); // get rid of anyhting else than numbers or standard math symbols  

        var mathOperator = xString.match(RegExp("^[\+\-\/\*]"));
        xString = mathOperator == null ? xString : xString.substr(1);

        xString = eval(xString) === "undefined" ? "" : eval(xString); // evaluate computation
        xString = jgExe.checkMinValue(xString); // converts 0 to a minimal value

        return {
            value: xString,
            math: mathOperator,
            string: mathOperator == null ? xString : (mathOperator + " " + xString),
        }
    },
    convertUnit: function (xString) { // converts input units to document units
        var globalUnit = jgAi.getGlobalUnit().value;
        var units = jgAi.unit;
        var regFindNum = "[0-9]*\\.?[0-9]*";

        var matched = new Array();
        for (var nUnit in units) { // create a array of all found matches
            var match = xString.match(RegExp(regFindNum + " ?" + units[nUnit].nameShort, "g"));
            if (match == null) continue;
            var value = xString.match(RegExp(regFindNum)) * units[nUnit].value / globalUnit;
            matched.push([match, value])
        }

        for (var i = 0; i < matched.length; i++) xString = xString.replace(matched[0], matched[1]);
        return xString
    },
    checkMinValue: function (xValue) {
        var minDist = jgAi.minDistance;
        var globalUnit = jgAi.getGlobalUnit().value;
        if (xValue == 0) return "";
        if (xValue * globalUnit <= minDist) return (minDist / globalUnit);
        return xValue
    },
}

var exeMain = function () { // main function
    if (app.documents.length = 0) {
        alert("No active document was found.");
        return;
    }

    srcItems = jgExe.subSelect(app.activeDocument.selection); // get all items (no textframe , no guides)

    if (srcItems.length <= 1) {
        alert("One or less items were selected.");
        return;
    }

    uiWidth.unit.text = uiHeight.unit.text = jgAi.getGlobalUnit().nameShort; // set text for glogal unit
    uiWidth.input.text = user.width.string; // set initial values
    uiHeight.input.text = user.height.string; // set initial values

    uiWidth.input.active = true; // set width input active, to enable a direct start
    jgExe.updateRefPoint(uiRef.btn.CC); // set uiRefPoint to center

    mainWindow.show();
}

//--------------------UI------------------------

/// mainWindow
mainWindow = new Window("dialog")
mainWindow.text = jgUI.txtTitel;

/// uiGroupRadio
uiRef = jgUI.createRefPoint(mainWindow);

// constrain
uiConstrain = mainWindow.add("checkbox {text: 'Constrain proportions'}");
uiConstrain.helpTip = jgUI.constrainTip;

// width input
uiWidth = new Object();
uiWidth.Grp = mainWindow.add("group") // create width Group

uiWidth.dimension = uiWidth.Grp.add("statictext {text: 'Width', justify: 'right'}");
uiWidth.input = uiWidth.Grp.add("edittext");
uiWidth.unit = uiWidth.Grp.add("statictext");

uiWidth.dimension.preferredSize.width = 40;
uiWidth.input.preferredSize.width = 80;
uiWidth.unit.preferredSize.width = 26;

uiWidth.dimension.helpTip = uiWidth.input.helpTip = jgUI.miscTip;

// height input
uiHeight = new Object();
uiHeight.Grp = mainWindow.add("group") // create height Group

uiHeight.dimension = uiHeight.Grp.add("statictext {text: 'Height', justify: 'right'}");
uiHeight.input = uiHeight.Grp.add("edittext");
uiHeight.unit = uiHeight.Grp.add("statictext");

uiHeight.dimension.preferredSize.width = 40;
uiHeight.input.preferredSize.width = 80;
uiHeight.unit.preferredSize.width = 26;

uiHeight.dimension.helpTip = uiHeight.input.helpTip = jgUI.miscTip;

/// uiExe
uiExe = mainWindow.add("group");
var exeCancel = uiExe.add("button {text: 'Cancel'}");
var exeOK = uiExe.add("button {text: 'OK'}");

/// info
mainWindow.add("statictext").text = jgUI.txtInfo;


//---------------Ui Eventhandler---------------------
uiRef.btn.TL.onClick = function () {
    user.refPoint = Transformation.TOPLEFT;
    jgExe.updateRefPoint(this);
};
uiRef.btn.TC.onClick = function () {
    user.refPoint = Transformation.TOP;
    jgExe.updateRefPoint(this);
};
uiRef.btn.TR.onClick = function () {
    user.refPoint = Transformation.TOPRIGHT;
    jgExe.updateRefPoint(this);
};
uiRef.btn.CL.onClick = function () {
    user.refPoint = Transformation.LEFT;
    jgExe.updateRefPoint(this);
};
uiRef.btn.CC.onClick = function () {
    user.refPoint = Transformation.CENTER;
    jgExe.updateRefPoint(this);
};
uiRef.btn.CR.onClick = function () {
    user.refPoint = Transformation.RIGHT;
    jgExe.updateRefPoint(this);
};
uiRef.btn.BL.onClick = function () {
    user.refPoint = Transformation.BOTTOMLEFT;
    jgExe.updateRefPoint(this);
};
uiRef.btn.BC.onClick = function () {
    user.refPoint = Transformation.BOTTOM;
    jgExe.updateRefPoint(this);
};
uiRef.btn.BR.onClick = function () {
    user.refPoint = Transformation.BOTTOMRIGHT;
    jgExe.updateRefPoint(this);
};

uiConstrain.onClick = function () {
    user.constrain = this.value;
    jgExe.updateTxtInput();
};

uiWidth.input.onChange = function () {
    user.width = jgExe.evalTxtInput(this.text) // transforms inoput to a number (incl. calculation, test for minimal value)
    user.toClear = "height";
    user.lastInput = "width";
    jgExe.updateTxtInput();
};
uiHeight.input.onChange = function () {
    user.height = jgExe.evalTxtInput(this.text); // transforms inoput to a number (incl. calculation, test for minimal value)
    user.toClear = "width";
    user.lastInput = "height";
    jgExe.updateTxtInput();
}

exeOK.onClick = function () {
    mainWindow.close();
}

exeCancel.onClick = function () {
    if (user.undo) app.undo();
    app.redraw();
    mainWindow.close();
}


//---------------Start Program---------------------
exeMain();