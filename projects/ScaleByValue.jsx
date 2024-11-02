/// Const
var scriptConst = {
    name: "reSize",
    version: "1.2.0",
    date: "2024-10-30",
    author: "Philipp Jordan",
    webpage: "www.JordanGraphics.eu",
    description: "Resize the hight and width of selected items individually in relation ot a user defined center.",
    comment: "Stable version, fastest version."
};

var user = {
    constrain: false,
    refPoint: Transformation.CENTER,
    toClear: "width",
    undo: false, // defines if undo() function should be called 
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
};

//-------------------fucntions-------------------------
var jgAi = { // Adobe Illustrator helper functions
    minDistance: 0.0001,
    maxCanvasLarge: 163822, // maximal canvas size in pixel, height and width
    maxCanvasSmall: 163822, //
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
    minDistanceCheck: function (xValue) {
        var minDist = this.minDistance;
        var globalUnit = this.getGlobalUnit().value;
        if (xValue == 0) return "";
        if (xValue * globalUnit <= minDist) return (minDist / globalUnit);
        return xValue
    },
};

var jgUI = { // create & update UI
    txtTitel: scriptConst.name + " v" + scriptConst.version, // 
    txtInfo: scriptConst.webpage,
    miscTip: "a blank value \"\" resets the property to its original value.\na value of 0 will be ignored",
    constrainTip: "Keep the height and width for each item constraint individually.",
    createRefPoint: function (uiParent) { // create radiobutton grid to select reference point
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

        var centerGrp = mainGrp.add("group");
        rtnUI.BL = centerGrp.add("radiobutton")
        rtnUI.BC = centerGrp.add("radiobutton")
        rtnUI.BR = centerGrp.add("radiobutton")

        for (var i in rtnUI) rtnUI[i].value = false;

        return rtnUI
    },
    updateTransform: function (srcItems) {
        if (user.undo) app.undo(); // undo the previous step to get back to the inital state
        var calcProps = jgTransform.calc(srcItems); // calcualte the new values

        if (jgTransform.check(calcProps)) { // check if the calculated values are possible
            user.undo = true; // toggle undo to be executed the next time
            jgTransform.set(srcItems, calcProps); // set the new values
        } else {
            user.undo = false; // toggle undo to be NOT executed the next time, since the script is at the inital point.
            user.width.value = user.height.value = ""; // reset the user's values to the initial state
            user.width.math = user.height.math = null; // reset the user's values to the initial state
            user.width.string = user.height.string = ""; // reset the user's values to the initial state
        }
        app.redraw(); // redraw the screen
    },
    inputTxt: function () {
        if (user.constrain) {
            user[user.toClear].value = "";
            user[user.toClear].math = null;
            user[user.toClear].string = "";
        }
        this.updateTransform(srcItems);

        uiWidth.input.text = user.width.string;
        uiHeight.input.text = user.height.string;
    },
    inputRefPoint: function (uiInput) {
        for (var i in uiRef) uiRef[i].value = false;
        uiInput.value = true;

        this.updateTransform(srcItems)
    },
};

var jgTransform = {
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
    getScale: function (item) {
        if (user.width.value == "" && user.height.value == "") return [1, 1]; // check if values are set and return [1,1] as non scaling factor if it is not

        var globalUnit = jgAi.getGlobalUnit().value;
        var rtnScale = [1, 1];

        var calcScale = function (inputValue, itemValue) {
            if (itemValue == 0) return 1;
            if (inputValue.math == null) return (inputValue.value * globalUnit) / itemValue;
            if (inputValue.math == "+") return (itemValue + (inputValue.value * globalUnit)) / itemValue;
            if (inputValue.math == "-") return (itemValue - (inputValue.value * globalUnit)) / itemValue;
            if (inputValue.math == "*") return (itemValue * inputValue.value) / itemValue;
            if (inputValue.math == "/") return (itemValue / inputValue.value) / itemValue;
        };

        var scaleWidth = calcScale(user.width, item.width)
        var scaleHeight = calcScale(user.height, item.height)

        if (!user.constrain) {
            rtnScale[0] = user.width.value == "" ? 1 : scaleWidth;
            rtnScale[1] = user.height.value == "" ? 1 : scaleHeight;
        } else if (user.constrain) {
            rtnScale[0] = user.width.value == "" ? scaleHeight : scaleWidth;
            rtnScale[1] = user.height.value == "" ? scaleWidth : scaleHeight;
        };
        return rtnScale
    },
    set: function (srcItems, propItems) {
        for (var i = 0; i < srcItems.length; i++) {
            srcItems[i].width = propItems[i].width;
            srcItems[i].height = propItems[i].height;
            srcItems[i].position = propItems[i].position;
        }
    },
    check: function (items) {
        var minDist = jgAi.minDistance; // minimum Distance in points

        for (var i = 0; i < items.length; i++) {
            if (items[i].width < minDist || items[i].height < minDist) return false; // Check item bounds minimal Distance or negative
            // A general check if the items falls of the canvas is not yet implemented. I don't find a way to get absolute position on the canvas.
        }
        return true // if all good return true
    },
    calc: function (srcItems) {
        var rtnTransform = new Array()

        for (var i = 0; i < srcItems.length; i++) {
            var item = srcItems[i];
            var xItem = item.typename == "GroupItem" && item.clipped ? this.getClip(item) : item; // check if item is clipping maks and use clipping mask as reference instead.

            var xRef = this.getRefPosition(xItem, user.refPoint);
            var xScale = this.getScale(xItem);

            var rtnItem = {
                width: item.width * xScale[0],
                height: item.height * xScale[1],
                position: [
                    xRef[0] - ((xRef[0] - item.position[0]) * xScale[0]), // top
                    xRef[1] - ((xRef[1] - item.position[1]) * xScale[1]) // left
                ]
            };
            rtnTransform.push(rtnItem);
        }
        return rtnTransform
    },
};

