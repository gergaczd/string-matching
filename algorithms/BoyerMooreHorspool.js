var SA = SA || {};

(function() {
	"use strict";

	SA.BoyerMooreHorspoolAlgorithm = function() {
		this.inputString = "";
		this.pattern = "";
		this.shift = {};
		this.isMatch = false;
		this.findAll = true;
	};

	var p = SA.BoyerMooreHorspoolAlgorithm.prototype;

	p.init = function(text, pattern, isAll) {
		this.inputString = text;
		this.pattern = pattern;
		this.isMatch = false;
		this.findAll = !!isAll;
		this.preprocess();
	};

	p.preprocess = function () {
		this.shift = {};
		this._initBadCharacterRule();
	};

	p.run = function() {
		this.compareNumber = 0;
		this.matchings = [];
		var lengthP = this.pattern.length-1,
			lengthS = this.inputString.length,
			k = this.pattern.length-1,
			index = 0,
			isEnd = false;

		while(!isEnd) {
			this.compareNumber++;
			if(this.pattern[lengthP-index] === this.inputString[k-index]) {
				if(index === lengthP) {
					this.matchings.push(k-index);
					this.isMatch = true;
					
					if(!this.findAll) {
						isEnd = true;
						break;
					}

					index = 0;
					k += lengthP-index+1;
					if(k >= lengthS) {
						isEnd = true;
					}							
				} else {
					index++;
				}
			} else {
				if(this.shift[this.inputString[k-index]] &&
					this.shift[this.inputString[k-index]][lengthP-index] >= 0) {

					k += ((lengthP-index) - this.shift[this.inputString[k-index]][lengthP-index]);
				} else {
					//TODO: shift all
					k += lengthP-index+1;
				}
				if(k >= lengthS) {
					isEnd = true;
				}
				index = 0;
			}
		}
	};

	p._initBadCharacterRule = function() {
		var length = this.pattern.length,
			isLess, j, i, _char;

		for (j = length-1; j >= 0; j--) {
			_char  = this.pattern[j];
			if(this.shift[_char] === undefined) {
				this.shift[_char] = [];
				for(i = 0; i < length; i++) {
					if(i <= j) {
						this.shift[_char][i] = -1;
					} else {
						this.shift[_char][i] = j;
					}
				}
			} else {
				i = j+1;
				isLess = false;
				while(i < length && !isLess) {
					if(j > this.shift[_char][i]) {
						this.shift[_char][i] = j;
						i++;
					} else {
						isLess = true;
					}
				}
			}
		}
	};
}());