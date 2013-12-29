var SA = SA || {},
	suite = new Benchmark.Suite();

(function() {
	"use strict";

	SA.BoyerMooreAlgorithm = function() {
		this.inputString = "";
		this.pattern = "";
		this.shift = {};
		this.isMatch = false;
	};

	var p = SA.BoyerMooreAlgorithm.prototype;

	p.init = function(text, pattern) {
		this.inputString = text;
		this.pattern = pattern;
		this.isMatch = false;
		this.preprocess();
	};

	p.preprocess = function () {
		this.shift = {};
		this._initBadCharacterRule();
	};

	p.run = function() {
		var lengthP = this.pattern.length-1,
			lengthS = this.inputString.length,
			k = this.pattern.length-1,
			index = 0,
			isEnd = false;

		while(!isEnd) {
			if(this.pattern[lengthP-index] === this.inputString[k-index]) {
				if(index === lengthP) {
					this.isMatch = true;
				}

				index++;
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

(function() {
	"use strict";

	SA.KMPAlgorithm = function() {
		this.inputString = undefined;
		this.pattern = undefined;
		this.nextArray = [];
		this.isMatch = false;
	};

	var p = SA.KMPAlgorithm.prototype;

	p.init = function(text, pattern) {
		this.inputString = text;
		this.pattern = pattern;
		this.isMatch = false;
		this.preprocess();
	};

	p.preprocess = function () {
		this.nextArray = [];		
		this._initNext();	
	};

	p.run = function() {
		var i = -1,
			j = -1,
			inpLength = this.inputString.length,
			patternLength = this.pattern.length;

		while(i < inpLength-1 /*&& j < patternLength-1*/) {
			if(j === patternLength-1) {
				this.isMatch = true;
				j = -1;
			}
			if(this.inputString[i+1] === this.pattern[j+1]) {
				i++;
				j++;
			} else {
				if(j === -1) {
					i++;
				} else {
					j = this.nextArray[j];
				}
			}
		}

		if(j === patternLength-1) {
			this.isMatch = true;
		}
	};

	p._initNext = function() {
		var i = 0,
			j = -1,
			length = this.pattern.length-2;

		this.nextArray[0] = 0;

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

	p.time = function () {
		if(this.startTime !== undefined && this.endTime !== undefined) {
			return (this.endTime - this.startTime);
		} else {
			return false;
		}
	};
}());

(function(){
	"use strict";

	SA.QuickSearch = function() {
		this.inputString = undefined;
		this.pattern = undefined;
		this.shift = {};

		this.startTime = undefined;
		this.endTime = undefined;
	};

	var p = SA.QuickSearch.prototype;

	p.init = function(text, pattern) {
		this.inputString = "#" + text;
		this.pattern = "#" + pattern;
		this.preprocess();
	};

	p.preprocess = function() {
		this.shift = {};
		this._initBadCharacterRule();
	};

	p.run = function() {
		this.startTime = (new Date()).getTime();
		var n = this.inputString.length-1,
			m = this.pattern.length-1,
			k = 0, //??
			j = 1;

		while(k <= n-m && j <= m) {
			if(this.inputString[k+j] === this.pattern[j]) {
				j++;
			} else {
				if(k === n-m) {
					k++;
				} else {
					k += this.shift[this.inputString[k+m+1]];
				}
			}
		}
		this.endTime = (new Date()).getTime();

		if(k <= n-m) {
			console.log("GOTCHA QS");
		} else {
			console.log("FAILED QS");
		}
	};

	p._initBadCharacterRule = function() {
		var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,-:?!".split(""),
			length = this.pattern.length;

		for (var i = 0; i < alphabet.length; i++) {
			this.shift[alphabet[i]] = length;
		}

		for (var j = 1; j < length; j++) {
			this.shift[this.pattern[j]] = length-j+1;//??
		}
	};

	p.time = function () {
		if(this.startTime !== undefined && this.endTime !== undefined) {
			return (this.endTime - this.startTime);
		} else {
			return false;
		}
	};	
}());

var KMP = new SA.KMPAlgorithm(),
	BM = new SA.BoyerMooreAlgorithm(),
	QS = new SA.QuickSearch();

window.onload = function() {
	"use strict";

	var runBtn = document.getElementById("run-btn"),
		patternString = document.getElementById("pattern-text"),
		inputString = document.getElementById("input-string");

	runBtn.addEventListener("click", function() {
		var input = inputString.value,
			pattern = patternString.value;
		
		/*
		QS.init(input, pattern);
		QS.run();*/
		
		/*suite.add("KMP#run", function() {
		})
		.add("QS#run", function () {
		})
		.on("complete", function() {
			console.log(this);
			console.log("Fastest is " + this.filter("fastest").pluck("name"));
		})
		.run({"async": true});*/

		BM.init(input, pattern);
		console.log("itt0")
		BM.run();
		console.log("itt")
		KMP.init(input, pattern);
		console.log("itt2")
		KMP.run();
		console.log("itt3")

		console.log(BM.isMatch);
		console.log(KMP.isMatch);

		console.log("END");
	}, false);
};