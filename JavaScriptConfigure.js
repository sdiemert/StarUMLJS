define(function (require, exports, module) {
    "use strict";

    var AppInit           = app.getModule("utils/AppInit"),
        Core              = app.getModule("core/Core"),
        PreferenceManager = app.getModule("core/PreferenceManager");

    var preferenceId = "javascript";

    var javaScriptConfigure = {

        "javascript.gen"             : {
            text: "JavaScript Code Generation",
            type: "Section"
        },
        /*
         "javascript.gen.doc": {
         text: "JavaScript Documentation",
         description: "Generate JavaScript documentation from comments.",
         type: "Check",
         default: true
         },
         */
        "javascript.gen.classType"   : {
            text       : "Class Generation Pattern",
            description: "Pattern to use for class generation.",
            type       : "Dropdown",
            options    : [{value: "prototype", text: "prototype"}, {value: "functional", text: "functional"}],
            default    : {value: "prototye", text: "prototype"}
        },
        "javascript.gen.indentSpaces": {
            text       : "Indent Spaces",
            description: "Number of spaces for indentation.",
            type       : "Number",
            default    : 4
        }
    };

    function getId() {
        return preferenceId;
    }

    function getGenOptions() {
        return {
            indentSpaces: PreferenceManager.get("javascript.gen.indentSpaces"),
            classType   : PreferenceManager.get("javascript.gen.classType")
        };
    }

    AppInit.htmlReady(function () {
        PreferenceManager.register(preferenceId, "JavaScript", javaScriptConfigure);
    });

    exports.getId         = getId;
    exports.getGenOptions = getGenOptions;

});
