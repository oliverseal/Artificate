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