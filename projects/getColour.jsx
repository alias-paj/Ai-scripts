/// Const
scriptConst = {
    name: "getColour",
    version: "0.2.1",
    date: "2023-06-20",
    author: "Philipp Jordan",
    website: "www.JordanGraphics.eu",
};

///javascript extensions and general Ai functions
Array.prototype.any = function (value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === value) return true;
    };
    return false;
};

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
    artboardExpanse: function () {
        var srcArt = app.activeDocument.artboards;
        var rtnExpanse = srcArt[0].artboardRect;
        for (var i = 1; i < srcArt.length; i++) { // get maximal boundaries of Artboards
            var artRect = srcArt[i].artboardRect;
            rtnExpanse[0] = Math.min(rtnExpanse[0], artRect[0]); // left
            rtnExpanse[1] = Math.max(rtnExpanse[1], artRect[1]); // top
            rtnExpanse[2] = Math.min(rtnExpanse[2], artRect[2]); // right
            rtnExpanse[3] = Math.max(rtnExpanse[3], artRect[3]); // bottom
        };
        return rtnExpanse;
    },
};

var jgLayout = {
    tabsHelper: function (pos, align, alignChar, leader) {
        rtnTab = new TabStopInfo;
        rtnTab.position = pos;
        rtnTab.leader = typeof leader == 'undefined' ? "" : leader;
        rtnTab.decimalCharacter = typeof alignChar == 'undefined' ? "." : alignChar;
        switch (align) { //Decimal, Left, Right, Center
            case "Decimal":
                rtnTab.alignment = TabStopAlignment.Decimal;
                break;
            case "Right":
                rtnTab.alignment = TabStopAlignment.Right;
                break;
            case "Center":
                rtnTab.alignment = TabStopAlignment.Center;
                break;
            default:
                rtnTab.alignment = TabStopAlignment.Left;
                break;
        };
        return rtnTab;
    },
    tabsTable: function (values, iteration) { // script specific function
        // example [11, 4.6, 0.1] -> offset, first tab, secound tab
        var rtnTabs = new Array();
        for (var i = 0; i < iteration; i++) {
            var initTabs = values[0] + (i * values[1]);
            rtnTabs.push(this.tabsHelper(initTabs, "Right"));
            rtnTabs.push(this.tabsHelper(initTabs + values[2]));
        };
        return rtnTabs
    },
    paraStyleBlank: function (name) {
        try {
            var rtnStyle = app.activeDocument.paragraphStyles.getByName(name);
        }
        catch (err) {
            var rtnStyle = app.activeDocument.paragraphStyles.add(name);
        }
        return rtnStyle
    },
    HEXtoTxt: function (hexColor) { // script specific function
        var fillTo2 = function (xValue) {
            return xValue.toString().length == 1 ? "0" + xValue : xValue;
        }
        return fillTo2(hexColor[0]) + fillTo2(hexColor[1]) + fillTo2(hexColor[2]);
    },
    TINTtoTxt: function (tintColor) { // script specific function
        var rtnTint = "";
        for (var i = 0; i < tintColor.length; i++) {
            rtnTint += tintColor[i] + ", ";
            if (i == 4) return rtnTint + "...";
        }
        return rtnTint;
    },
    SYStoTxt: function (colorValues, colorSystem) { // script specific function
        var rtnString = "";

        var DECtoTxt = function (decValue) {
            var rtnValue = Math.round(decValue);
            switch (rtnValue.toString().length) {
                case 1:
                    return "  " + rtnValue.toString()
                case 2:
                    return " " + rtnValue.toString()
                default:
                    return rtnValue.toString()
            }
        };

        for (var i = 0; i < colorValues.length; i++) {
            rtnString += DECtoTxt(colorValues[i]) + "\t" + colorSystem[i] + "\t"
        }
        return rtnString
    },
    colorRect: function (parentItem, swatch, colorRect) { // script specific function
        var spotColor = parentItem.pathItems.rectangle(
            0,
            0,
            colorRect[0],
            colorRect[1] - colorRect[2]);
        spotColor.name = "Spot Color";
        spotColor.fillColor = swatch.AdobeColor;
        spotColor.fillColor.tint = 100;
        spotColor.stroked = false;

        var tintColors = new Array();
        for (var i = 0; i < swatch.tint.length; i++) {
            var tintColors = parentItem.pathItems.rectangle(
                0 - (colorRect[1] - colorRect[2]),
                0 + (colorRect[0] / swatch.tint.length * i),
                colorRect[0] / swatch.tint.length,
                colorRect[2]);
            tintColors.name = "Tint: " + swatch.tint[i];
            tintColors.fillColor = swatch.AdobeColor;
            tintColors.fillColor.tint = swatch.tint[i];
            tintColors.stroked = false;
        };
    },
    exportCSV: function (swatchArr) {
        var csvTxt = "SwatchGroup_name\tSwatch_name\t"
            + "HEX\t"
            + "rgb_R\trgb_G\trgb_B\t"
            + "cmyk_C\tcmyk_M\tcmyk_Y\tcmyk_K\t"
            + "hsb_H\thsb_S\thsb_B\t"
            + "lab_L\tlab_A\tlab_B\t"
            + "\n"
        for (var i = 0; i < swatchArr.length; i++) {
            var color = swatchArr[i].convertColor;
            csvTxt += swatchArr[i].group + "\t" + swatchArr[i].name + "\t"
                + color.HEX[0] + color.HEX[1] + color.HEX[2] + "\t"
                + color.RGB[0] + "\t" + color.RGB[1] + "\t" + color.RGB[2] + "\t"
                + color.CMYK[0] + "\t" + color.CMYK[1] + "\t" + color.CMYK[2] + "\t" + color.CMYK[3] + "\t"
                + color.HSB[0] + "\t" + color.HSB[1] + "\t" + color.HSB[2] + "\t"
                + color.LAB[0] + "\t" + color.LAB[1] + "\t" + color.LAB[2] + "\t"
                + "\n";
        };
        return csvTxt
    },
};

