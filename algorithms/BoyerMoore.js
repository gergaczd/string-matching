var SA = SA || {};

(function() {
	"use strict";

	SA.BoyerMooreAlgorithm = function() {
		this.shift = {};
		this.tableL = [];
		this.tableH = [];
	};

	SA.BoyerMooreAlgorithm.prototype = new SA.BaseAlgorithm();
	SA.BoyerMooreAlgorithm.prototype.constructor = SA.BoyerMooreAlgorithm;
	var p = SA.BoyerMooreAlgorithm.prototype;

	p.preprocess = function () {
		this.shift = {};
		this.tableL = [];
		this.tableH = [];
		this._initBadCharacterRule();
		this._initGoodSuffixRule();
	};

	p.run = function() {
		this.compareNumber = 0;
		this.matchings = [];
		this.isMatch = false;
		this.lengthP = this.pattern.length;

		var	lengthS = this.inputString.length,
			k = this.pattern.length,
			index = 1,
			isEnd = false;

		var inpIndex = k - index,
			patIndex = this.lengthP - index;
		while(!isEnd) {
			this.compareNumber++;
			if(this.pattern[patIndex] === this.inputString[inpIndex]) {
				if(index === this.lengthP) {
					this.matchings.push(inpIndex);
					this.isMatch = true;
					
					if(!this.findAll) {
						isEnd = true;
						break;
					}

					k += this._getShift(this.inputString[inpIndex], patIndex, true);
					index = 1;
					if(k >= lengthS) {
						isEnd = true;
					}							
				} else {
					index++;
				}
			} else {
				k += this._getShift(this.inputString[inpIndex], patIndex, false);

				if(k >= lengthS) {
					isEnd = true;
				}
				index = 1;
			}

			inpIndex = k - index;
			patIndex = this.lengthP - index;			
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

	p._initGoodSuffixRule = function() {
		var length = this.pattern.length,
			largestPreSufix = 0;

		for (var i = length-1; i >= 0; i--) {
			var suffix = this.pattern.substring(i,length),
				prefix = this.pattern.substring(0,length-i);

			var lastIndex = length-1,
				hasResult = false,
				result;

			while(!hasResult) {
				var index = this.pattern.lastIndexOf(suffix, lastIndex);

				if(index > 0) {
					if(this.pattern[i-1] === this.pattern[index-1]) {
						lastIndex = index-1;
					} else {
						result = index+suffix.length-1;
						hasResult = true;
					}
				} else {
					result = 0;
					hasResult = true;
				}
			}

			this.tableL[i] = result;

			if(i !== 0 && suffix === prefix) {
				largestPreSufix = suffix.length;
			}

			this.tableH[i] = largestPreSufix;
		}
	};

	p._getShift = function(character, index, isMatch) {
		var goodSuffix,
			badCharacter;

		if(isMatch || this.tableL[index] === 0) {
			goodSuffix = this.lengthP - this.tableH[index];
		} else {
			goodSuffix = this.lengthP - this.tableL[index];
		}
		
		if(this.shift[character] &&
			this.shift[character][index] >= 0) {

			badCharacter = index - this.shift[character][index];
		} else {
			badCharacter = index+1;
		}

		if(badCharacter < goodSuffix) {
			return badCharacter;
		} else {
			return goodSuffix;
		}
	};
}());