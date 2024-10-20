## Array.any
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

## Create a ParagraphStyle

The layout of the script depends on the used **font**, **font-size**, **justification**, and more. If not defined those values will be copied from the default **character style** and/or **paragraph style**, which can be changed by the user prior the script execution. To keep the layout constant all values need to be defined.<br>
The **"Reference Guide: Javascript"** for **Adobe Illustrator** does not state the default values. Therefore, I extract the all properties and their corresponding values from a blank Illustrator file. The values are saved in different locations:

1. in the **textFrame** object directly,
2. in the **textFrame**'s **paragraphStyle**,
3. in the **textFrame**'s **paragraphAttributes**,
4. in the **textFrame**'s **characterStyle**, and 
5. in the **textFrame**'s **characterAttributes** 

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
