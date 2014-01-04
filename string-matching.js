var SA = SA || {},
	suite = new Benchmark.Suite("StringPattern", {
		maxTime: 5,
		minSamples: 100,
		minTime: 1
	});

var KMP = new SA.KMPAlgorithm(),
	BM = new SA.BoyerMooreAlgorithm(),
	BMH = new SA.BoyerMooreHorspoolAlgorithm();

var charData = [],
	testIndex = 0,
	mychart,
	compareChart,
	maxValue = 0,
	compareData = [], 
	maxCompare = 0,
	cellIndex = 5;

var addRowToTable = function(id, inp, isall, numOfText, numOfPattern) {
	var row = "<td>" + id + "</td><td>" + inp + "</td><td>" + (isall? "all": "first") + 
		"</td><td>" + numOfText + "</td><td>" + numOfPattern + "</td><td class=\"wait\"></td><td class=\"wait\"></td><td class=\"wait\"></td>";

	var rrow = SA.statisticTable.insertRow(SA.statisticTable.rows.length);
	rrow.innerHTML = row;
};

var showLoader = function() {
	SA.loader.style.display = "block";
},

hideLoader = function () {
	SA.loader.style.display = "none";
}

YUI().use('charts-legend', function(Y) {
	suite.add("KMP#run", function() {
		KMP.run();
	})
	.add("BM#run", function () {
		BM.run();
	})
	.add("BMH#run", function() {
		BMH.run();
	})
	.on("cycle",function() {
		console.log(this);
		if(cellIndex < 5 || cellIndex > 7) {
			cellIndex = 5;
		}

		SA.statisticTable.rows[testIndex+1].cells[cellIndex].className = "done";
		if(cellIndex !== 7) {
			SA.statisticTable.rows[testIndex+1].cells[cellIndex+1].className = "progress";
			cellIndex++;
		} else {
			cellIndex = 5;
		}
	})
	.on("complete", function() {
		console.log(this);
		console.log("Fastest is " + this.filter("fastest").pluck("name"));
		console.log("Comparisons:");
		console.log("KMP number: " + KMP.compareNumber);
		console.log("BM number: " + BM.compareNumber);
		console.log("BMH number: " + BMH.compareNumber);

		console.log("Matchings:");
		console.log(KMP.matchings);
		console.log(BM.matchings);
		console.log(BMH.matchings);

		var newResult = {category: "test#"+testIndex},
			newCompare = {category: "test#"+testIndex};

		testIndex++;

		this.forEach(function(testCase) {
			newResult[testCase.name] = testCase.stats.mean*Math.pow(10,3);
			if(newResult[testCase.name] > maxValue) {
				maxValue = newResult[testCase.name];
			}
		});

		charData.push(newResult);

		mychart && mychart.destroy();
		mychart = new Y.Chart({
            legend: {
                position: "top",
                width: 300,
                height: 50,
                styles: {
                    hAlign: "center",
                    hSpacing: 4
                }
            },
		    dataProvider: charData,
		    render: "#chart",
		    type: "column",
		    axes: {values: {
		    	maximum: maxValue,
		    	title: " ms",
		    	labelFormat: {
		    		decimalPlaces: 3,
		    	}
		    }},
            horizontalGridlines: {
                styles: {
                    line: {
                        color: "#dad8c9"
                    }
                }
            },
            verticalGridlines: {
                styles: {
                    line: {
                        color: "#dad8c9"
                    }
                }
            }		    		    
		});

		newCompare["KMP#compare"] = KMP.compareNumber;
		newCompare["BM#compare"] = BM.compareNumber;
		newCompare["BMH#compare"] = BMH.compareNumber;

		compareData.push(newCompare);
		
		var newMax = Math.max(KMP.compareNumber, BM.compareNumber, BMH.compareNumber);		
		if(newMax > maxCompare) {
			maxCompare = newMax;
		}
		
		compareChart && compareChart.destroy();
		compareChart = new Y.Chart({
            legend: {
                position: "top",
                width: 300,
                height: 50,
                styles: {
                    hAlign: "center",
                    hSpacing: 4
                }
            },			
		    dataProvider: compareData,
		    render: "#chart-compare",
		    type: "column",
		    axes: {values: {
		    	maximum: maxCompare,
		    	labelFormat: {decimalPlaces: 0}
		    }},
            horizontalGridlines: {
                styles: {
                    line: {
                        color: "#dad8c9"
                    }
                }
            },
            verticalGridlines: {
                styles: {
                    line: {
                        color: "#dad8c9"
                    }
                }
            }		    
		});

		SA.NextFile && SA.NextFile();
	});
});

window.onload = function() {
	"use strict";

	var runBtn = document.getElementById("run-btn"),
		patternString = document.getElementById("pattern-text"),
		inputString = document.getElementById("input-string"),
		inputFile = document.getElementById("input-file"),
		runFileBtn = document.getElementById("run-file-btn"),
		allMatch = document.getElementById("all-match"),
		firstMatch = document.getElementById("first-match"),
		findAll = true;

		SA.statisticTable = document.getElementById("statistic-table");
		SA.loader = document.getElementById("loader");

	allMatch.addEventListener("change", function () {
		if(this.checked) {
			findAll = true;
			firstMatch.removeAttribute("checked");
			document.getElementById("all-match-label").className = "active";
			document.getElementById("first-match-label").className = "";
		} else {
			findAll = false;
			document.getElementById("all-match-label").className = "";
			document.getElementById("first-match-label").className = "active";			
		}
	},false);

	firstMatch.addEventListener("change", function () {
		if(this.checked) {
			findAll = false;
			allMatch.removeAttribute("checked");
			document.getElementById("all-match-label").className = "";
			document.getElementById("first-match-label").className = "active";
		} else {
			findAll = true;
			document.getElementById("all-match-label").className = "active";
			document.getElementById("first-match-label").className = "";			
		}		
	}, false);

	runFileBtn.addEventListener("click", function(){
		var files = inputFile.files,
			fileIndex = 0,
			pattern = patternString.value;

		showLoader();
		SA.NextFile = function () {
			var reader = new FileReader();

			reader.onload = function(event) {
				this.onload = null;

				var input = event.target.result;

				console.log("reader started");
				
				BM.init(input, pattern, findAll);
				KMP.init(input, pattern, findAll);
				BMH.init(input,pattern, findAll);
				
				addRowToTable(testIndex, files[fileIndex-1].name, findAll, input.length, pattern.length);
				suite.run({"async": true});			
			};

			if(fileIndex < files.length) {
				reader.readAsText(files[fileIndex]);
				fileIndex++;
			} else {
				reader.onload = null;
				hideLoader();
			}
		};

		SA.NextFile();
	}, false);

	runBtn.addEventListener("click", function() {
		var input = inputString.value,
			pattern = patternString.value;
		
		BM.init(input, pattern, findAll);
		KMP.init(input, pattern, findAll);
		BMH.init(input,pattern, findAll);
		
		addRowToTable(testIndex, "<input text>", findAll, input.length, pattern.length);	
		showLoader();
		suite.run({"async": true});
	}, false);
};