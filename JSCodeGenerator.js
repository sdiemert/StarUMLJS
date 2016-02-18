/**
 * Created by sdiemert on 15-07-10.
 */

define(function (require, exports, module) {

    "use strict";

    var fs = app.getModule("filesystem/FileSystem");
    var fsUtils = app.getModule("file/FileUtils");
    var async = app.getModule("utils/Async");

    var PrototypeCodeGenerator = require("CodeGenerators/PrototypeCodeGenerator").PrototypeCodeGenerator;
    var FunctionalCodeGenerator = require("CodeGenerators/FunctionalCodeGenerator").FunctionalCodeGenerator;
    var MongooseCodeGenerator = require("CodeGenerators/MongooseCodeGenerator").MongooseCodeGenerator;
	var EmberDSCodeGenerator = require("CodeGenerators/EmberDSCodeGenerator").EmberDSCodeGenerator;
    var ES2015CodeGenerator = require("CodeGenerators/ES2015CodeGenerator").ES2015CodeGenerator;

    /**
     *
     * @param {type.UMLPackage} baseModel
     * @param {string} basePath
     * @constructor
     */
    function JSCodeGenerator(baseModel, basePath, opts) {

        this.baseModel = baseModel;
        this.basePath = basePath;
        this.opts = opts;
        this.generator = this.getGenerator(opts);
    }

    JSCodeGenerator.prototype.generate = function (elem, path, opts) {

        var result = new $.Deferred();

        var self = this;

        var fullPath = "";
        var directory = "";
        var file = "";

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

                fullPath = path + "/" + self.generator.getFileName(elem.name,true);

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

         return this.generator.generate(elem);

    };

    /**
    * Get the appropriate generator class based on the options set in the configuration
    * @param options the options
    * @return the generator
    */
     JSCodeGenerator.prototype.getGenerator = function (options) {
           var generator = null;
           switch (options.classType) {
               case "functional":
                   generator = new FunctionalCodeGenerator(options.indentSpaces);
                   break;
               case "prototype":

                   generator = new PrototypeCodeGenerator(options.indentSpaces);
                   break;
               case "mongoose":
                   generator = new MongooseCodeGenerator(options);
                   break;
                case "ember":
                  generator = new EmberDSCodeGenerator(options);
                  break;
				case "es2015":
                    generator = new ES2015CodeGenerator(options);
                    break;
           }
           console.log(generator);
           return generator;
     };

    exports.generate = function (baseModel, basePath, opts) {

        var jsgen = new JSCodeGenerator(baseModel, basePath, opts);

        return jsgen.generate(baseModel, basePath, opts);

    };

});
