/**
 * Created by cotlod on 15-11-09.
 */

define(function (require, exports, module) {

    var CodeGenerator = require("CodeGenerators/CodeGenerator").CodeGenerator;

    function ES2015CodeGenerator(spacesPerTab) {

        this.tabSize = spacesPerTab || 4;

    }

    ES2015CodeGenerator.prototype = new CodeGenerator();

	ES2015CodeGenerator.prototype.matchDocPattern = function(node){
		return(node.replace("\n", "\n*" + this.getTab()) + "\n*\n");
	}

    ES2015CodeGenerator.prototype.getMethodDocumentation = function (op) {

        var s = "";

        s += "\n/**\n";

        if (op.documentation && op.documentation !== "") {
            s += "* @documentation: " + this.matchDocPattern(op.documentation);
        }

        if (op.specification && op.specification !== "") {
            s += "* @specification: " + this.matchDocPattern(op.specification);
        }

		var preconditionsLength = op.preconditions.length;

        for (var i = 0; i < preconditionsLength; i++) {

			var precondition = op.preconditions[i];

            if (precondition instanceof type.UMLConstraint)
                s += "* @precondition " + precondition.name + " : " + this.matchDocPattern(precondition.specification);
        }

		var postconditionsLength = op.postconditions.length;

        for (i = 0; i < postconditionsLength; i++) {

			var postcondition = op.postconditions[i];

            if (postcondition instanceof type.UMLConstraint)
                s += "* @postcondition " + postcondition.name + " : " + this.matchDocPattern(postcondition.specification);
        }

		s += this.getDocumentationParameters(op);
        s += "*/\n";

        return s;
    };

	ES2015CodeGenerator.prototype.getDocumentationParameters = function(op) {

		var parametersString = "";

		var parametersLength = op.parameters.length;

		for (var p = 0; p < parametersLength; p++) {

			var parameter = op.parameters[p];

            switch(parameter.direction){
                case "return":
                    parametersString += "* @return "
                    break;

                case "in":
                    parametersString += "* @param "
                    break;
            }

            parametersString += parameter.name;

            if (parameter.type) parametersString += " {" + parameter.type + "} ";

            parametersString += this.matchDocPattern(parameter.documentation);
        }

		return parametersString;
	};

    ES2015CodeGenerator.prototype.getDependencies = function (elem) {

        if (!elem || !elem.ownedElements || !elem.ownedElements.length) {

            return "";
        }

        var s = "";

		var ownedElementsLength = elem.ownedElements.length;

        for (var i = 0; i < ownedElementsLength; i++) {

			var ownedElement = elem.ownedElements[i];

            if (ownedElement instanceof type.UMLGeneralization) {

                if (ownedElement.target instanceof type.UMLClass) {

                    s += "import {" + ownedElement.target.name + "} from '" + ownedElement.target.name + "';\n\n";
                }

            } else if (this.validUMLAssociation(ownedElement)) {

                s += "import {" + ownedElement.end1.name + "} from '" + ownedElement.end2.reference.name + "';\n\n";

            } else if (	ownedElement instanceof type.UMLDependency &&
		                ownedElement.target instanceof type.UMLClass &&
		                ownedElement.target.name){

                s += "import {" + ownedElement.target.name + "} from '" + ownedElement.target.name + "';\n\n";

            }
        }

        return s;

    };
	ES2015CodeGenerator.prototype.validUMLAssociation = function(elem) {

		return 	elem instanceof type.UMLAssociation &&
				elem.end1 instanceof type.UMLAssociationEnd &&
				elem.end2 instanceof type.UMLAssociationEnd &&
				elem.end2.reference instanceof type.UMLClass &&
				elem.end1.name !== "" &&
				elem.end2.reference.name !== "";
	}

    ES2015CodeGenerator.prototype.getOperation = function (elem, op) {

        var s = "";

        s += this.getMethodDocumentation(op);

        //function name
        s += op.name + "(" + this.getOperationParams(op) + "){";

        //end function
        if (elem.isAbstract) {
            s += "\n" + this.getTab() + "throw 'AbstractMethodNotImplementedError';\n\n};\n\n";
        } else {
            s += "\n" + this.getTab() + "//TODO: Implement Me \n\n};\n\n";
        }

        return s;
    };

    ES2015CodeGenerator.prototype.getClassDefinition = function (elem) {

        var s = "";

        s += "export default class" + elem.name + "(){\n";
        s += this.getTab();
        s += "//Constructor\n\n";

        s += this.getAttributeDefinitions(elem);

        s += "\n}\n\n";

        return s;
    };

    ES2015CodeGenerator.prototype.getAttributeDefinitions = function (elem) {

        var s = "";

        if (!elem || !elem.attributes || !elem.attributes.length) {

            return s;
        }

		var attributesLength = elem.attributes.length;

        for (var i = 0; i < attributesLength; i++) {

            s += this.getTab() + "this." + elem.attributes[i].name + " = null;\n";
        }

		var ownedElementsLength = elem.ownedElements.length;

        for (var i = 0; i < ownedElementsLength; i++) {

			var ownedElement = elem.ownedElements[i];

            if (this.validUMLAssociation(ownedElement)){
                s += this.getTab() + "this." + ownedElement.end1.name + " = " + ownedElement.end1.name + ";\n";
            }

        }

        return s;

    };

    ES2015CodeGenerator.prototype.getInheritance = function (elem) {

        if (!elem || !elem.ownedElements || !elem.ownedElements.length) {

            return "";
        }

        var s = "";

        for (var i = 0; i < elem.ownedElements.length; i++) {

            if (elem.ownedElements[i] instanceof type.UMLGeneralization) {

                if (elem.ownedElements[i].target instanceof type.UMLClass) {

                    s += elem.name + ".prototype = new " + elem.ownedElements[i].target.name + "();\n";
                }
            }
        }

        return s;
    };

    ES2015CodeGenerator.prototype.generate = function (elem) {

        var s = "";

        s += this.getHeader(elem);
        s += this.getDependencies(elem);
        s += this.getClassDefinition(elem);
        s += this.getInheritance(elem);
        s += this.getOperations(elem);
        s += this.getExports(elem);

        return s;
    };

    exports.ES2015CodeGenerator = ES2015CodeGenerator;
});
