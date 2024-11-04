# Resources I find helpfull

## JavaScript scripting guide
The latest JavaScript Scripting guide for Adobe Illustrator can be found at [Adobe's developer site](https://developer.adobe.com/console/292531/servicesandapis/ai) or you can download a quite recent file from my guithub [here](Illustrator%20JavaScript%20Scripting%20Reference.pdf). <br>
An online version with additional information is provided by [docsforadobe.dev](https://ai-scripting.docsforadobe.dev). <br>
I do work with both in parallel.

## Scripting in VS-Code
Scince Adobe abandeoned it's own ESK the way to program scripts for Adobe Illustrator is **VS-Code** with the **ExtendScript Debugger** extension installed https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug.

### First run
To setup your 

```javascript
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "current",
            "script": "${file}",
            "type": "extendscript-debug",
            "request": "launch",
            "hostAppSpecifier": "illustrator-29.064",
            "engineName": "main",
        },
    ]
}
```

## ScriptUI Reference
If your script includes user interaction, [this guide](ScriptUI_2-16.pdf) and more over the corresponding website is a must. The guide has a lot of examples of what is possible and how to do it including example codes. In addition it does includes information about things that do not work, how to avoid them or bypass them. <br>
The website **https://scriptui.joonas.me/** is an online builder for your script UI. You can assemble complex layouts, change style parameters and export the code to your script file.  