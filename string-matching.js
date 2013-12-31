var SA = SA || {},
	suite = new Benchmark.Suite("StringPattern", {
		maxTime: 5,
		minSamples: 100,
		minTime: 1
	});

(function() {
	"use strict";

	SA.BoyerMooreAlgorithm = function() {
		this.inputString = "";
		this.pattern = "";
		this.shift = {};
		this.tableL = [];
		this.tableH = [];
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
		this.tableL = [];
		this.tableH = [];
		this._initBadCharacterRule();
		this._initGoodSuffixRule();
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

	p._initGoodSuffixRule = function() {
		
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
			if(j >= patternLength-1) {
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

	p.time = function () {
		if(this.startTime !== undefined && this.endTime !== undefined) {
			return (this.endTime - this.startTime);
		} else {
			return false;
		}
	};
}());

(function() {
	"use strict";

	SA.BoyerMooreHorspoolAlgorithm = function() {
		this.inputString = "";
		this.pattern = "";
		this.shift = {};
		this.isMatch = false;
	};

	var p = SA.BoyerMooreHorspoolAlgorithm.prototype;

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

(function(){
	"use strict";

	SA.BruteForce = function() {
		this.inputString = "";
		this.pattern = "";
		this.isMatch = false;
	};

	var p = SA.BruteForce.prototype;

	p.init = function(text, pattern) {
		this.inputString = text;
		this.pattern = pattern;
		this.isMatch = false;
	};

	p.run = function() {
		var lengthP = this.pattern.length,
			lengthS = this.inputString.length - this.pattern.length,
			k = 0,
			i = 0;

		while(k <= lengthS) {
			while(this.pattern[i] === this.inputString[k+i]) {
				i++;
			}

			if(i === lengthP) {
				this.isMatch = true;
				k += lengthP;
			} else {
				k++;
			}
			i = 0;
		}		
	};	
}());

var KMP = new SA.KMPAlgorithm(),
	BM = new SA.BoyerMooreAlgorithm(),
	BMH = new SA.BoyerMooreHorspoolAlgorithm(),
	BF = new SA.BruteForce();

var charData = [],
	testIndex = 0,
	mychart,
	maxValue = 0;

var chartYUI;
YUI().use('charts-legend', function(Y) {
	chartYUI = Y;
	suite.add("KMP#run", function() {
		KMP.run();
	})
	.add("BM#run", function () {
		BM.run();
	})
	/*.add("BF#run", function() {
		BF.run();
	})*/
	.add("BMH#run", function() {
		BMH.run();
	})
	.on("complete", function() {
		console.log(this);
		console.log("Fastest is " + this.filter("fastest").pluck("name"));

		var newResult = {category: "testCase#"+testIndex};
		testIndex++;

		this.forEach(function(testCase) {
			newResult[testCase.name] = testCase.stats.mean;
			if(testCase.stats.mean > maxValue) {
				maxValue = testCase.stats.mean;
			}
		});

		charData.push(newResult);

		mychart && mychart.destroy();
		mychart = new Y.Chart({
            legend: {
                position: "right",
                width: 300,
                height: 300,
                styles: {
                    hAlign: "center",
                    hSpacing: 4
                }
            },			
		    dataProvider: charData,
		    render: "#chart",
		    type: "column",
		    axes: {values: {maximum: maxValue}}
		});
	});
});
window.onload = function() {
	"use strict";

	var runBtn = document.getElementById("run-btn"),
		patternString = document.getElementById("pattern-text"),
		inputString = document.getElementById("input-string");

	runBtn.addEventListener("click", function() {
		var input = inputString.value,
			pattern = patternString.value;
		
		BM.init(input, pattern);
		KMP.init(input, pattern);
		BF.init(input,pattern);
		BMH.init(input,pattern);
		
		suite.run({"async": true});


		/*console.log(KMP.isMatch);
		console.log(BM.isMatch);*/

	}, false);
};