# RenameByType
>Application: Adobe Illustrator<br>
Version: 22.0 and above

It is hard to distiguish different types of objects in the layers panel. **Adobe Illustrator** does not used icons like **Blender** does. To overcome this issue I use a nameing pattern to idicate if I am dealing with an **Group** or **Clipping Mask**, with an **Compound Path** or just a regular **Path**. This script applies my naming pattern to all objects in the active document. I did not define some item types.

## What it is good for
Keeping track of your items and staying organised in your jungle of layers, groups and items.

## Step by step
1. The script laods the pattern list defined by you (or me if you don't change it).
2. It iterates through all given **item types** on a document level.
3. For each item in the list (of item types) it
  <br>&nbsp; a. checks if the item's name is set (if not it continous with the next one),
    <br>&nbsp; b. checks if the item is a clipping mask (clipping mask are special group items and are stored as them),
    <br>&nbsp; c. removes any pattern (listed in the user object) at the beginning of the name,
    <br>&nbsp; d. removes any pattern as long as the both are found,
    <br>&nbsp; e. removes any pattern as long as they are found at the beginning and end of the name (**turned off by default**)
4. Adds the type specific pattern at the beginning of the name

## Possiblities
You can change, add, and remove pattern simply by modifying the user obejct (**user.pattern**). Item types not listed are will not be preocessed, like **symbolys**, **placed**, **graphs**, **mesh**, **non native**, **embedded** and **raster** items in the default setting below. You can
* change the pattern by replacing the characters, for example "**<>**" to "**db**",
* add item types by defining a pattern for their document object name **SymbolItems**; Note that those names need to exact with **capital first letter** and in plural form with an **s**, 
* remove item types by **commenting out**, like I did in the default settings.

> [!NOTE]
> **ClippingMasks** and **fallback** are script specific and not used in Adobe Illustrator <br>
> Item types have to start with **capital first letter** and in plural form with an **s**

```javascript
var user = {
    pattern: {
        PathItems: "<>",
        GroupItems: "()",
        CompoundPathItems: "++",
        GridRepeatItems: "||",
        RadialRepeatItems: "||",
        SymmetryRepeatItems: "||",
        TextFrames: "##",
        LegacyTextItems: "##",
        PluginItems: "**",
        /*
        No symbols are defined for the following items
        SymbolItems: "..",
        PlacedItems: "..",
        GraphItems: "..",
        MeshItems: "..",
        NonNativeItems: "..",
        EmbeddedItems: "..",
        RasterItems: "..",
        */
        ClippingMasks: "[]",
        fallback: "..", // not used
    },
};
```

You can add, remove, or modify the search and replace functions. So far the following search/replace actions are implemented (**xName** is the item's name): 
``` javascript
// remove pattern at the beginning if found
xName = xName.replace("/^(" + pat + ")", "");
```
``` javascript
// remove any pattern as long as both are found
if (xName.search("\\" + pat[0]) >= 0 && xName.search("\\" + pat[1]) >= 0) { 
    xName = xName.replace(pat[0], "");
    xName = xName.replace(pat[1], "");
}
```
Implemented but not used in the default settings: 
``` javascript
// remove pattern at the start and end if found
if (xName.search("\\" + pat[0]) == 0 && xName.search("\\" + pat[1]) == xName.length) {
    xName = xName.substring(1, xName.length - 1);
};
```

## Limitations
* The script does not respect the users selection but takes all items.
* The search and replace functions are rudimentary.