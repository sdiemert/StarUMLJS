/**
 * Created by sdiemert on 15-07-10.
 */

define(function (require, exports, module) {
    "use strict";

    function NotImplementedError(fxnName) {

        this.name    = "NotImplementedError";
        this.message = "Method " + fxnName + " does not have a concrete implementation.";

    }

    exports.NotImplementedError = NotImplementedError;

});

