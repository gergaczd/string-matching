var SA = SA || {};

(function() {
	"use strict";

	SA.BaseAlgorithm = function() {
		this.inputString = "";
		this.pattern = "";
		this.isMatch = false;
		this.findAll = true;
	};

	var p = SA.BaseAlgorithm.prototype;

	p.init = function(text, pattern, isAll) {
		this.inputString = text;
		this.pattern = pattern;
		this.isMatch = false;
		this.findAll = !!isAll;		
		this.preprocess();
	};

	p.preprocess = function () {
		throw {
			name: "AbstractMethodException",
			message: "This method must be redefined"
		};	
	};

	p.run = function() {
		throw {
			name: "AbstractMethodException",
			message: "This method must be redefined"
		};
	};
}());
