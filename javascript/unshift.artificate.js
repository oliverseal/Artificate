//This file requires crossbrowserificate in order to work properly

if (!window.unshift)
    unshift = {};
if (!window.unshift.artificate)
    unshift.artificate = {};
    
unshift.artificate.Base = function (containerElement, width, height, options) {
    this.container = containerElement;
    this.isAnimating = false;
    this.width = width;
    this.height = height;
    this.canvas = null;
    this.context = null;
    //default options
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
    
    this.container.appendChild(this.canvas);
}

unshift.artificate.RADIAN_FULL = Math.PI*2;
unshift.artificate.RADIAN_HALF = Math.PI*2*180;
unshift.artificate.RADIAN_QUARTER = Math.PI*2*90;

/**** DNA ****
*
*/

unshift.artificate.DnaArt = function(containerElement, width, height, options) {
    this.container = containerElement;
    this.width = width;
    this.height = height;
    this.canvas = null;
    this.context = null;
    this.pairs = [];
    //default options
    this.options = {
        pairCount: 10,
        //so it will by default take 200 frames to spin a basepair
        framesPerRevolution: 600,
        width: this.width,
        verticalMargin: 5,
        ballRadius: 20,
        lineThickness: 16,
        ballColor1: 'rgba(0,0,0,1)',
        ballColor2: 'rgba(0,0,0,1)',
        lineColor: 'rgba(0,0,0,0.5)'
    };
    this.options.merge(options);
    this.updateDelegate = Delegate.create(this, this.update);
    
    this.currentTime = 0;
    
    this.createElements();
    for (var i = 0; i < this.options.pairCount; i++) {
        var height = Math.max(this.options.ballRadius*2, this.options.lineThickness) + this.options.verticalMargin;
        var pair = new unshift.artificate.DnaArt.BasePair(this.context, i*height, this.options);
        this.pairs.push(pair);
    }
}
unshift.artificate.DnaArt.prototype = new unshift.artificate.Base;
unshift.artificate.DnaArt.prototype.constructor = unshift.artificate.DnaArt;
unshift.artificate.DnaArt.prototype.parent = unshift.artificate.Base.prototype;

unshift.artificate.DnaArt.prototype.start = function() {
    this.isAnimating = true;
    if (this.canvas == null)
            this.createElements();
    requestAnimationFrame(this.updateDelegate, this.canvas);
}
unshift.artificate.DnaArt.prototype.stop = function(andClear) {
    this.isAnimating = false;
}
unshift.artificate.DnaArt.prototype.update = function() {
    if (this.isAnimating) {
        if (this.canvas == null)
            this.createElements();
        
        requestAnimationFrame(this.updateDelegate, this.canvas);
        this.context.clearRect(0, 0, this.width, this.height);

        if (this.currentTime < this.options.framesPerRevolution)
            this.currentTime++;
        else
            this.currentTime = 0;
            
        for(var i = this.pairs.length-1; i >= 0; i--){
            this.pairs[i].draw(this.currentTime + i * 30, this.options.framesPerRevolution);
        }
    }
}

