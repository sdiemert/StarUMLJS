/**
 * Created by PanJarda on 06-25-2016.
 */

define(function (require, exports, module) {

	var CodeGenerator = require("CodeGenerators/CodeGenerator").CodeGenerator;

	function RiotTagCodeGenerator(options) {

		this.tabSize = options.indentSpaces || 4;

	}

	RiotTagCodeGenerator.prototype = new CodeGenerator();

	RiotTagCodeGenerator.prototype.getFileName = function(fileName, withExtension){
		var extension = "";
		if (withExtension) {
			extension = ".tag";
		}
		return fileName + extension;
	};

  RiotTagCodeGenerator.prototype.matchDocPattern = function(node){
	return(node.replace("\n", "\n*" + this.getTab()) + "\n" + this.getTab() + " *\n");
  }

	RiotTagCodeGenerator.prototype.getMethodDocumentation = function (op) {

		var s = "";

		s += "\n" + this.getTab() + "/**\n";

		if (op.documentation && op.documentation !== "") {
			s += this.getTab() + " * @documentation: " + this.matchDocPattern(op.documentation);
		}

		if (op.specification && op.specification !== "") {
			s += this.getTab() + " * @specification: " + this.matchDocPattern(op.specification);
		}

	var preconditionsLength = op.preconditions.length;

		for (var i = 0; i < preconditionsLength; i++) {

	  var precondition = op.preconditions[i];

			if (precondition instanceof type.UMLConstraint)
				s += this.getTab() + " * @precondition " + precondition.name + " : " + this.matchDocPattern(precondition.specification);
		}

	var postconditionsLength = op.postconditions.length;

		for (i = 0; i < postconditionsLength; i++) {

	  var postcondition = op.postconditions[i];

			if (postcondition instanceof type.UMLConstraint)
				s += this.getTab() + " * @postcondition " + postcondition.name + " : " + this.matchDocPattern(postcondition.specification);
		}

	s += this.getDocumentationParameters(op);
		s += this.getTab() + " */\n";

		return s;
	};

  RiotTagCodeGenerator.prototype.getDocumentationParameters = function(op) {

	var parametersString = "";

	var parametersLength = op.parameters.length;

	for (var p = 0; p < parametersLength; p++) {

	  var parameter = op.parameters[p];

			switch(parameter.direction){
				case "return":
					parametersString += this.getTab() + " * @return ";
					break;

				case "in":
					parametersString += this.getTab() + " * @param ";
					break;
			}

			parametersString += parameter.name;

			if (parameter.type) parametersString += " {" + parameter.type + "} ";

			parametersString += this.matchDocPattern(parameter.documentation);
		}

	return parametersString;
  };

	RiotTagCodeGenerator.prototype.getDependencies = function (elem) {

		if (!elem || !elem.ownedElements || !elem.ownedElements.length) {

			return "";
		}

		var s = "";

		var ownedElementsLength = elem.ownedElements.length;

		for (var i = 0; i < ownedElementsLength; i++) {

			var ownedElement = elem.ownedElements[i];

			if (ownedElement instanceof type.UMLGeneralization) {

				if (ownedElement.target instanceof type.UMLClass) {

					s += "require('./" + ownedElement.target.name + ".tag')\n";
				}

			} else if (this.validUMLAssociation(ownedElement)) {

				s += "require('./" + ownedElement.end1.name + ".tag')\n";

			} else if ( ownedElement instanceof type.UMLDependency &&
					ownedElement.target instanceof type.UMLClass &&
					ownedElement.target.name){

				s += "require('./" + ownedElement.target.name + ".tag')\n";

			}
		}

		return s;

	};
  RiotTagCodeGenerator.prototype.validUMLAssociation = function(elem) {

	return  elem instanceof type.UMLAssociation &&
		elem.end1 instanceof type.UMLAssociationEnd &&
		elem.end2 instanceof type.UMLAssociationEnd &&
		elem.end2.reference instanceof type.UMLClass &&
		elem.end1.name !== "" &&
		elem.end2.reference.name !== "";
  }

	RiotTagCodeGenerator.prototype.getOperation = function (elem, op) {

		var s = "";

		s += this.getMethodDocumentation(op);

		//function name
		s += this.getTab() + op.name + "(" + this.getOperationParams(op) + ") {";

		//end function
		if (elem.isAbstract) {
			s += "\n" + this.getTab() + "throw 'AbstractMethodNotImplementedError';\n\n" + this.getTab() + "}\n\n";
		} else {
			s += "\n" + this.getTab() + this.getTab() + "//TODO: Implement Me \n\n" + this.getTab() + "}\n\n";
		}

		return s;
	};

	RiotTagCodeGenerator.prototype.getAttributeDefinitions = function (elem) {

		var s = "";

		var s = ""

		if (!elem || !elem.attributes || !elem.attributes.length)
			return s

		var tags = elem.ownedElements

		tags.forEach(function(tag) {
			if (this.validUMLAssociation(tag))
				s += this.getTab() + "<" + tag.end1.name + "/>\n"
		}, this)

		var attributesLength = elem.attributes.length;

		for (var i = 0; i < attributesLength; i++) {

			s += this.getTab() + "this." + elem.attributes[i].name + " = null;\n";
		}

		return s;

	};

	RiotTagCodeGenerator.prototype.getInheritance = function (elem) {

		if (!elem || !elem.ownedElements || !elem.ownedElements.length) {

			return "";
		}

		var s = "";

		for (var i = 0; i < elem.ownedElements.length; i++) {

			if (elem.ownedElements[i] instanceof type.UMLGeneralization) {

				if (elem.ownedElements[i].target instanceof type.UMLClass) {

					s += this.getTab() + "<" + elem.ownedElements[i].target.name + "/>\n";
				}
			}
		}

		s += "\n";

		return s;
	};


	RiotTagCodeGenerator.prototype.getClassDefinition = function (elem) {

		var s = "";

		s += this.getDependencies(elem);

		s += "<" + elem.name + ">\n";

		s += this.getInheritance(elem);

		s += this.getAttributeDefinitions(elem);

		s += this.getOperations(elem);

		s += "</" + elem.name + ">\n";

		return s;
	};


	RiotTagCodeGenerator.prototype.generate = function (elem) {

		var s = "";

		s += this.getClassDefinition(elem);

		return s;
	};

	exports.RiotTagCodeGenerator = RiotTagCodeGenerator;
});
