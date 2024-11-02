# DrawColourPalette
> Application: Adobe Illustrator<br>
Version: 22.0 and above

This script creates a **Colour Palette** or  **Look Up Table (LUT)** based **global colour**s used in the user's selection. In addition it saves all processed colour information in a **tab-delimited table** for easy copy and paste. <br> I do recomended to copy the text into a *.txt-file and modify the table to your needs before importing it into excle or any other program.

## What this script is good for

## How this script works - step by step
1. Get the user's selection.
2. Check if **fill** and/or **stroke** colour of each selected is a **gobal colour** and
  <br>&nbsp; a. save new colours to an array
  <br>&nbsp; b. save new **tint** value
3. Get the name of the corresponding **swatch group**
4. Convert the colour values to:
  <br>&nbsp; a. RGB
  <br>&nbsp; b. CMYK
  <br>&nbsp; c. HEX
  <br>&nbsp; d. HSB
  <br>&nbsp; e. CIE-lab
5. Create a new **layer** placed top in the active document named **ColourExport**. This layer will be used to store all items created by this script.
6. Write all colour values into a **textframe** named **csv_export**.
  <br>&nbsp; a. The data is formated in a **tab-delimited** fashion
  <br>&nbsp; b. The values are stored with a **dot (.)** as a decimal seperator - due to scripting reasons.
  <br>&nbsp; c. The **textframe** is set to **hidden**
7. Create a **groupItem** for each **swatchgroup**
8. Create a summary for each colour containing
  <br>&nbsp; a. a colour filled rectangle
  <br>&nbsp; b. all **tint** values lined up in rectangles
  <br>&nbsp; c. the values of the different colourspace written out

## Limitations
The script does only process **global colours** other colours are ignored. <br> 
The final layout does work well with the font **Century Gothic**, other fonts haven't been tested.

## Possiblities
The text appreance is defined by **Pragraph** and **Character Styles** making it easy for you to modify the final layout after the script.<br>
Each swatch and swatch group are in seperate group items to simplify the modification of the layout to your needs.

## Layer structure
The script creates a main **layerItem** called **ColourExport** at top of the **active document** to store all **item**s it creates. Inside this layer you can find the **textframe** containing the **tab-delimited table** named **csv_export** and the **groupItem**s for each **swatchGroup**.

A single **swatch** contains of 
- **textFrame** with the swatchs name, a 
- **groupItem** for the visual representation, and a
- **groupItem** for the values.

### Example:
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