unshift.artificate.DnaArt.BasePair = function(context, y, options) {
    this.context = context;
    this.y = y;
    this.options = {
        width: 200,
        verticalMargin: 5,
        ballRadius: 20,
        lineThickness: 16,
        ballColor1: 'rgba(0,0,0,0.8)',
        ballColor2: 'rgba(0,0,0,0.8)',
        lineColor: 'rgba(0,0,0,0.5)'
    };
    this.options.merge(options);
    this.height = Math.max(this.options.ballRadius*2, this.options.lineThickness);
}
unshift.artificate.DnaArt.BasePair.prototype.draw = function(currentTime, totalTime) {
    var halfWidth = this.options.width/2;
    //draw the first ball
    var x1 = (halfWidth - this.options.ballRadius) * Math.sin(2*Math.PI*currentTime/totalTime) + halfWidth;
    this.context.fillStyle = this.options.ballColor1;
    this.context.beginPath();
    this.context.arc(x1, this.y + this.options.ballRadius, this.options.ballRadius, 0, unshift.artificate.RADIAN_FULL);
    this.context.closePath();
    this.context.fill();
    
    //draw the second ball
    var x2 = -(halfWidth - this.options.ballRadius) * Math.sin(2*Math.PI*currentTime/totalTime) + halfWidth;
    this.context.fillStyle = this.options.ballColor2;
    this.context.beginPath();
    this.context.arc(x2, this.y + this.options.ballRadius, this.options.ballRadius, 0, unshift.artificate.RADIAN_FULL);
    this.context.closePath();
    this.context.fill();
    
    //draw the line
    this.context.fillStyle = this.options.lineColor;
    this.context.beginPath();
    
    var indention = (x1 < halfWidth)?this.options.ballRadius:-this.options.ballRadius;
    var lineX1 = (x1 < halfWidth)? x1 + this.options.ballRadius : x1 - this.options.ballRadius;
    var lineX2 = (x2 < halfWidth)? x2 + this.options.ballRadius : x2 - this.options.ballRadius;
    if ((lineX1 + (this.options.ballRadius) > x1 && lineX1 + (this.options.ballRadius*1.5) > x2)
        ||
        (lineX2 + (this.options.ballRadius) > x2 && lineX2 + (this.options.ballRadius*1.5) > x1)
       ) {
        this.context.fillStyle = "rgba(0,0,0,0)";
    }
    var yTop = this.y + (this.height / 2) - (this.options.lineThickness);
    var yBottom = this.y + (this.height / 2) + (this.options.lineThickness);
    var vCenter = this.y + (this.height / 2);
    
    this.context.moveTo(lineX1, yTop);
    this.context.arcTo(lineX1 + indention, vCenter, lineX1, yBottom, this.options.ballRadius);
    this.context.lineTo(lineX2, yBottom);
    this.context.arcTo(lineX2 - indention, vCenter, lineX2, yTop, this.options.ballRadius);
    this.context.lineTo(lineX1, yTop);
    this.context.closePath();
    this.context.fill();
    
}


/**** HoneyComb ****
*
*/

unshift.artificate.HoneyComb = function(containerElement, width, height, options) {
    this.container = containerElement;
    this.width = width;
    this.height = height;
    this.canvas = null;
    this.context = null;
    //default options
    this.options = {
        pairCount: 10,
        //so it will by default take 200 frames to spin a basepair
        framesPerRevolution: 600,
        width: this.width,
        verticalMargin: 5,
        lineThickness: 16
    };
    this.options.merge(options);
    this.updateDelegate = Delegate.create(this, this.update);
}
unshift.artificate.HoneyComb.prototype = new unshift.artificate.Base;
unshift.artificate.HoneyComb.prototype.constructor = unshift.artificate.DnaArt;
unshift.artificate.HoneyComb.prototype.parent = unshift.artificate.Base.prototype;
unshift.artificate.HoneyComb.prototype.start = function() {
    this.isAnimating = true;
    if (this.canvas == null)
        this.createElements();
    requestAnimationFrame(this.updateDelegate, this.canvas);
}
unshift.artificate.HoneyComb.prototype.stop = function(andClear) {
    this.isAnimating = false;
}

unshift.artificate.HoneyComb.prototype.update = function() {
    if (this.isAnimating) {
        if (this.canvas == null)
            this.createElements();
        
        requestAnimationFrame(this.updateDelegate, this.canvas);
        this.context.clearRect(0, 0, this.width, this.height);
        
        if (this.currentTime < this.options.framesPerRevolution)
            this.currentTime++;
        else
            this.currentTime = 0;
            
    }
}

/**** ChainsawFlower ****
*
*/

