var SA = SA || {};

(function() {
	"use strict";

	SA.KMPAlgorithm = function() {
		this.nextArray = [];
	};

	SA.KMPAlgorithm.prototype = new SA.BaseAlgorithm();
	SA.KMPAlgorithm.prototype.constructor = SA.KMPAlgorithm;
	var p = SA.KMPAlgorithm.prototype;

	p.preprocess = function () {
		this.nextArray = [];		
		this._initNext();	
	};

	p.run = function() {
		this.compareNumber = 0;
		this.matchings = [];
		this.isMatch = false;

		var i = 0,
			j = 0,
			isEnd = false,
			inpLength = this.inputString.length,
			patternLength = this.pattern.length;

		while(!isEnd) {
			if(j >= patternLength) {
				this.matchings.push(i-patternLength);
				this.isMatch = true;
				if(!this.findAll) {
					isEnd = true;
					break;
				}				
				j = 0;
			}
			this.compareNumber++;
			if(this.inputString[i] === this.pattern[j]) {
				i++;
				j++;
			} else {
				if(j === 0) {
					i++;
				} else {
					j = this.nextArray[j-1]+1;
				}
			}

			if(i >= inpLength) {
				isEnd = true;
			}
		}
	};

	p._initNext = function() {
		var i = 0,
			j = -1,
			length = this.pattern.length-2;

		this.nextArray[0] = -1;

		while(i < length) {
			if(this.pattern[i+1] === this.pattern[j+1]) {
				i++;
				j++;
				this.nextArray[i] = j;
			} else {
				if(j === -1) {
					i++;
					this.nextArray[i] = -1;
				} else {
					j = this.nextArray[j];
				}
			}
		}
	};
}());
