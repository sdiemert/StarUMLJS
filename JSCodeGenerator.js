/**
 * Created by sdiemert on 15-07-10.
 */

define(function (require, exports, module) {

    "use strict";

    var fs      = app.getModule("filesystem/FileSystem");
    var fsUtils = app.getModule("file/FileUtils");
    var async   = app.getModule("utils/Async");

    /**
     *
     * @param {type.UMLPackage} baseModel
     * @param {string} basePath
     * @constructor
     */
    function
    JSCodeGenerator(baseModel, basePath) {

        this.baseModel = baseModel;
        this.basePath  = basePath;

    }

    JSCodeGenerator.prototype.generate = function (elem, path, opts) {

        var result = new $.Deferred();

        var self = this;

        var fullPath  = "";
        var directory = "";
        var file      = "";

        if (elem instanceof type.UMLModel) {

            console.log("type is UMLModel");

            fullPath = path;

            async.doSequentially(
                elem.ownedElements,

                function (child) {

                    return self.generate(child, fullPath, opts);

                },
                false
            ).then(result.resolve, result.reject);

        }

        else if (elem instanceof  type.UMLPackage) {

            fullPath = path + "/" + elem.name;
            console.log("type is UMLPackage");

            //handle creating a new directory.

            directory = fs.getDirectoryForPath(fullPath);
            directory.create(function (err, stat) {
                if (!err) {
                    Async.doSequentially(
                        elem.ownedElements,
                        function (child) {
                            return self.generate(child, fullPath, opts);
                        },
                        false
                    ).then(result.resolve, result.reject);
                } else {
                    console.log(err);
                    result.reject(err);
                }
            });

        } else if (elem instanceof type.UMLClass) {

            if (elem.stereotype === "annotationType") {

                //do annotation type

            } else {

                console.log("type is UMLClass");

                //generate the class.

                fullPath = path + "/" + elem.name + ".js";

                console.log(elem);

                console.log("generating class at: "+ fullPath);
                file     = fs.getFileForPath(fullPath);
                fsUtils.writeText(file, self.generateClassCode(elem, opts), true).then(result.resolve, result.reject);

            }

        } else {

            return result.resolve();

        }

        console.log("Done generation...");

        return result.promise();

    };

    JSCodeGenerator.prototype.generateClassCode = function(elem, opts){

        var s = "";



        return s;
    };


    exports.generate = function (baseModel, basePath, opts) {

        var jsgen = new JSCodeGenerator(baseModel, basePath);

        return jsgen.generate(baseModel, basePath, opts);

    };

});
