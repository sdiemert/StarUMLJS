/**
 * Created by sdiemert on 15-07-14.
 *
 * Sample Functional "class" definition. For reference only.
 */

function ClassFoo(param1, param2, proc){

    var that = {};  //or var that = ParentClass()

    proc = proc || {};

    //public vars
    that.foo = null;

    //protected vars
    proc.bar = null;

    //private vars
    var baz = null;

    var method1 = function(p1, p2){

    };

    var method2 = function(p1, p2){

    };

    that.method1 = method1;
    that.method2 = method2;

    return that;

}

module.exports = {ClassFoo : ClassFoo};
