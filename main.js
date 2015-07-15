/**
 *
 * Created by sdiemert on 15-07-10.
 */

define(function (require, exports, module) {
    var Commands            = app.getModule('command/Commands');
    var CommandManager      = app.getModule("command/CommandManager");
    var MenuManager         = app.getModule("menu/MenuManager");
    var ElementPickerDialog = app.getModule("dialogs/ElementPickerDialog");
    var FileSystem          = app.getModule("filesystem/FileSystem");
    var Dialogs             = app.getModule("dialogs/Dialogs");

    var JSGen = require("JSCodeGenerator");

    function handleGenerate(base, path, opts) {

        var result = new $.Deferred();

        // If base is not assigned, popup ElementPicker
        if (!base) {
            ElementPickerDialog.showDialog("Select a base model to generate codes", null, type.UMLPackage)
                .done(function (buttonId, selected) {
                    if (buttonId === Dialogs.DIALOG_BTN_OK && selected) {
                        base = selected;


                        // If path is not assigned, popup Open Dialog to select a folder
                        if (!path) {

                            FileSystem.showOpenDialog(false, true, "Select a folder where generated codes to be located", null, null, function (err, files) {
                                if (!err) {
                                    if (files.length > 0) {
                                        path = files[0];
                                        console.log("path: "+ path);
                                        JSGen.generate(base, path, opts).then(result.resolve, result.reject);
                                    } else {
                                        result.reject(FileSystem.USER_CANCELED);
                                    }
                                } else {
                                    result.reject(err);
                                }
                            });
                        } else {
                            JSGen.generate(base, path, opts).then(result.resolve, result.reject);
                        }
                    } else {
                        result.reject();
                    }
                });
        } else {
            // If path is not assigned, popup Open Dialog to select a folder
            if (!path) {
                FileSystem.showOpenDialog(false, true, "Select a folder where generated codes to be located", null, null, function (err, files) {
                    if (!err) {
                        if (files.length > 0) {
                            path = files[0];
                            JSGen.generate(base, path, opts).then(result.resolve, result.reject);
                        } else {
                            result.reject(FileSystem.USER_CANCELED);
                        }
                    } else {
                        result.reject(err);
                    }
                });
            } else {
                JSGen.generate(base, path, opts).then(result.resolve, result.reject);
            }
        }
        return result.promise();

    }

    var CMD = "tools.javascript";

    CommandManager.register("Generate JavaScript", CMD, handleGenerate);

    var menu = MenuManager.getMenu(Commands.TOOLS);

    menu.addMenuItem(CMD);

});

