/**
 * Created by sdiemert on 15-07-10.
 */

define(function (require, exports, module) {
    var CodeGenerator = require("CodeGenerators/CodeGenerator").CodeGenerator;

    function PrototypeCodeGenerator() {

    }

    PrototypeCodeGenerator.prototype = new CodeGenerator();

    PrototypeCodeGenerator.prototype.getOperation = function (elem, op) {

        //function name
        var s = elem.name + ".prototype." + op.name + " = function(";

        s += this.getOperationParams(op);

        //end function
        s += "){\n" + this.getTab() + " /*function implementation*/ \n\n};\n\n";

        return s;
    };

    PrototypeCodeGenerator.prototype.getClassDefinition = function (elem) {

        var s = "";

        s += "function " + elem.name + "(){\n";
        s += this.getTab();
        s += "//Constructor\n\n";

        s += this.getAttributeDefinitions(elem);

        s += "\n}\n\n";

        return s;
    };

    PrototypeCodeGenerator.prototype.getAttributeDefinitions = function (elem) {

        var s = "";

        if (!elem || !elem.attributes || !elem.attributes.length) {

            return s;
        }

        for (var i = 0; i < elem.attributes.length; i++){

            s += this.getTab() + "this."+elem.attribtes[i]+ " = null;\n";

        }

        return s;

    };

    PrototypeCodeGenerator.prototype.generate = function (elem) {

        var s = "";

        //file header
        s += this.getHeader(elem);

        //dependencies

        //object definition, includes attributes
        s += this.getClassDefinition(elem);

        //functions
        s += this.getOperations(elem);

        // exports at end of file.
        s += this.getExports(elem);

        return s;
    };

    exports.PrototypeCodeGenerator = PrototypeCodeGenerator;
});