var jgColor = {
    getColor: function (selItems) {
        var rtnColor = new Array();
        for (var i = 0; i < selItems.length; i++) {
            var iItem = selItems[i];
            if (iItem.fillColor.typename === 'SpotColor') this.getSpotColor(iItem.fillColor, rtnColor);
            if (iItem.strokeColor.typename === 'SpotColor') this.getSpotColor(iItem.strokeColor, rtnColor);
        }
        for (var i = 0; i < rtnColor.length; i++) {
            this.getSwatchGroup(rtnColor[i]);
            this.convertColor(rtnColor[i]);
        }
        return rtnColor;
    },
    getSpotColor: function (itemColor, rtnColor) {
        for (var i = 0; i < rtnColor.length; i++) {
            if (rtnColor[i].name == itemColor.spot.name) {
                var tintRound = Math.round(itemColor.tint)
                if (!rtnColor[i].tint.any(tintRound)) rtnColor[i].tint.push(tintRound);
                return rtnColor
            }
        };
        return rtnColor.push({
            name: itemColor.spot.name, // name of the swatch
            AdobeColor: itemColor, //.spot.color,
            tint: [Math.round(itemColor.tint)], // only applicable for spot colours, can take more than one value
        });
    },
    getSwatchGroup: function (colorProp) {
        var swatchGroups = app.activeDocument.swatchGroups;
        for (var i = 0; i < swatchGroups.length; i++) {
            var swatchList = swatchGroups[i].getAllSwatches(); // getAllSwatchs()  is an Adobe Illustrator internal function
            for (var j = 0; j < swatchList.length; j++) {
                if (colorProp.name == swatchList[j].name) {
                    colorProp.group = swatchGroups[i].name;
                    colorProp.groupNo = i;
                    break;
                }
            }
        }
    },
    convertColor: function (colorProp) {
        var AdobeColorConvert = function (srcColor, convertTo) {
            //convertTo can be: "RGB", "CMYK", "LAB", "Grayscale", "Indexed", "Separation", "DeviceN"
            var docColSpace = (app.activeDocument.documentColorSpace == 'DocumentColorSpace.RGB') ? ImageColorSpace.RGB : ImageColorSpace.CMYK;
            var rtnColSpace;
            switch (convertTo) {
                case "RGB":
                    rtnColSpace = ImageColorSpace.RGB;
                    break;
                case "CMYK":
                    rtnColSpace = ImageColorSpace.CMYK;
                    break;
                case "LAB":
                    rtnColSpace = ImageColorSpace.LAB;
                    break;
                case "Grayscale":
                    rtnColSpace = ImageColorSpace.Grayscale;
                    break;
                case "Indexed":
                    rtnColSpace = ImageColorSpace.Indexed;
                    break;
                case "Separation":
                    rtnColSpace = ImageColorSpace.Separation;
                    break;
                case "DeviceN":
                    rtnColSpace = ImageColorSpace.DeviceN;
                    break;
                default:
                    rtnColSpace = ImageColorSpace.DeviceN;
                    break;
            };
            return app.convertSampleColor(docColSpace, srcColor, rtnColSpace, ColorConvertPurpose.defaultpurpose)
        };
        var RGBtoHEX = function (rgbColor) { //done
            return [
                Math.round(rgbColor[0]).toString(16),
                Math.round(rgbColor[1]).toString(16),
                Math.round(rgbColor[2]).toString(16)
            ]
        };
        var RGBtoHSB = function (rgbColor) { //done
            var normR = rgbColor[0] / 255; // convert 0-255 to 0-1
            var normG = rgbColor[1] / 255; // convert 0-255 to 0-1
            var normB = rgbColor[2] / 255; // convert 0-255 to 0-1

            var normMin = Math.min(normR, normG, normB); //get max. of all RGB' values
            var normMax = Math.max(normR, normG, normB); //get min. of all RGB' values
            var normDiff = normMax - normMin; //calcualte the color Dimension

            var rtnBrightness = normMax; // the brightness is equal to the lightest RGB-value
            var rtnHue = 0; // set standard Hue to 0, equal to gray colours
            var rtnSaturation = 0; // set Saturation to 0, equal to gray colours

            if (normDiff == 0) { // normDiff == 0 means the colour is gray and does not have any chromatics
                return [
                    rtnHue, // no chromatics means no Hue
                    rtnSaturation, // no chromatics means no Saturation
                    rtnBrightness
                ]
            } else {
                rtnSaturation = normDiff / normMax;

                var Rdiff = (((normMax - normR) / 6) + (normDiff / 2)) / normDiff
                var Gdiff = (((normMax - normG) / 6) + (normDiff / 2)) / normDiff
                var Bdiff = (((normMax - normB) / 6) + (normDiff / 2)) / normDiff

                if (normR == normMax) rtnHue = Bdiff - Gdiff
                if (normG == normMax) rtnHue = (1 / 3) + Rdiff - Bdiff
                if (normB == normMax) rtnHue = (2 / 3) + Gdiff - Rdiff

                if (rtnHue < 0) rtnHue += 1
                if (rtnHue > 1) rtnHue -= 1

                return [
                    rtnHue * 360, // in degrees
                    rtnSaturation * 100, // in percentage
                    rtnBrightness * 100 // in percentage
                ]
            };
        };

        switch (app.activeDocument.documentColorSpace) {
            case DocumentColorSpace.RGB:
                var rtnConvert = new Object();

                rtnConvert.RGB = [
                    colorProp.AdobeColor.spot.color.red,
                    colorProp.AdobeColor.spot.color.green,
                    colorProp.AdobeColor.spot.color.blue
                ];

                rtnConvert.LAB = AdobeColorConvert(rtnConvert.RGB, "LAB");
                rtnConvert.CMYK = AdobeColorConvert(rtnConvert.RGB, "CMYK");

                rtnConvert.HEX = RGBtoHEX(rtnConvert.RGB);
                rtnConvert.HSB = RGBtoHSB(rtnConvert.RGB);

                colorProp.convertColor = rtnConvert;
                break;
            case DocumentColorSpace.CMYK:
                var rtnConvert = new Object();

                rtnConvert.CMYK = [
                    colorProp.AdobeColor.spot.color.cyan,
                    colorProp.AdobeColor.spot.color.magenta,
                    colorProp.AdobeColor.spot.color.yellow,
                    colorProp.AdobeColor.spot.color.black
                ];

                rtnConvert.LAB = AdobeColorConvert(rtnConvert.CMYK, "LAB");
                rtnConvert.RGB = AdobeColorConvert(rtnConvert.CMYK, "RGB");

                rtnConvert.HEX = RGBtoHEX(rtnConvert.RGB);
                rtnConvert.HSB = RGBtoHSB(rtnConvert.RGB);

                colorProp.convertColor = rtnConvert;
                break;
            default:
                break;
        }
    },
};

