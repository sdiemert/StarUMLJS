/**
 * Created by sdiemert on 15-07-10.
 */

define(function (require, exports, module) {

    var CodeGenerator = require("CodeGenerators/CodeGenerator").CodeGenerator;

    function PrototypeCodeGenerator() {

    }

    PrototypeCodeGenerator.prototype = new CodeGenerator();

    PrototypeCodeGenerator.prototype.getMethodDocumentation = function (op) {

        var s = "";

        s += "/**\n";

        if (op.documentation && op.documentation !== "") {

            s += "* @documentation: " + op.documentation.replace("\n", "\n*" + this.getTab()) + "\n*\n";

        }

        if (op.specification && op.specification !== "") {

            s += "* @specification: " + op.specification.replace("\n", "\n*" + this.getTab()) + "\n*\n";

        }

        for (var i = 0; i < op.preconditions.length; i++) {

            if (op.preconditions[i] instanceof type.UMLConstraint) {

                s += "* @precondition " + op.preconditions[i].name + " : " + op.preconditions[i].specification.replace("\n", "\n*" + this.getTab()) + "\n";

            }

        }

        for (i = 0; i < op.postconditions.length; i++) {

            if (op.postconditions[i] instanceof type.UMLConstraint) {

                s += "* @postcondition " + op.postconditions[i].name + " : " + op.postconditions[i].specification.replace("\n", "\n*" + this.getTab()) + "\n";

            }

        }

        for (var p = 0; p < op.parameters.length; p++) {

            s += "* @param " + op.parameters[p].name + " {" + op.parameters[p].type + "} " + op.parameters[p].documentation.replace("\n", "\n*" + this.getTab()) + "\n";

        }

        s += "* @return {null}\n";

        s += "*/\n";

        return s;
    };

    PrototypeCodeGenerator.prototype.getDependancies = function (elem) {

        if (!elem || !elem.ownedElements || !elem.ownedElements.length) {

            return "";
        }

        var s = "";

        for (var i = 0; i < elem.ownedElements.length; i++) {

            if (elem.ownedElements[i] instanceof type.UMLGeneralization) {

                if (
                    elem.ownedElements[i].target instanceof type.UMLClass
                ) {

                    s += "var " + elem.ownedElements[i].target.name + " = require('" + elem.ownedElements[i].target.name + "');\n\n";

                }

            }

        }

        return s;

    };

    PrototypeCodeGenerator.prototype.getOperation = function (elem, op) {

        var s = "";

        s += this.getMethodDocumentation(op);

        //function name
        s += elem.name + ".prototype." + op.name + " = function(";

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

        for (var i = 0; i < elem.attributes.length; i++) {

            s += this.getTab() + "this." + elem.attributes[i].name + " = null;\n";

        }

        return s;

    };

    PrototypeCodeGenerator.prototype.getInheritance = function (elem) {

        if (!elem || !elem.ownedElements || !elem.ownedElements.length) {

            return "";
        }

        var s = "";

        for (var i = 0; i < elem.ownedElements.length; i++) {

            if (elem.ownedElements[i] instanceof type.UMLGeneralization) {

                if (elem.ownedElements[i].target instanceof type.UMLClass) {

                    s += elem.name + ".prototype = new " + elem.ownedElements[i].target.name + "();";

                }

            }

        }

        return s;

    };

    PrototypeCodeGenerator.prototype.generate = function (elem) {

        var s = "";

        //file header
        s += this.getHeader(elem);

        //dependencies
        s += this.getDependancies(elem);

        //object definition, includes attributes
        s += this.getClassDefinition(elem);

        //get inheritance if it exists.
        s += this.getInheritance(elem);

        //functions
        s += this.getOperations(elem);

        // exports at end of file.
        s += this.getExports(elem);

        console.log("completed generate()");
        console.log(s);

        return s;
    };

    exports.PrototypeCodeGenerator = PrototypeCodeGenerator;
});

