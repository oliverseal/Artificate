Object.prototype.merge = function(objectWithPrecedence) {
    if (objectWithPrecedence != null)
    {
        for(var prop in objectWithPrecedence)
        {
            if (typeof(objectWithPrecedence[prop]) != 'function') {
                this[prop] = objectWithPrecedence[prop];
            }
        }
    }
}

/**
 * Provides requestAnimationFrame in a cross browser way.
 * @author paulirish / http://paulirish.com/
 */

if ( !window.requestAnimationFrame ) {

	window.requestAnimationFrame = ( function() {

		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

			window.setTimeout( callback, 1000 / 60 );

		};

	} )();

}

//delegates :D
function Delegate(f)
{
        this.func = f;
}
Delegate.prototype.func = function(){}
Delegate.create = function(obj, func)
{
        var f = function()
        {
                var target = arguments.callee.target;
                var func = arguments.callee.func;
                if(func && target)
                    return func.apply(target, arguments);
                return null;
        };

        f.target = obj;
        f.func = func;

        return f;
}

