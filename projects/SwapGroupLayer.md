# SwapGroupLayer
>Application: Adobe Illustrator<br>
Version: 22.0 and above

Organising your file strucute in Adobe Illustrator can be tidious. **Layers** are good to keep things structured while still be able to easy select and modify items within. **Groups** are good to keep things together and not accedently change things, while still be able to move and transform the whole group. While both have their pros and cons it is hard to switch between them, especially if you have **nested layer** or **group structures**. <br>
This script allows to switch between nested layer structures and group structures in one click.

## What it is good for
I created this script to work within group structures more easily. **CLICK** and all selected groups will be transformed to layers. **CLICK** and all layers will be transformed to groups. Switching that easy allows for new workflows.

## Step by step
1. The script loads the user's selection.
2. Test if items were selected, otherwise cancel the script
3. Test if selection is a **group** by the following conditions: 
    <br>&nbsp; a. **only one** item was selected,
    <br>&nbsp; b. the selected item is a **group**,
    <br>&nbsp; c. is **not** a **clipping mask**, and
    <br>&nbsp; d. all items within the group are selected.
<br> If all conditions are true the selected **group** and subgroups will be transformed to **Layers**.
4. Test if the selected items are not part of the **main layers** - cancel the script if so.
5. Test if the selection is a *complete* **layer** by the following conditions:
  <br>&nbsp; a. **more than one** item was selected, and 
    <br>&nbsp; b. all items of the layer were selected.
    <br> If all conditions are true the **layer** of the selected items will be transformed into a **group**.

### toGroup
In order to transform **layers to groups** the follwing steps are performed:
1. Check if the layer contains sublayers, and call itself again if it does, with a sublayer passing on. -> a **walking** function
2. If no sublayer were found anymore the actual **LayerToGroup** function is called, which
    <br>&nbsp; a. **creates** a new group
    <br>&nbsp; b. **renames** the new group
    <br>&nbsp; c. **moves** the new group **before** the layer.
    <br>&nbsp; d. **moves** all items from the layer **into the group**, and
    <br>&nbsp; e. **removes** the left over layer.
3. The script will fall back to the previous check.

### toLayer
In order to transfrom **groups to layers** the following steps are done:
1. **ungroup** the top most **group** using the **GroupToLayer** function:
<br>&nbsp; a. creating a new layer within the parent's layer,
<br>&nbsp; b. rename the layer,
<br>&nbsp; c. move the layer before the group
<br>&nbsp; d. move all items from the group into the new layer
<br>&nbsp; e. remove the old group
2. Check if the new layer contains additional groups, and call the **GroupToLayer** function -> **walking** function

## Possiblities
Endless

## Limitations
The inital check for layers and groups is very basic.
>[!NOTE]
>Let me know if you have better solutions or issues