var exeMain = function () {
    if (app.documents.length == 0) { // check if any document is open
        alert("No active document was found.");
        return;
    };

    // set global values
    mm = jgAi.unit.mm.value; // global unit to convert mm to Adobes own measure system

    srcDoc = app.activeDocument; // get active document
    srcSwatchs = jgColor.getColor(app.activeDocument.pathItems); // extract spot-colours (global colours) of all pathItems
    srcSwatchs = srcSwatchs.sort(function (a, b) { return a.groupNo - b.groupNo }); // sort the colours by their group name (defined by group number)

    var artExpanse = jgAi.artboardExpanse(); // get the maximal dimensions of all artboards

    if (srcSwatchs.length == 0) { // checks if any spot-colour (global colour) was found
        alert("No spot color found.");
        return;
    };


    // create main layer
    try { // try to excess "ColourExport" layer
        var colorLayer = srcDoc.layers.getByName("ColourExport");
    }
    catch (err) { // if it does not exsist it will be created
        var colorLayer = srcDoc.layers.add();
        colorLayer.name = "ColourExport";
    }

    // write all data as tab delimited for csv export
    var csvExport = colorLayer.textFrames.add();
    csvExport.name = "csv-export"
    csvExport.contents = jgLayout.exportCSV(srcSwatchs);
    csvExport.hidden = true;
    csvExport.left = artExpanse[0];
    csvExport.top = artExpanse[1];

    // set design values
    var fontSize = {
        swatchGrp: 20,  // swatchGroup title
        swatch: 8,     // swatch title
        value: 5,       // values
    };
    var grid = {
        width: 52 * mm,    // width total swatch
        height: 32 * mm,    // hight total swatch
        indent: 6 * mm,     // indent swatch Group
        margin: 2 * mm,     // swatch margin
    };
    var colRect = [14 * mm, 14 * mm, 4*mm];
    var tabSYS = [11 * mm, 4.6 * mm, 0.1 * mm];
    var tabHEX = 9 * mm;

    // define ParagraphStyles
    var paraSwatchGrp = jgLayout.paraStyleBlank("jgColour_Group"); // style used for swatchGroup titles
    paraSwatchGrp.characterAttributes.textFont = app.textFonts['CenturyGothic'];
    paraSwatchGrp.characterAttributes.size = fontSize.swatchGrp;

    var paraSwatch = jgLayout.paraStyleBlank("jgColour_Swatch"); // style used for swatch names
    paraSwatch.characterAttributes.textFont = app.textFonts['CenturyGothic-bold'];
    paraSwatch.characterAttributes.size = fontSize.swatch;

    var paraValue = jgLayout.paraStyleBlank("jgColour_Value"); // style used for values
    paraValue.characterAttributes.textFont = app.textFonts['CenturyGothic'];
    paraValue.characterAttributes.size = fontSize.value;
    paraValue.characterAttributes.autoLeading = false;
    paraValue.characterAttributes.leading = 5.4;

    // layout all swatches
    var currSwatchGrp = 'undefined'; // variable to catch change in swatchGroup
    var posSwatch = [artExpanse[0], artExpanse[1]]; // running position of the swatches
    for (var i = 0; i < srcSwatchs.length; i++) {
        if (srcSwatchs[i].group != currSwatchGrp) { // check if swatchGroup changes
            posSwatch[0] = artExpanse[0];
            posSwatch[1] -= grid.height;
            currSwatchGrp = srcSwatchs[i].group; // update the currSwatchGrp to the new value

            // create a groupItem for each swatchGroup inside 'colourLayer'
            var aiSwatchGrp = colorLayer.groupItems.add();
            aiSwatchGrp.name = srcSwatchs[i].group == "" ? "()noGroup" : "()" + srcSwatchs[i].group; // swatches without parent will be placed in a group named "()noGroup"

            // create title
            // note: the order of applying a paragraphStyle and setting the position does change the layout
            var txtSwatchGrp = aiSwatchGrp.textFrames.add();
            txtSwatchGrp.contents = srcSwatchs[i].group == "" ? "no group associated" : srcSwatchs[i].group // swatches without parent will be titled "no group associated"
            paraSwatchGrp.applyTo(txtSwatchGrp.textRange);
            txtSwatchGrp.left = posSwatch[0];
            txtSwatchGrp.top = posSwatch[1];

            // change running positions
            posSwatch[0] += grid.indent;
        }

        // create groupItem for each swatch
        var aiSwatch = aiSwatchGrp.groupItems.add();
        aiSwatch.name = "()" + srcSwatchs[i].name;

        // create title
        var txtSwatch = aiSwatch.textFrames.add();
        txtSwatch.contents = srcSwatchs[i].name;
        paraSwatch.applyTo(txtSwatch.textRange);
        txtSwatch.top = -fontSize.swatch;

        // create colour rectangle including all tints
        var aiColorRect = aiSwatch.groupItems.add();
        aiColorRect.name = "()Colours";
        jgLayout.colorRect(aiColorRect, srcSwatchs[i], colRect);

        // create groupItem for the values
        var aiGrpVal = aiSwatch.groupItems.add();
        aiGrpVal.name = "()Values";

        // create textFrame with colourSystems: RGB, CMYK, HSB, and Cie-Lab
        var txtSYS = aiGrpVal.textFrames.add();
        txtSYS.name = "RGB, CMYK, HSB, Cie-Lab";
        txtSYS.contents = (
            "RGB" + "\t" + jgLayout.SYStoTxt(srcSwatchs[i].convertColor.RGB, "RGB") + "\n" +
            "CMYK" + "\t" + jgLayout.SYStoTxt(srcSwatchs[i].convertColor.CMYK, "CMYK") + "\n" +
            "HSB" + "\t" + jgLayout.SYStoTxt(srcSwatchs[i].convertColor.HSB, "HSB") + "\n" +
            "CIE-Lab" + "\t" + jgLayout.SYStoTxt(srcSwatchs[i].convertColor.LAB, "Lab")
        );

        txtSYS.textRange.paragraphAttributes.tabStops = jgLayout.tabsTable(tabSYS, 4);
        var line = [8, 32, 61, 88]
        var superScript = [ // +6 characters to get the next descriptive value
            line[0], line[0] + (1 * 6), line[0] + (2 * 6), //RGB
            line[1], line[1] + (1 * 6), line[1] + (2 * 6), line[1] + (3 * 6), // CMYK
            line[2], line[2] + (1 * 6), line[2] + (2 * 6), // HSB
            line[3], line[3] + (1 * 6), line[3] + (2 * 6)  // LAB
        ];
        for (var s = 0; s < superScript.length; s++) txtSYS.characters[superScript[s]].characterAttributes.baselinePosition = FontBaselineOption.SUPERSCRIPT;

        paraValue.applyTo(txtSYS.textRange);
        txtSYS.top = -fontSize.value;

        var txtHEX = aiGrpVal.textFrames.add();
        txtHEX.name = "HEX values (web)";
        txtHEX.contents = "HEX" + "\t" + jgLayout.HEXtoTxt(srcSwatchs[i].convertColor.HEX);
        paraValue.applyTo(txtHEX.textRange);
        txtHEX.textRange.paragraphAttributes.tabStops = [jgLayout.tabsHelper(tabHEX)];
        txtHEX.top = -10.8 * mm;

        var txtTint = aiGrpVal.textFrames.add();
        txtTint.name = "Tint values";
        txtTint.contents = "Tint: " + "\t" + jgLayout.TINTtoTxt(srcSwatchs[i].tint);
        paraValue.applyTo(txtTint.textRange);
        txtTint.textRange.paragraphAttributes.tabStops = [jgLayout.tabsHelper(tabHEX)];
        txtTint.top = -13.2 * mm;

        // move ColourValueGroup to the specific point within the SwatchGroup
        aiColorRect.left = grid.margin; // move the groupItem 1mm to the right
        aiGrpVal.left = grid.margin + colRect[0] + grid.margin; //16 * mm;
        aiColorRect.top = aiGrpVal.top = - (fontSize.swatch * 2) - grid.margin; // move the groupItem

        // move the SwatchGroup within the parent SwatchGroup
        aiSwatch.left = posSwatch[0]
        aiSwatch.top = posSwatch[1] - fontSize.swatchGrp - grid.indent / 4; 

        // set the new left value for the next SwatchGroup
        posSwatch[0] += grid.width;
    }

    //$.writeln("Stop")
}

///main program
exeMain()