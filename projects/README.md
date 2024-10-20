
This files will be written / updated step by step

# DrawColourPalette
Application: Adobe Illustrator<br>
Version: 22.0 and above

This script creates a **Colour Palette** or  **Look Up Table (LUT)** based **global colour**s used in the user's selection. In addition it saves all processed colour information in a **tab-delimited table** for easy copy and paste. <br> I do recomended to copy the text into a *.txt-file and modify the table to your needs before importing it into excle or any other program.

## What it is good for


## Step by step
1. Get the user's selection.
2. Check if **fill** and/or **stroke** colour of each selected is a **gobal colour** and
    - save new colours to an array
    - save new **tint** value
3. Get the name of the corresponding **swatch group**
4. Convert the colour values to:
   - RGB
   - CMYK
   - HEX
   - HSB
   - CIE-lab
5. Create a new **layer** placed top in the active document named **ColourExport**. This layer will be used to store all items created by this script.
6. Write all colour values into a **textframe** named **csv_export**.
   - The data is formated in a **tab-delimited** fashion
   - The values are stored with a **dot (.)** as a decimal seperator - due to scripting reasons.
   - The **textframe** is set to **hidden**
7. Create a **groupItem** for each **swatchgroup**
8. Create a summary for each colour containing
   - a colour filled rectangle
   - all **tint** values lined up in rectangles
   - the values of the different colourspace written out

## Limitations
The script does only process **gobal colours** other colours are ignored. <br> 
The final layout does work well with the font **Century Gothic**, other fonts hasn't been tested.

## Possiblities
The text appreance is defined by **Pragraph** and **Character Styles** making it easy for you to modify the final layout after you ran the script.
he script was run. <br>
The individual **item**s are group to rearange and modify to the layout to your individual needs.


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


The colour information are stored in a  and a groupItem for each swatchGroup.

The Each **swatch group** does have its **groupItem** named as the **swatchGroup** containing a **textFrame** with the groups name.

or uses to store all 
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

# ScaleByValue
**Adobe Illustrator** does only allow to scale several **items** individual at once by a given scaling factor (e.g. 80%), but not to a fixed value (e.g. 10 mm). This script overcomes this lack in functionality by allowing you to scale almost every given object to a defined value.

This script allows you to define
- the **refencePoint** each item will be scaled to (TopLeft, CenterCenter, BottomLeft, ...)
- a width value each item should be scaled to
- a height value each item should be scaled to
- a contrained proportional scale

Futher more the script can 
- convert units to the **document unit** (in to mm)
- calculate simple math operations (5+5, or 10/2)
- do math operation on each **item** individually (+ 5 mm, or / 2)

## What it is good for
This script comes in handy if you need to scale a datapoints (circles) in scatterplot to a defined size (2 mm x 2 mm) without calculating the scaling factor manually. <br>
Another use case would be to scale similar objects to the same width and/or height throughout a the whole document.

## Step by step

The script 

# Subselect
# SwapGroupLayer
# BatchReplace
# RenameByType
   