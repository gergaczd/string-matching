var SA = SA || {};

(function() {
	"use strict";

	SA.BoyerMooreHorspoolAlgorithm = function() {
		this.shift = {};
	};

	SA.BoyerMooreHorspoolAlgorithm.prototype = new SA.BaseAlgorithm();
	SA.BoyerMooreHorspoolAlgorithm.prototype.constructor = SA.BoyerMooreHorspoolAlgorithm;

	var p = SA.BoyerMooreHorspoolAlgorithm.prototype;

	p.preprocess = function () {
		this.shift = {};
		this._initBadCharacterRule();
	};

	p.run = function() {
		this.compareNumber = 0;
		this.matchings = [];
		this.isMatch = false;

		var lengthP = this.pattern.length,
			lengthS = this.inputString.length,
			k = this.pattern.length,
			index = 1,
			isEnd = false;

		var inpIndex = k - index,
			patIndex = lengthP - index;
		while(!isEnd) {
			this.compareNumber++;
			if(this.pattern[patIndex] === this.inputString[inpIndex]) {
				if(index === lengthP) {
					this.matchings.push(inpIndex);
					this.isMatch = true;
					
					if(!this.findAll) {
						isEnd = true;
						break;
					}

					index = 1;
					k += patIndex+1;
					if(k >= lengthS) {
						isEnd = true;
					}							
				} else {
					index++;
				}
			} else {
				if(this.shift[this.inputString[inpIndex]] &&
					this.shift[this.inputString[inpIndex]][patIndex] >= 0) {

					k += patIndex - this.shift[this.inputString[inpIndex]][patIndex];
				} else {
					//TODO: shift all
					k += patIndex+1;
				}
				if(k >= lengthS) {
					isEnd = true;
				}
				index = 1;
			}

			inpIndex = k - index;
			patIndex = lengthP - index;
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