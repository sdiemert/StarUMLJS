/**
 * Created by sdiemert on 15-07-10.
 */

define(function (require, exports, module) {

    var CodeGenerator = require("CodeGenerators/CodeGenerator").CodeGenerator;

    function TypeScriptCodeGenerator(spacesPerTab) {

        this.tabSize = spacesPerTab || 4;

    }

    TypeScriptCodeGenerator.prototype = new CodeGenerator();

    TypeScriptCodeGenerator.prototype.getMethodDocumentation = function (op) {

        var s = "";

        s += "\n/**\n";

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
            switch(op.parameters[p].direction){
                case "return": 
                    s += "* @return ";
                    break;

                case "in": 
                    s += "* @param ";
                    break;
            }
            s += op.parameters[p].name;  

            if (op.parameters[p].type) s+= " {" + op.parameters[p].type + "} ";

            s += op.parameters[p].documentation.replace("\n", "\n*" + this.getTab()) + "\n";

        }

        s += "*/\n";

        return s;
    };

    TypeScriptCodeGenerator.prototype.getDependancies = function (elem) {

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

            } else if (elem.ownedElements[i] instanceof type.UMLAssociation &&
                elem.ownedElements[i].end1 instanceof type.UMLAssociationEnd &&
                elem.ownedElements[i].end2 instanceof type.UMLAssociationEnd &&
                elem.ownedElements[i].end2.reference instanceof type.UMLClass &&
                elem.ownedElements[i].end1.name !== "" &&
                elem.ownedElements[i].end2.reference.name !== ""
            ) {

                //a (mostly) valid UML association we can use.

                s += "var " + elem.ownedElements[i].end1.name + " = require('" + elem.ownedElements[i].end2.reference.name + "');\n\n";

            } else if (
                elem.ownedElements[i] instanceof type.UMLDependency &&
                elem.ownedElements[i].target instanceof type.UMLClass &&
                elem.ownedElements[i].target.name
            ){

                s += "var " + elem.ownedElements[i].target.name + " = require('" + elem.ownedElements[i].target.name + "');\n\n";

            }

        }

        return s;

    };

    TypeScriptCodeGenerator.prototype.getOperation = function (elem, op) {

        var s = "";

        s += this.getMethodDocumentation(op);

        //function name
        s += elem.name + ".prototype." + op.name + " = function(";

        s += this.getOperationParams(op);

        //end function

        s += "){\n" + this.getTab() + "//TODO: Implement Me \n\n};\n\n";


        return s;
    };

    TypeScriptCodeGenerator.prototype.getClassDefinition = function (elem) {

        var s = "";

        s += "export class " + elem.name +this.getInheritance(elem)+"{\n";

        s += this.getAttributeDefinitions(elem);

        s += this.getTab();
        s += "//Constructor\n";
        s += "public constructor(){ \n // default blank constructor... \n \n };\n\n";
        s += "\n}\n\n";

        return s;
    };

    TypeScriptCodeGenerator.prototype.getAttributeDefinitions = function (elem) {

        var s = "";

        if (!elem || !elem.attributes || !elem.attributes.length) {

            return s;
        }

        for (var i = 0; i < elem.attributes.length; i++) {

            if (elem.attributes[i].visibility === "public") {

                s += this.getTab() + "public " + elem.attributes[i].name + " : "+elem.attributes[i].type+" = " + val + ";\n";

            } else if (elem.attributes[i].visibility === "protected") {

                s += this.getTab() + "protected " + elem.attributes[i].name + " : "+elem.attributes[i].type+ " = " + val + ";\n";

            } else {

                s += this.getTab() + "private " + elem.attributes[i].name + " : "+elem.attributes[i].type+ " = " + val + ";\n";

            }

        }

        for (var i = 0; i < elem.ownedElements.length; i++) {

            if (elem.ownedElements[i] instanceof type.UMLAssociation &&
                elem.ownedElements[i].end1 instanceof type.UMLAssociationEnd &&
                elem.ownedElements[i].end2 instanceof type.UMLAssociationEnd &&
                elem.ownedElements[i].end2.reference instanceof type.UMLClass &&
                elem.ownedElements[i].end1.name !== "" &&
                elem.ownedElements[i].end2.reference.name !== ""
            ) {

                //a (mostly) valid UML association we can use.

                //we are assuming that they already have included the required object as a dependancy and named it
                //correctly.
                if (elem.attributes[i].visibility === "public") {

                    s += this.getTab() + "public " + elem.attributes[i].name + " : "+elem.attributes[i].type+" = " + val + ";\n";

                } else if (elem.attributes[i].visibility === "protected") {

                    s += this.getTab() + "protected " + elem.attributes[i].name + " : "+elem.attributes[i].type+ " = " + val + ";\n";

                } else {

                    s += this.getTab() + "private " + elem.attributes[i].name + " : "+elem.attributes[i].type+ " = " + val + ";\n";

                }

            }

        }

        return s;

    };

    TypeScriptCodeGenerator.prototype.getInheritance = function (elem) {

        if (!elem || !elem.ownedElements || !elem.ownedElements.length) {

            return "";
        }

        var s = "";

        for (var i = 0; i < elem.ownedElements.length; i++) {

            if (elem.ownedElements[i] instanceof type.UMLGeneralization) {

                if (elem.ownedElements[i].target instanceof type.UMLClass) {

                    s += " extends " + elem.ownedElements[i].target.name;

                    // return here to prevent multiple inheritance.
                    return s;

                }

            }

        }

        return s;

    };

    TypeScriptCodeGenerator.prototype.generate = function (elem) {

        var s = "";

        //file header
        s += this.getHeader(elem);

        //dependencies
        s += this.getDependancies(elem);

        //object definition, includes attributes
        s += this.getClassDefinition(elem);

        //functions
        s += this.getOperations(elem);

        return s;
    };

    exports.TypeScriptCodeGenerator = TypeScriptCodeGenerator;
});

