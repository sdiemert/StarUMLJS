/**
 * Created by sdiemert on 15-07-10.
 */
define(function (require, exports, module) {

    var NotImplementedError = require("Errors/NotImplementedError").NotImplementedError;

    function CodeGenerator() {

        //empty structure

    }

    CodeGenerator.prototype.getHeader = function (elem) {

        var s = "";

        s += "/**\n";
        s += "*\n";
        s += "* Class: " + elem.name+"\n";
        s += "*/\n";

        return s;

    };

    CodeGenerator.prototype.getOperation = function (elem, op) {

        throw new NotImplementedError("getOperation(Object)");

    };

    CodeGenerator.prototype.getAttribute = function (elem, attr) {

        throw new NotImplementedError("getAttribute(Object)");

    };

    exports.CodeGenerator = CodeGenerator;

});