var jgTxt = {
    evalInput: function (xString) {
        if (xString == "") return {
            value: xString,
            math: null,
            string: xString
        } // check if blank: allows computation

        xString = xString.replace(",", "."); //convert , to .
        xString = xString.toLowerCase(); //convert all to lower case. Makes it easier to search for units

        xString = this.unitConvert(xString); // allows computation

        xString = xString.replace(RegExp("[^0-9.+*/-]", "g"), ""); // get rid of anyhting else than numbers or standard math symbols  

        var mathOperator = xString.match(RegExp("^[\+\-\/\*]"));
        xString = mathOperator == null ? xString : xString.substr(1);

        xString = eval(xString) === "undefined" ? "" : eval(xString); // evaluate computation
        xString = jgAi.minDistanceCheck(xString); // converts 0 to a minimal value

        return {
            value: xString,
            math: mathOperator,
            string: mathOperator == null ? xString : (mathOperator + " " + xString),
        }
    },
    unitConvert: function (xString) { // converts input units to document units
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
}

//--------------------main function------------------------
var exeMain = function () {
    if (app.documents.length = 0) { // check if document is open
        alert("No active document was found.");
        return;
    }

    // get all items (no textframe , no guides)
    srcItems = new Array();
    for (var i = 0; i < app.activeDocument.selection.length; i++) {
        var xItem = app.activeDocument.selection[i];
        if (xItem.typename == "PathItem" && xItem.guides) continue; // removes guides
        if (xItem.typename == "TextFrame") continue; // removes textframes
        srcItems.push(xItem);
    };

    if (srcItems.length <= 1) { // check if more than 1 item were selected
        alert("One or less items were selected.");
        return;
    }

    uiWidth.unit.text = uiHeight.unit.text = jgAi.getGlobalUnit().nameShort; // set text for global unit
    uiWidth.input.active = true; // set width input active, to enable a direct start
    uiRef.CC.value = true; // set uiRefPoint to center

    mainWindow.show();
}

//--------------------UI------------------------

/// mainWindow
mainWindow = new Window("dialog")
mainWindow.text = jgUI.txtTitel;
mainWindow.spacing = 6;

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
uiRef.TL.onClick = function () {
    user.refPoint = Transformation.TOPLEFT;
    jgUI.inputRefPoint(this);
};
uiRef.TC.onClick = function () {
    user.refPoint = Transformation.TOP;
    jgUI.inputRefPoint(this);
};
uiRef.TR.onClick = function () {
    user.refPoint = Transformation.TOPRIGHT;
    jgUI.inputRefPoint(this);
};
uiRef.CL.onClick = function () {
    user.refPoint = Transformation.LEFT;
    jgUI.inputRefPoint(this);
};
uiRef.CC.onClick = function () {
    user.refPoint = Transformation.CENTER;
    jgUI.inputRefPoint(this);
};
uiRef.CR.onClick = function () {
    user.refPoint = Transformation.RIGHT;
    jgUI.inputRefPoint(this);
};
uiRef.BL.onClick = function () {
    user.refPoint = Transformation.BOTTOMLEFT;
    jgUI.inputRefPoint(this);
};
uiRef.BC.onClick = function () {
    user.refPoint = Transformation.BOTTOM;
    jgUI.inputRefPoint(this);
};
uiRef.BR.onClick = function () {
    user.refPoint = Transformation.BOTTOMRIGHT;
    jgUI.inputRefPoint(this);
};

uiConstrain.onClick = function () {
    user.constrain = this.value;
    jgUI.inputTxt();
};

uiWidth.input.onChange = function () {
    user.width = jgTxt.evalInput(this.text) // transforms inoput to a number (incl. calculation, test for minimal value)
    user.toClear = "height";
    jgUI.inputTxt();
};
uiHeight.input.onChange = function () {
    user.height = jgTxt.evalInput(this.text); // transforms inoput to a number (incl. calculation, test for minimal value)
    user.toClear = "width";
    jgUI.inputTxt();
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