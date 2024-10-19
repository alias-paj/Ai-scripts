# Script Information

## DrawColourPalette

Descriptor | Value
------------ | -------------
Application | Adobe Illustrator
Version | 22.0 and above

This script collects all **global swatches** of the active document and creates a colour **LookUp Table (LUT)** and a **tab-delimited table**. This script is designed to give a visual summary of all colours used and make exporting them easy.

The visual summary contains all **global swatches** group by their **SwatchGroup**. Each **swatch** is represented by its **name**, a corresponding coloured square including all tints, and the values of selected colour systems:

* RGB
* CMYK
* HSL/HSB
* Cie-Lab
* HEX
* Tints (not a colour system)

The **tab-delimited table** is stored in a regular **textFrame** item inside the main export layer **ColourExport**. The item is **hidden** by default, since it is intended to used for copy and past and not for design purpose. The table contains the **swatch name**, the parent **swatch group**, and the listed **colour systems** above (RGB, CMYK, HSL/HSB, Cie-Lab, HEX, and tints). The values are stored with a **dot (.)** as a decimal seperator - due to scripting reasons.

I do recomended to copy the text into a *.txt-file and modify the table to your needs before importing it into excle or any other program.

### File structure
The script creates several **layerItems, groupItems, textItems, and pathItems**. Those items are structured as following.

> Names of all **groupItems** follow the same scheme: **()**+name

All items are stored in a newly created layer placed top in the active document, named **ColourExport**. Inside this layer you can find the **textItem** containing the **tab-delimited table** named **csv_export** and groupItem for each swatchGroup.

Each **swatch group** does have its **groupItem** named as the **swatchGroup** containing a **textFrame** with the groups name.

Inside, the single swatches are stored in seperate **groupItems** named as the **swatch** containing a 

* **textFrame** with the swatchs name, a 
* **groupItem** for the visual representation, and a
* **groupItem** for the values.

Example:

* ColourExport (layerItem)
  * csv_export (textFrameItem)
  * SwatchGroup (groupItem)
    * Name (textFrameItem)
    * Swatch (groupItem)
      * Name (textFrameItem)
      * ()Colours (groupItem)
      * ()Values (groupItem)
    * Swatch ...
  * SwatchGroup...


### Code namespaces
- **jgAI** contains general functions constants unique to **Adobe Illustrator** 

  - **minDistance** is the minimal distance Adobe Illustrator can handle, given in points - the standard scripting unit.

  - **unit** contains all possible units, their short and long name, as well as the conversion factor into points.

  - **artboardExpanse** calculates the maximal dimension of all available artboards - this comes in handy if you need to place new artboards.

- **jgColour** contains all functions to read, save, convert or process colours.

- **jgLayout**
This namespace contains mostly script specific functions dealing with the layout in this script. However, it does also contain functions to set ParagraphStyles or to set TabStops easily.

### Obstacles
#### 1. Array.any
Due to the fact the Adobe Illustrator still uses **ES1**, some handy functions are missing, like an **any**-function. The function below checks if **any** value in the **array** is equal to the given **value**. It returns either **true** or **false**.
It does not 

* return the actual value,
* return the position of the value,
* checks if the value is present multiple times

```javascript
Array.prototype.any = function (value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === value) return true;
    };
    return false;
};
```

#### 2. Create a ParagraphStyle

The layout of the script depends on the used **font**, **font-size**, **justification**, and more. If not defined those values will be copied from the default **character style** and/or **paragraph style**, which can be changed by the user prior the script execution. To keep the layout constant all values need to be defined.<br>
The **"Reference Guide: Javascript"** for **Adobe Illustrator** does not state the default values. Therefore, I extract the all properties and their corresponding values from a blank Illustrator file. The values are saved in different locations:

1. in the **textFrame** object directly,
2. in the **textFrame**'s **paragraphStyle**,
3. in the **textFrame**'s **paragraphAttributes**,
4. in the **textFrame**'s **characterStyle**, and 
5. in the **textFrame**'s **characterAttributes** 

### Readout the Propoerties
I used the following script to readout all properties.<br>
1. Reference all objects given above.
    ```javascript
    var srcTxt = app.activeDocument.textFrames; // general list of Text objects

    var txtObj          = srcTxt[0].textRange; // textFrame
    var txtCharStyle    = txtObj.characterStyles[0]; //characterStyle
    var txtParaStyle    = txtObj.paragraphStyles[0]; //paragraphStyle
    var txtCharAttr     = txtObj.characterAttributes; //characterAttributes
    var txtParaAttr     = txtObj.paragraphAttributes; //paragraphAttributes
    ```
2. Loop through all properties
   ```javascript
    var obj = txtParaStyle; // reference the desired object
    var PropertyValue = new String(); // create blank string to be filled

    for (var key in obj) {
        // loop through all properties
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            try {
                // write all properties and corresponding values
                PropertyValue += key + "\t" + obj[key] + "\n" 
            } catch (error) {
                continue;
                // in case an error occurs jump to the next property
            }      
        }
    }
   ```

# ScaleByValue
# Subselect
# SwapGroupLayer
# BatchPlace
# RenameByType
   