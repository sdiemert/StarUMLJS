/**
 * Created by sdiemert on 15-07-10.
 */
define(function (require, exports, module) {

    var NotImplementedError = require("Errors/NotImplementedError").NotImplementedError;

    function CodeGenerator(tabSize) {

        this.tabSize = tabSize || 4;

    }

    CodeGenerator.prototype.getDependancies = function(elem){

        throw new NotImplementedError("getDependancies(Object)");

    };

    CodeGenerator.prototype.getMethodDocumentation = function(elem){

        throw new NotImplementedError("getDocumentation(Object)");

    };

    CodeGenerator.prototype.getTab = function(){

        var s = "";
        for(var i = 0; i < this.tabSize; i++){

            s += " ";

        }
        return s;
    };

    CodeGenerator.prototype.getClassDefinition = function(elem){

        throw new NotImplementedError("getClassDefinition(Object)");

    };

    CodeGenerator.prototype.getHeader = function (elem) {


        var now = new Date();
        var s = "";

        s += "/**\n";
        s += "* Generated On: "+ now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+"\n";
        s += "* Class: " + elem.name+"\n";
        if(elem.documentation && elem.documentation !== ""){

            s += "* Description: "+elem.documentation.replace("\n", "\n* ")+"\n";

        }

        s += "*/\n\n";

        return s;

    };

    CodeGenerator.prototype.getInheritance = function(elem){

        throw new NotImplementedError("getInheritance(Object)");

    };

    CodeGenerator.prototype.getOperation = function (elem, op) {

        throw new NotImplementedError("getOperation(Object, Object)");

    };

    CodeGenerator.prototype.getAttributeDefinitions = function (elem) {

        throw new NotImplementedError("getAttribute(Object, Object)");

    };

    CodeGenerator.prototype.getExports = function (elem) {

        return "\n\nmodule.exports = {"+elem.name+":"+elem.name+"};";

    };

    CodeGenerator.prototype.getOperations = function(elem){

        if( !elem || !elem.operations || !elem.operations.length ){

            return "";

        }

        var s = "";

        for(var i = 0; i < elem.operations.length; i++){

            s += this.getOperation(elem, elem.operations[i]);

        }

        return s;

    };

    CodeGenerator.prototype.getOperationParams = function(op){

        if(!op || !op.parameters || !op.parameters.length){
            return "";
        }

        var s = "";

        for(var i = 0; i < op.parameters.length; i++){

            if(i !== op.parameters.length - 1){

                s += op.parameters[i].name+", ";

            }else{

                s += op.parameters[i].name;
            }

        }

        return s;

    };

    CodeGenerator.prototype.getInheritence = function(elem){

        throw new NotImplementedError("getInheritence(Object)");

    };

    CodeGenerator.prototype.generate = function (elem) {

        throw new NotImplementedError("generate(Object)");

    };

    exports.CodeGenerator = CodeGenerator;

});
