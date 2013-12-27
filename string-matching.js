var SA = SA || {};

(function() {
	"use strict";

	SA.BoyerMooreAlgorithm = function() {
		this.inputString = undefined;
		this.pattern = undefined;
	};

	var p = SA.BoyerMooreAlgorithm.prototype;

	p.init = function(text, pattern) {
		this.inputString = text;
		this.pattern = pattern;
	};

	p.run = function() {

	};

}());

(function() {
	"use strict";

	SA.KMPAlgorithm = function() {
		this.inputString = undefined;
		this.pattern = undefined;
		this.nextArray = [];
	};

	var p = SA.KMPAlgorithm.prototype;

	p.init = function(text, pattern) {
		this.inputString = text;
		this.pattern = pattern;
	};

	p.run = function() {
		this._initNext();
		
		var i = -1,
			j = -1,
			inpLength = this.inputString.length,
			patternLength = this.pattern.length;

		while(i < inpLength-1 && j < patternLength-1) {
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
			console.log("GOTCHA");
		} else {
			console.log("FAILED");
		}
	};

	p._initNext = function() {
		var i = 0,
			j = -1,
			length = this.pattern.length-2;

		this.nextArray = [];
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
					j = nextArray[j];
				}
			}
		}
	};
}());

(function(){
	"use strict";

	SA.QuickSearch = function() {
		this.inputString = undefined;
		this.pattern = undefined;
	};

	var p = SA.QuickSearch.prototype;

	p.init = function(text, pattern) {
		this.inputString = text;
		this.pattern = pattern;
	};

	p.run = function() {

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
		KMP.init(input, pattern);
		KMP.run();

		BM.init(input, pattern);
		BM.run();

		QS.init(input, pattern);
		QS.run();
	}, false);
}