unshift.artificate.ChainsawFlower = function(containerElement, width, height, options) {
    this.container = containerElement;
    this.width = width;
    this.height = height;
    this.canvas = null;
    this.context = null;
    this.petals = [];
    //default options
    this.options = {
        petalCount: 2,
        //so it will by default take 200 frames to spin a basepair
        framesPerRevolution: 6000,
        width: this.width,
        bladeMinWidth: 20,
        bladeMaxWidth: 50,
        centerX: this.width/2,
        centerY: this.height/2,
        petalLength: 150,
        petalColor: 'rgba(0,0,0,0.8)',
        bladeColor: 'rgba(0,0,0,0.8)',
        lineColor: 'rgba(100,0,0,0.5)'
    };
    this.options.merge(options);
    this.updateDelegate = Delegate.create(this, this.update);
    this.createElements();
    
    for(var i = this.options.petalCount; i >= 0; i--) {
        var petal = new unshift.artificate.ChainsawFlower.Petal(this.context, this.options);
        this.petals.push(petal);
    }
}
unshift.artificate.ChainsawFlower.prototype = new unshift.artificate.Base;
unshift.artificate.ChainsawFlower.prototype.constructor = unshift.artificate.ChainsawFlower;
unshift.artificate.ChainsawFlower.prototype.parent = unshift.artificate.Base.prototype;
unshift.artificate.ChainsawFlower.prototype.start = function() {
    this.isAnimating = true;
    if (this.canvas == null)
        this.createElements();
    requestAnimationFrame(this.updateDelegate, this.canvas);
}
unshift.artificate.ChainsawFlower.prototype.stop = function(andClear) {
    this.isAnimating = false;
}

unshift.artificate.ChainsawFlower.prototype.update = function() {
    if (this.isAnimating) {
        if (this.canvas == null)
            this.createElements();
        
        requestAnimationFrame(this.updateDelegate, this.canvas);
        this.context.clearRect(0, 0, this.width, this.height);
        
        if (this.currentTime < this.options.framesPerRevolution)
            this.currentTime++;
        else
            this.currentTime = 0;
            
        for(var i = this.options.petalCount; i >= 0; i--) {
            this.petals[i].draw(this.currentTime, this.options.framesPerRevolution);
        }
    }
}

unshift.artificate.ChainsawFlower.Petal = function(context, options) {
    this.context = context;
    this.options = {
        width: 200,
        bladeMinWidth: 20,
        bladeMaxWidth: 50,
        petalLength: 170,
        centerX: 200,
        centerY: 200,
        petalColor: 'rgba(0,0,0,0.8)',
        bladeColor: 'rgba(0,0,0,0.8)',
        lineColor: 'rgba(0,0,0,0.5)'
    };
    this.options.merge(options);
}
unshift.artificate.ChainsawFlower.Petal.prototype.draw = function(currentTime, totalTime) {
    var halfWidth = this.options.width/2;
    
    this.context.strokeStyle = this.options.lineColor;
    this.context.beginPath();
    this.context.arc(this.options.centerX, this.options.centerY, this.options.petalLength, 0, unshift.artificate.RADIAN_FULL);
    this.context.closePath();
    this.context.stroke();
    this.context.strokeStyle = null;
    
    var angle = currentTime/totalTime*this.options.petalLength;
    var baseLength = this.options.petalLength - this.options.petalLength / ;
    var arc1Point = {x:this.options.centerX + baseLength*Math.cos(angle-.50), y:this.options.centerY + baseLength*Math.sin(angle-.50)};
    var arc2Point = {x:this.options.centerX + this.options.petalLength*Math.cos(angle), y:this.options.centerY + this.options.petalLength*Math.sin(angle)};
    var arc3Point = {x:this.options.centerX + baseLength*Math.cos(angle+.50), y:this.options.centerY + baseLength*Math.sin(angle+.50)};
    
    this.context.fillStyle = this.options.petalColor;
    this.context.beginPath();
    this.context.moveTo(this.options.centerX, this.options.centerY);
    this.context.lineTo(arc1Point.x, arc1Point.y);
    this.context.arcTo(arc2Point.x, arc2Point.y, arc3Point.x, arc3Point.y, this.options.petalLength/8);
    this.context.lineTo(arc3Point.x, arc3Point.y);
    this.context.lineTo(this.options.centerX, this.options.centerY);
    this.context.closePath();
    this.context.fill();
}

