/// constants
var scriptConst = {
    name: "Subselect",
    version: "1.1.3",
    date: "09.12.2022",
    author: "Philipp Jordan",
    description: "",
    required: "",
};

Array.prototype.min = function () {
    var rtnMin = this[0];
    for (var i = 1; i < this.length; i++) {
        rtnMin = this[i] < rtnMin ? this[i] : rtnMin;
    }
    return rtnMin;
}

Array.prototype.max = function () {
    var rtnMax = this[0];
    for (var i = 1; i < this.length; i++) {
        rtnMax = this[i] > rtnMax ? this[i] : rtnMax;
    }
    return rtnMax;
}


//-------------------------- functions --------------------------

var jgAi = {
    minDistance: 0.0001,
    unit: {
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
    getGlobalUnit: function (srcDoc) {
        srcDoc = typeof srcDoc !== 'undefined' ? srcDoc : app.activeDocument;
        switch (srcDoc.rulerUnits) {
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
}

var jgUI = {
    widthSldr: 200,
    widthStat: 68,
    createPanel: function (parentObject) {
        var rtnObj = new Object();

        parentObject.add("panel");

        rtnObj.title = parentObject.add("statictext");
        rtnObj.title.alignment = ["left", "center"];

        rtnObj.grp = parentObject.add("group");
        rtnObj.grp.orientation = "row";

        rtnObj.minStat = rtnObj.grp.add("statictext");
        rtnObj.minStat.justify = "center";
        rtnObj.minStat.preferredSize.width = this.widthStat;

        sliderGroup = rtnObj.grp.add("group");
        sliderGroup.orientation = "column";
        sliderGroup.spacing = 0;

        rtnObj.minSldr = sliderGroup.add("Slider");
        rtnObj.minSldr.preferredSize.width = this.widthSldr;
        rtnObj.maxSldr = sliderGroup.add("Slider");
        rtnObj.maxSldr.preferredSize.width = this.widthSldr;

        rtnObj.maxStat = rtnObj.grp.add("statictext");
        rtnObj.maxStat.justify = "center";
        rtnObj.maxStat.preferredSize.width = this.widthStat;

        return rtnObj;
    },
    setupPanel: function (xUI, xProp) {
        xUI.title.text = xUI.titel + xProp.count + " / " + xProp.countOrg; // setup panel titel
        xUI.minStat.text = xProp.minOrg + " | " + xProp.min; // setup static text for MINIMUM values
        xUI.maxStat.text = xProp.max + " | " + xProp.maxOrg; // setup static text for MAXIMUM values
        xUI.minSldr.minvalue = xUI.maxSldr.minvalue = xProp.minOrg; // setup Slider range for MINIMUM
        xUI.minSldr.maxvalue = xUI.maxSldr.maxvalue = xProp.maxOrg; // setup Slider range for MAXIMUM
        xUI.minSldr.value = xProp.min; // setup slider to MINIMAL positions
        xUI.maxSldr.value = xProp.max; // setup slider to MAXIMAL positions
    },
    updatePanel: function (xUI, xProp) {
        uiTitle.text = "Items selected ( " + updtItems.length + "/" + initItems.length + " )"; // main text
        xUI.title.text = xUI.titel + xProp.count + " / " + xProp.countOrg; // panel titel
        xUI.minStat.text = xProp.minOrg + " | " + xProp.min; // update static text for MINIMUM values
        xUI.maxStat.text = xProp.max + " | " + xProp.maxOrg; // update static text for MAXIMUM values
        xUI.minSldr.value = xProp.min; // update MINIMUM slider
        xUI.maxSldr.value = xProp.max; // update MAXIMUM slider
    },
}

var jgExe = {
    getItems: function (type) {
        var srcItmes = app.activeDocument.selection;
        var rtnItems = new Array();
        for (var i = 0; i < srcItmes.length; i++) {
            if (srcItmes[i].typename == type) rtnItems.push(srcItmes[i]);
        }
        return rtnItems
    },
    getProperties: function (items) {
        items = typeof items !== 'undefined' ? items : app.activeDocument.selection;

        var arrPnt = new Array();
        var arrDst = new Array();
        var arrAre = new Array();

        for (var i = 0; i < items.length; i++) {
            arrPnt.push(items[i].pathPoints.length);
            arrDst.push(items[i].length / defaultUnit.value);
            arrAre.push(Math.sqrt(Math.abs(items[i].area)) / defaultUnit.value);
        }

        return {
            pnt: {
                min: arrPnt.min(),
                max: arrPnt.max(),
                count: arrPnt.length,
                minOrg: arrPnt.min(),
                maxOrg: arrPnt.max(),
                countOrg: arrPnt.length
            },
            dst: {
                min: Math.floor(arrDst.min()),
                max: Math.ceil(arrDst.max()),
                count: arrDst.length,
                minOrg: Math.floor(arrDst.min()),
                maxOrg: Math.ceil(arrDst.max()),
                countOrg: arrDst.length
            },
            are: {
                min: Math.floor(arrAre.min()),
                max: Math.ceil(arrAre.max()),
                count: arrAre.length,
                minOrg: Math.floor(arrAre.min()),
                maxOrg: Math.ceil(arrAre.max()),
                countOrg: arrAre.length
            }
        }
    },
    subSelect: function (items, selProp) {
        var rtnItems = new Array();
        selProp.pnt.count = selProp.are.count = selProp.dst.count = 0;

        for (var i = 0; i < items.length; i++) {
            var itemPnt = items[i].pathPoints.length;
            var itemDst = items[i].length / defaultUnit.value;
            var itemAre = Math.sqrt(Math.abs(items[i].area)) / defaultUnit.value;

            var pntTF = false;
            var dstTF = false;
            var areTF = false;

            if (selProp.pnt.min <= itemPnt && itemPnt <= selProp.pnt.max) {
                selProp.pnt.count += 1;
                pntTF = true;
            }
            if (selProp.dst.min <= itemDst && itemDst <= selProp.dst.max) {
                selProp.dst.count += 1;
                dstTF = true;
            }
            if (selProp.are.min <= itemAre && itemAre <= selProp.are.max) {
                selProp.are.count += 1;
                areTF = true
            }

            if (pntTF && dstTF && areTF) rtnItems.push(items[i]);
        };
        return rtnItems;
    },
}

exeMain = function () {
    if (app.documents.length == 0) {
        alert("No active document was found.");
        return;
    }

    defaultUnit = jgAi.getGlobalUnit();

    // get information 
    initItems = updtItems = jgExe.getItems("PathItem"); // gets only the path objects that are free to excess, no objects inside groups or something else.
    selProp = jgExe.getProperties(initItems);

    if (initItems.length <= 1) {
        alert("One or less items were selected.");
        return;
    }

    // setup UI
    uiTitle.text = "Items selected (" + updtItems.length + " / " + initItems.length + ")";

    uiPnt.titel = "Number of points:    ";
    jgUI.setupPanel(uiPnt, selProp.pnt);
    uiDst.titel = "Length (" + defaultUnit.nameShort + "):    ";
    jgUI.setupPanel(uiDst, selProp.dst);
    uiAre.titel = "Area (" + defaultUnit.nameShort + "²):    ";
    jgUI.setupPanel(uiAre, selProp.are);

    mainWindow.show();
};

// -------------------------- UI --------------------------
/// main window
mainWindow = new Window("dialog");
mainWindow.text = scriptConst.name + " v" + scriptConst.version + " by JordanGraphics";
mainWindow.spacing = 2;

uiTitle = mainWindow.add('statictext');
uiPnt = jgUI.createPanel(mainWindow); // Point Number
uiDst = jgUI.createPanel(mainWindow); // Path Length
uiAre = jgUI.createPanel(mainWindow); // Area

// exeGroup
exeGrp = mainWindow.add("group");
exeGrp.alignment = ["right", "center"];
exeGrp.margins = 10;

exeReset = exeGrp.add("button {text: 'Reset'}");
exeOK = exeGrp.add("button {text: 'OK'}")

// -------------------------- UI Eventhandler -------------------------- 

///uiPnt
uiPnt.minSldr.onChanging = function () {
    selProp.pnt.min = Math.round(this.value);
    selProp.pnt.max = selProp.pnt.min > uiPnt.maxSldr.value ? selProp.pnt.min : selProp.pnt.max;

    updtItems = jgExe.subSelect(initItems, selProp);
    jgUI.updatePanel(uiPnt, selProp.pnt);
};
uiPnt.minSldr.onChange = function () {
    app.activeDocument.selection = updtItems;
    app.redraw();
};

uiPnt.maxSldr.onChanging = function () {
    selProp.pnt.max = Math.round(this.value);
    selProp.pnt.min = uiPnt.minSldr.value > selProp.pnt.max ? selProp.pnt.max : selProp.pnt.min;

    updtItems = jgExe.subSelect(initItems, selProp);
    jgUI.updatePanel(uiPnt, selProp.pnt);
};
uiPnt.maxSldr.onChange = function () {
    app.activeDocument.selection = updtItems;
    app.redraw();
}

///uiDst
uiDst.minSldr.onChanging = function () {
    selProp.dst.min = Math.round(this.value);
    selProp.dst.max = selProp.dst.min > uiDst.maxSldr.value ? selProp.dst.min : selProp.dst.max;

    updtItems = jgExe.subSelect(initItems, selProp);
    jgUI.updatePanel(uiDst, selProp.dst);
};
uiDst.minSldr.onChange = function () {
    app.activeDocument.selection = updtItems;
    app.redraw();
};

uiDst.maxSldr.onChanging = function () {
    selProp.dst.max = Math.round(this.value);
    selProp.dst.min = uiDst.minSldr.value > selProp.dst.max ? selProp.dst.max : selProp.dst.min;

    updtItems = jgExe.subSelect(initItems, selProp);
    jgUI.updatePanel(uiDst, selProp.dst);
};
uiDst.maxSldr.onChange = function () {
    app.activeDocument.selection = updtItems;
    app.redraw();
}

///uiAre
uiAre.minSldr.onChanging = function () {
    selProp.are.min = Math.round(this.value);
    selProp.are.max = selProp.are.min > uiAre.maxSldr.value ? selProp.are.min : selProp.are.max;

    updtItems = jgExe.subSelect(initItems, selProp);
    jgUI.updatePanel(uiAre, selProp.are);
};
uiAre.minSldr.onChange = function () {
    app.activeDocument.selection = updtItems;
    app.redraw();
};

uiAre.maxSldr.onChanging = function () {
    selProp.are.max = Math.round(this.value);
    selProp.are.min = uiAre.minSldr.value > selProp.are.max ? selProp.are.max : selProp.are.min;

    updtItems = jgExe.subSelect(initItems, selProp);
    jgUI.updatePanel(uiAre, selProp.are);
};
uiAre.maxSldr.onChange = function () {
    app.activeDocument.selection = updtItems;
    app.redraw();
}

///uiExe
exeReset.onClick = function () {
    app.activeDocument.selection = initItems;
    app.redraw();
    mainWindow.close();
};

exeMain(); // start script