/**
 * Created by sdiemert on 15-07-10.
 */

define(function (require, exports, module) {
    var CodeGenerator = require("CodeGenerators/CodeGenerator").CodeGenerator;

    function PrototypeCodeGenerator() {

    }

    PrototypeCodeGenerator.prototype = new CodeGenerator();

    PrototypeCodeGenerator.prototype.getOperation = function (elem, op) {

        var s = elem.name + ".prototype." + op + " = function(){\n\n}";

        return s;
    };

    exports.PrototypeCodeGenerator = PrototypeCodeGenerator;
});

