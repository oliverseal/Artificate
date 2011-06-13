if (!window.unshift)
    unshift = {};
if (!window.unshift.artificate)
    unshift.artificate = {};
    
unshift.artificate.Base = function (containerElement, width, height, options) {
    this.container = containerElement;
    this.isAnimating = false;
    this.width = width;
    this.height = width;
    this.canvas = null;
    this.context = null;
    //default options
    /* Magic vars: 
        percent  #progress as percentage
        start    #beginning value
        end      #complete value
        current  #current value
    */     
    this.options = {
        
    };
    this.options.merge(options);
}
unshift.artificate.Base.prototype.createElements = function() {
    if (this.canvas == null){
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width', this.width);
        this.canvas.setAttribute('height', this.height);
    }
    this.context = this.canvas.getContext('2d');
    this.context.font = this.options.font;
    this.context.textAlign = 'center';
    
    this.container.appendChild(this.canvas);
}


unshift.artificate.Art1.prototype = new unshift.artificate.Base();
unshift.artificate.Art1.prototype.constructor = unshift.artificate.Art1;
unshift.artificate.Art1 = function(containerElement, width, height, options) {
    this.container = containerElement;
    this.width = width;
    this.height = width;
    this.canvas = null;
    this.context = null;
    //default options
    /* Magic vars: 
        percent  #progress as percentage
        start    #beginning value
        end      #complete value
        current  #current value
    */     
    this.options = {
        
    };
    this.options.merge(options);
}
unshift.artificate.Art1.prototype.start = function() {
    this.isAnimating = true;
    this.requestAnimationFrame(this.update, this.canvas);
}
unshift.artificate.Art1.prototype.stop = function(andClear) {
    
}
unshift.artificate.Art1.prototype.update = function() {
    if (this.isAnimating) {
        if (this.canvas == null)
            this.createElements();
        
        this.requestAnimationFrame(this.update, this.canvas);
        
        
    }
}