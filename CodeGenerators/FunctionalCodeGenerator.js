/**
 * Created by sdiemert on 15-07-10.
 *
 * Generates code in a Functional "class" pattern.
 * See templates/functional/functional.js as an example.
 */

define(function (require, exports, module) {

    var CodeGenerator = require("CodeGenerators/CodeGenerator").CodeGenerator;

    function FunctionalCodeGenerator(spacesPerTab) {

        this.tabSize = spacesPerTab || 4;

    }

    FunctionalCodeGenerator.prototype = new CodeGenerator();

    FunctionalCodeGenerator.prototype.getMethodDocumentation = function (op) {

        var s = "";

        s += "\n" + this.getTab() + "/**\n";

        if (op.documentation && op.documentation !== "") {

            s += this.getTab() + "* @documentation: " + op.documentation.replace("\n", "\n" + this.getTab() + "*" + this.getTab()) + "\n" + this.getTab() + "*"+this.getTab()+"\n";

        }

        if (op.specification && op.specification !== "") {

            s += this.getTab() + "* @specification: " + op.specification.replace("\n", "\n"+this.getTab()+"*" + this.getTab()) + "\n"+this.getTab()+"*\n";

        }

        for (var i = 0; i < op.preconditions.length; i++) {

            if (op.preconditions[i] instanceof type.UMLConstraint) {

                s += this.getTab() + "* @precondition " + op.preconditions[i].name + " : " + op.preconditions[i].specification.replace("\n", "\n*" + this.getTab()) + "\n";

            }

        }

        for (i = 0; i < op.postconditions.length; i++) {

            if (op.postconditions[i] instanceof type.UMLConstraint) {

                s += this.getTab() + "* @postcondition " + op.postconditions[i].name + " : " + op.postconditions[i].specification.replace("\n", "\n"+this.getTab()+"*" + this.getTab()) + "\n";

            }

        }

        for (var p = 0; p < op.parameters.length; p++) {

            s += this.getTab() + "* @param " + op.parameters[p].name + " {" + op.parameters[p].type + "} " + op.parameters[p].documentation.replace("\n", "\n+"+this.getTab()+"*" + this.getTab()) + "\n";

        }

        s += this.getTab() + "* @return {null}\n";

        s += this.getTab() + "*/\n";

        return s;
    };

    FunctionalCodeGenerator.prototype.getDependancies = function (elem) {

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
            ) {

                s += "var " + elem.ownedElements[i].target.name + " = require('" + elem.ownedElements[i].target.name + "');\n\n";

            }

        }

        return s;

    };

    FunctionalCodeGenerator.prototype.getOperation = function (elem, op) {

        var s = "";

        s += this.getMethodDocumentation(op);

        //function name
        s += this.getTab() + "var " + op.name + " = function(";

        s += this.getOperationParams(op);

        //end function
        if (elem.isAbstract) {

            s += "){\n" + this.getTab() + this.getTab() + "throw 'AbstractMethodNotImplementedError';\n\n" + this.getTab() + "};\n\n";

        } else {

            s += "){\n" + this.getTab() + this.getTab() + "//TODO: Implement Me \n\n" + this.getTab() + "};\n\n";

        }

        return s;
    };

    FunctionalCodeGenerator.prototype.getClassDefinition = function (elem) {

        var s = "";

        s += "function " + elem.name + "(proc){\n";

        var inheirt = this.getInheritance(elem);

        //assume that we don't have a generalziation
        if (inheirt === "") {

            s += this.getTab() + "var that = {};\n";

        } else {

            s += this.getTab() + inheirt + "\n";
        }

        s += "\n";

        s += this.getTab() + "proc = proc || {};\n\n";

        s += this.getAttributeDefinitions(elem);

        s += "\n\n";

        return s;
    };

    FunctionalCodeGenerator.prototype.getAttributeDefinitions = function (elem) {

        var s = "";

        if (!elem || !elem.attributes || !elem.attributes.length) {

            return s;
        }

        var val = null;

        for (var i = 0; i < elem.attributes.length; i++) {

            val = elem.attributes[i].defaultValue || "null";


            if (elem.attributes[i].visibility === "public") {

                s += this.getTab() + "that." + elem.attributes[i].name + " = " +  val  + ";\n";

            } else if (elem.attributes[i].visibility === "protected") {

                s += this.getTab() + "proc." + elem.attributes[i].name + " = " + val + ";\n";

            } else {

                s += this.getTab() + "var " + elem.attributes[i].name + " = " + val + ";\n";

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
                if(elem.ownedElements[i].end1.visibility === "public"){

                    s += this.getTab() + "that." + elem.ownedElements[i].end1.name + " = " + elem.ownedElements[i].end1.name + ";\n";

                }else if(elem.ownedElements[i].end1.visibility === "protected"){

                    s += this.getTab() + "proc." + elem.ownedElements[i].end1.name + " = " + elem.ownedElements[i].end1.name + ";\n";

                }else{

                    s += this.getTab() + "var " + elem.ownedElements[i].end1.name + " = " + elem.ownedElements[i].end1.name + ";\n";

                }


            }

        }

        return s;

    };

    FunctionalCodeGenerator.prototype.getInheritance = function (elem) {

        if (!elem || !elem.ownedElements || !elem.ownedElements.length) {

            return "";
        }

        var s = "";

        for (var i = 0; i < elem.ownedElements.length; i++) {

            if (elem.ownedElements[i] instanceof type.UMLGeneralization) {

                if (elem.ownedElements[i].target instanceof type.UMLClass) {

                    s += "var that = " + elem.ownedElements[i].target.name + "();\n";

                }

            }

        }

        return s;

    };

    FunctionalCodeGenerator.prototype.setOperationVisibility = function(elem){

        if(!elem || !elem.operations || !elem.operations.length){

            return "";

        }

        var s = "";

        for(var i = 0; i < elem.operations.length; i++){

            if(elem.operations[i].visibility === "public") {

                s += this.getTab()+"that."+elem.operations[i].name +" = "+ elem.operations[i].name+";\n";

            }else if(elem.operations[i].visibility === "protected"){

                s += this.getTab()+"proc."+elem.operations[i].name +" = "+ elem.operations[i].name+";\n";

            }else{

                //do nothing, they are already private.

            }

        }



        return s;

    };

    FunctionalCodeGenerator.prototype.endClass = function(elem){

        var s = "";

        //add in the return for the public members
        s += "\n" + this.getTab()+"return that;\n";

        s += "\n}\n\n";

        return s;
    }


    FunctionalCodeGenerator.prototype.generate = function (elem) {

        var s = "";

        //file header
        s += this.getHeader(elem);

        //dependencies
        s += this.getDependancies(elem);

        //object definition, includes attributes
        s += this.getClassDefinition(elem);

        //functions
        s += this.getOperations(elem);

        //assign public and protected methods.
        s += this.setOperationVisibility(elem);

        s += this.endClass(elem);

        // exports at end of file.
        s += this.getExports(elem);


        return s;
    };

    exports.FunctionalCodeGenerator = FunctionalCodeGenerator;
});

