# ScaleByValue
>Application: Adobe Illustrator<br>
Version: 22.0 and above

By default **Adobe Illustrator** does only allow to batch scale **items** (Object > Transfrom > **Transform Each...** ) by a given scaling factor (e.g. 80% ), but not to a fixed value (e.g. 10 mm ). This script overcomes this lack in functionality by allowing you to scale almost every given object to a fixed value.

#### This script allows you to: 
- define a **width** value each item should be scaled to
- define a **height** value each item should be scaled to
- **constrain proportions** of each item
- define the **refencePoint** each item will be scaled to (TopLeft, CenterCenter, BottomLeft, ...)

#### Futher more the script can 
- convert your input units to **document unit** (in to mm)
- calculate **simple math operations** (5+5, or 10/2)
- **increase/decrease** the dimensions of each item individually (+ 5 mm, or / 2)

## What it is good for
I created the script to work with imported graphs from graphpad prism, R - ggplot2, or other statistics programs more easily. This script allows to consolidate the dimensions of datapoints (mostly circles) over different graphs by **setting the width and height for all item's at once**. <br>
However, you can use the script to scale almost any types of **items** in one go.

## Step by step
The script reads the user's selection and :
1. Remove **textframe** and **guides** from selection
2. Evaluate user's input
  <br>&nbsp; a. Convert user's input units to document unit.
  <br>&nbsp; b. Remove all text symbols that are not **numbers** or **math symbols**.
  <br>&nbsp; c. Extract the prefix math operator if present.
  <br>&nbsp; d. Calcuate the result of any given math operation.
  <br>&nbsp; e. Check if **constrain proportions** is set and delete either the **height** or the **width** value.
3. Calcuate the **width**, **height**, and **position** of each **item** individually
  <br>&nbsp; a. Check if the **item** is a clipping mask.
  <br>&nbsp; b. Get the position of the **Reference Point** (TOPLEFT, CENTER, BOTTOMRIGHT).
  <br>&nbsp; c. Calculate for each item individually the **width**, **height**, and **position** taking into account the **Reference Point**, the  **math operator**, and the **constrain proportions**.
4. Check if the calculated **dimensions** of all items are above the minimal distance of 0.0001 points.
5. Resize each **item** 
  <br>&nbsp; a. if check was negative, or
  <br>&nbsp; b. reset item's dimensions

## Possiblities
- You can feed any unit known to Adobe Illustrator into this script and it will be converted to the set document unit.
- You can do simple calcuations like (50 + 50, or 23/3) like you can do in all other text input fields Adobe Illustrator
- You can add and subtract values from each **item** individually by typing **+5 mm** or **-20 cm**. This will result in an increase the size of each **item** individually by **5 mm** or a rduction by **20 cm**. An input of **/2** or **\*4** will be equal to the default Adobe Illustrator **Transform Each...** function input **50%** or **400%**.
- You set the **width** or **height** value and let the script calculate the corresponding value - if the **constrain proportions** is set.

## Limitations
The script does only an insufficient error check. It does check only if all dimensions are above the minimal distance, but not if the items drop off the canvas.

> [!NOTE]
> If you know a way to do a proper check if an item falls off the canvas, please let me know.