var SA = SA || {};

(function() {
	"use strict";

	SA.BoyerMooreAlgorithm = function() {
		this.inputString = "";
		this.pattern = "";
		this.shift = {};
		this.tableL = [];
		this.tableH = [];
		this.isMatch = false;
		this.findAll = true;
	};

	var p = SA.BoyerMooreAlgorithm.prototype;

	p.init = function(text, pattern, isAll) {
		this.inputString = text;
		this.pattern = pattern;
		this.isMatch = false;
		this.findAll = !!isAll;		
		this.preprocess();
	};

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

		var lengthP = this.pattern.length,
			lengthS = this.inputString.length,
			k = this.pattern.length,
			index = 1,
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

					k += this._getShift(this.inputString[k-index], lengthP-index, true);
					index = 1;
					if(k >= lengthS) {
						isEnd = true;
					}							
				} else {
					index++;
				}
			} else {
				k += this._getShift(this.inputString[k-index], lengthP-index, false);

				if(k >= lengthS) {
					isEnd = true;
				}
				index = 1;
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
			badCharacter,
			length = this.pattern.length;

		if(!isMatch) {
			if(this.tableL[index] === 0) {
				goodSuffix = length - this.tableH[index];
			} else {
				goodSuffix = length - this.tableL[index];
			}
		} else {
			goodSuffix = length - this.tableH[index];
		}

		if(this.shift[character] &&
			this.shift[character][index] >= 0) {

			badCharacter = (index - this.shift[character][index]);
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