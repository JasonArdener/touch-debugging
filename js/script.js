/* Author: Jason Ardener */

/*
	Swipe Event Handler
*/

function Swipe(id) {

	// Constants
	this.HORIZONTAL 	= 	1; // Do not change.
	this.VERTICAL 		= 	2; // Do not change.
	this.RATIO			=	3;
	this.GESTURE_DELTA 	= 	60; // The min delta in the axis to fire the gesture
	
	// Variables for position of touch
	this.ldx = 9999;
	this.hdx = 0;
	this.ldy = 9999;
	this.hdy = 0;
	
	// Public members
	this.direction 		= 	this.VERTICAL;
	this.element 		= 	document.getElementById(id);
	this.onswiperight 	= 	null;
	this.onswipeleft 	= 	null;
	this.onswipeup 		= 	null;
	this.onswipedown 	= 	null;
	this.inGesture 		= 	true;
	
	// Private members
	this._fingers		=	0;
	this._originalX 	= 	0;
	this._originalY 	= 	0;
	this._lastX 	= 	0;
	this._lastY 	= 	0;
	
	var _this = this;
	// Makes the element clickable on iPhone
	this.element.onclick = 	function() {void(0)};
	
	var mousedown = function(event) {
		// Finger Press
		event.preventDefault();
		_this.inGesture = true;
		_this._originalX = (event.touches) ? event.touches[0].pageX : event.pageX;
		_this._originalY = (event.touches) ? event.touches[0].pageY : event.pageY;
		
		// Only for iPhone
		// if (event.touches && event.touches.length!=1) {
			//_this.inGesture = false; // Cancel gesture on multiple touch
		// }
		
		$('#debug').append('<li><b>Mouse down</b>: Original X = ' + _this._originalX + ' and Original Y = ' + _this._originalY + '</li>');
	};
	
	var mousemove = function(event) {
		
		// Finger moving
		event.preventDefault();
		
		// Get coordinates using iPhone or standard technique
		var currentX = (event.touches) ? event.touches[0].pageX : event.pageX;
		var currentY = (event.touches) ? event.touches[0].pageY : event.pageY;

		_this._fingers = event.touches.length;
		
		// Check if the user is still in line with the axis
		if (_this.inGesture) {
			_this.ldx = Math.min(currentX, _this.ldx);
			_this.hdx = Math.max(currentX, _this.hdx);
			
			_this.ldy = Math.min(currentY, _this.ldy);
			_this.hdy = Math.max(currentY, _this.hdy);
			$('#debug').append('<li><b>BLAHH</b>: Current ldy = ' + _this.ldy + ' and Current hdy = ' + _this.hdy + '</li>');
			_this._lastX = currentX;
			_this._lastY = currentY;
		}
		$('#debug').append('<li><b>Mouse move</b>: Current X = ' + currentX + ' and Current Y = ' + currentY + '</li>');
	};
	
	var mouseend = function(event) {
		
		event.preventDefault();
		
		var dx = Math.abs(_this.hdx - _this.ldx);
		var dy = Math.abs(_this.hdy - _this.ldy);
		
		$('#debug').append('<li><b>HELP</b>: dx = ' + dx + ' and dy = ' + dy + '</li>');
		$('#debug').append('<li><b>HELP</b>: dx/dy = ' + dx/dy + '</li>');
		
		if ((dx/dy)>3) {
			_this.direction = _this.HORIZONTAL;
		} else {
			_this.direction = _this.VERTICAL;
		}
		$('#debug').append('<li><b>THE DIRECTION</b>:' + _this.direction + '</li>');
		$('#debug').append('<li><b>Mouse move</b>: Last X = ' + _this._lastX + ' and Last Y = ' + _this._lastY + '</li>');
		// Check if we can consider it a swipe
		if (_this.inGesture) {
			if (_this.direction==_this.HORIZONTAL) {
				delta = Math.abs(_this._lastX - _this._originalX);
				if (_this._lastX > _this._originalX) {
					direction = 0;
				} else {
					direction = 1;
				}
			} else {
				delta = Math.abs(_this._lastY - _this._originalY);
				if (_this._lastY > _this._originalY) {
					direction = 2;
				} else {
					direction = 3;
				}
			}
			
			//alert(_this._originalX);
			//alert(_this._lastX);
			
			if (delta >= _this.GESTURE_DELTA) {
				// Gesture detected!
				var handler = null;
				
				switch(_this._fingers) {
					case 1: 
						switch(direction) {
							case 0: handler = _this.onswiperight; break;
							case 1: handler = _this.onswipeleft; break;
							case 2: handler = _this.onswipedown; break;
							case 3: handler = _this.onswipeup; break;
						} break;
					case 2: 
						switch(direction) {
							case 0: handler = _this.ontwoswiperight; break;
							case 1: handler = _this.ontwoswipeleft; break;
							case 2: handler = _this.ontwoswipedown; break;
							case 3: handler = _this.ontwoswipeup; break;
						} break;
					default: break;
				}
				
				if (handler!=null) {
					// Call to the callback with the optional delta
					handler(delta);
				}
			}
		}
		
		_this.ldx = 9999;
		_this.hdx = 0;
		_this.ldy = 9999;
		_this.hdy = 0;
		// _this._lastX = 0;
		// _this._lastY = 0;
		// _this._originalX = 0;
		
		//$('#debug').append('<li><b>Mouse end</b>: Original X = ' + _this._originalX + ' and Original Y = ' + _this._originalY + '</li>');
		
	};
	
	// iPhone and Android's events
	this.element.addEventListener('touchstart', mousedown, false);
	this.element.addEventListener('touchmove', mousemove, false);
	this.element.addEventListener('touchend', mouseend, false);
	this.element.addEventListener('touchcancel', function() {
		//_this.inGesture = false;
	}, false);

}