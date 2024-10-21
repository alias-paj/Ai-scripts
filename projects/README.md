
This files will be written / updated step by step

# DrawColourPalette
Application: Adobe Illustrator<br>
Version: 22.0 and above

This script creates a **Colour Palette** or  **Look Up Table (LUT)** based **global colour**s used in the user's selection. In addition it saves all processed colour information in a **tab-delimited table** for easy copy and paste. <br> I do recomended to copy the text into a *.txt-file and modify the table to your needs before importing it into excle or any other program.

## What this script is good for

## How this script works - step by step
1. Get the user's selection.
2. Check if **fill** and/or **stroke** colour of each selected is a **gobal colour** and
  <br>&nbsp; **a.** save new colours to an array
  <br>&nbsp; **b.** save new **tint** value
3. Get the name of the corresponding **swatch group**
4. Convert the colour values to:
  <br>&nbsp; **a.** RGB
  <br>&nbsp; **b.** CMYK
  <br>&nbsp; **c.** HEX
  <br>&nbsp; **d.** HSB
  <br>&nbsp; **e.** CIE-lab
5. Create a new **layer** placed top in the active document named **ColourExport**. This layer will be used to store all items created by this script.
6. Write all colour values into a **textframe** named **csv_export**.
  <br>&nbsp; **a.** The data is formated in a **tab-delimited** fashion
  <br>&nbsp; **b.** The values are stored with a **dot (.)** as a decimal seperator - due to scripting reasons.
  <br>&nbsp; **c.** The **textframe** is set to **hidden**
7. Create a **groupItem** for each **swatchgroup**
8. Create a summary for each colour containing
  <br>&nbsp; **a.** a colour filled rectangle
  <br>&nbsp; **b.** all **tint** values lined up in rectangles
  <br>&nbsp; **c.** the values of the different colourspace written out

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

# ScaleByValue
**Adobe Illustrator** by default does only allow to batch scale **items** (Object > Transfrom > **Transform Each...** ) by a given scaling factor (e.g. 80% ), but not to a fixed value (e.g. 10 mm ). This script overcomes this lack in functionality by allowing you to scale almost every given object to a fixed value.

This script allows you to: 
- define a **width** value each **item** should be scaled to
- define a **height** value each **item** should be scaled to
- constrain the **item**'s proportions
- define the **refencePoint** each **item** will be scaled to (TopLeft, CenterCenter, BottomLeft, ...)

Futher more the script can 
- convert your input units to **document unit** (in to mm)
- calculate simple math operations (5+5, or 10/2)
- do math operation on each **item** individually (+ 5 mm, or / 2)

## What it is good for
I created the script to work with imported graphs from graphpad prism, R - ggplot2, or other statistics programs more easily. This script allows to consolidate the dimensions of datapoints (mostly circles) over different graphs by setting the **width** and **height** for all **item**'s at once. <br>
However, you can use the script to scale almost any types of **items** in one go.

## Step by step
The script reads the user's selection and :
1. Remove **textframe** and **guides** from selection
2. Wait for user input
3. Evaluate **height** or **width** value
  <br>&nbsp; a. convert input units to document unit
  <br>&nbsp; b. remove all text symbols that are not **numbers** or **math symbols**
  <br>&nbsp; c. extract the prefix math operator if present
  <br>&nbsp; d. calcuate the math
  <br>&nbsp; e. check if the resulting value is below **Adobe Illustrator**'s minimal dimension.
4. Check if **constrain proportions** is set.
  <br>Change **height** or **width** value to ""
5. Scale each **item** individually
  <br>&nbsp; a. Check if the **item** is a clipping mask
  <br>&nbsp; b. Get the position of the **Reference Point**
  <br>&nbsp; c. Calculate relative **scale factor** depending on extracted **math operator** and set **constrain proportions**
  <br>&nbsp; d. Cacluate new position
  <br>&nbsp; e. Resize the **item** and set the new position
6. Check if all **scaling factor**s are positive.
<br> If not, undo the 5. step

## Possiblities
- You can feed any unit known to Adobe Illustrator into this script and it will be converted to the set document unit.
- You can do simple calcuations like (50 + 50, or 23/3) like you can do in all other text input fields Adobe Illustrator
- You can add and subtract values from each **item** individually by typing **+ 5 mm** or **- 20 cm**. This will result in an increase the size of each **item** individually by **5 mm** or a rduction by **20 cm**. An input of **/ 2** or **\* 4** will be equal to the default Adobe Illustrator **Transform Each...** function input **50%** or **400%**.
- You set the **width** or **height** value and let the script calculate the corresponding value - if the **constrain proportions** is set.

## Limitations
The script does only an insufficient error check. A negative **scale factor** results in a screen flash due to a **app.redraw() app.undo()** call. A inpossible position is not checked at all.

# Subselect
## What it is good for
## Step by step
## Limitations
## Possiblities

# SwapGroupLayer
## What it is good for
## Step by step
## Limitations
## Possiblities

# BatchReplace
## What it is good for
## Step by step
## Limitations
## Possiblities

# RenameByType
## What it is good for
## Step by step
## Limitations
## Possiblities
   
