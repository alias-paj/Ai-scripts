# BatchReplace
>Application: Adobe Illustrator<br>
Version: 22.0 and above

Replacing the shapes of multiple itmes at once is not possible. Using **Symbols** allows you to change the shape and apperance of many instances at once, but this does not work for imported vector images, like graphs. This script allows you to replace multiple items by one defined key item.

#### This script allows you to: 
- replace different items by one key item
- keep the width and heigth of the key item, or
- scale the key item (width or height or both) to the original item

## What it is good for
Importing graphs from statistic softwares (Graphpad Prism, R (using ggplot2), or others) into Adobe Illustrator does often result in broken shapes, open path, overlaying items, or items not visible. This script allows you to replace those broken shapes by an item of your choice. You can replace a circle by a circle or change the symbol to a star and other complex forms.

## Step by step
The script reads the user's selection and :
1. Remove **textframe**, **guides**, and **clipping masks** from selection.
2. Defines the **first** item in the selection as the **key item**
3. Duplicates the **key item** ontop of each selected item with
    <br>&nbsp; a. same position as the **original item**
    <br>&nbsp; b. the **width** and **height** of the **key item**
    <br>&nbsp; c. a reduced opacity (to be able to see both **original** and **key item**)
4. Evaluate user's input
    <br>&nbsp; a. the refence point the **key item** should be aligned to
    <br>&nbsp; b. if **width**, **height**, or **both** should be adopted from the **original item**
5. If the **OK** button is pressed, the opacity will revert to its original value.

## Possiblities
You can replace the datapoints within a graph by any shape (or item) of your choice, making it much easier to work with on the long run.

## Limitations
So far no limitations are known. <br>
The script does not do an error check on any of its actions.
