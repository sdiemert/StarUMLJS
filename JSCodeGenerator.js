/**
 * Created by sdiemert on 15-07-10.
 */

define(function (require, exports, module) {

    "use strict";

    var fs      = app.getModule("filesystem/FileSystem");
    var fsUtils = app.getModule("file/FileUtils");
    var async   = app.getModule("utils/Async");

    var PrototypeCodeGenerator = require("CodeGenerators/PrototypeCodeGenerator").PrototypeCodeGenerator;
    var FunctionalCodeGenerator = require("CodeGenerators/FunctionalCodeGenerator").FunctionalCodeGenerator;

    /**
     *
     * @param {type.UMLPackage} baseModel
     * @param {string} basePath
     * @constructor
     */
    function JSCodeGenerator(baseModel, basePath, opts) {

        this.baseModel = baseModel;
        this.basePath  = basePath;
        this.opts      = opts;

    }

    JSCodeGenerator.prototype.generate = function (elem, path, opts) {

        var result = new $.Deferred();

        var self = this;

        var fullPath  = "";
        var directory = "";
        var file      = "";

        if (elem instanceof type.UMLModel) {

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

            //handle creating a new directory.

            directory = fs.getDirectoryForPath(fullPath);
            directory.create(function (err, stat) {
                if (!err) {
                    async.doSequentially(
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

                //generate the class.

                fullPath = path + "/" + elem.name + ".js";

                console.log(elem);

                file = fs.getFileForPath(fullPath);
                fsUtils.writeText(file, self.generateClassCode(elem, opts), true).then(result.resolve, result.reject);

            }

        } else {

            return result.resolve();

        }

        return result.promise();

    };

    JSCodeGenerator.prototype.generateClassCode = function (elem, opts) {

        //filter on ops up here.
        var cGen = null;

        if(opts.classType === "functional"){

            cGen = new FunctionalCodeGenerator(opts.indentSpaces);

        }else{

            cGen = new PrototypeCodeGenerator(opts.indentSpaces);

        }

        console.log(cGen);

        return cGen.generate(elem);

    };

    exports.generate = function (baseModel, basePath, opts) {

        var jsgen = new JSCodeGenerator(baseModel, basePath, opts);

        return jsgen.generate(baseModel, basePath, opts);

    };

});
