var les = {
	// Store lesson information
	currLesson : 'lesson0',
	lessonText : '',
	objComplete : false,
	objectives : {},
	flags : {},
	hintUnlocked : false,
	progress: {},

	// Invalidate code with errors
	invalidated : false,
	invalidate : function() {
		les.invalidated = true;
	},

	// References to the next lesson
	lessonList : {
		'lesson0' : {
			action : function() {
				// Make manual controls
				$("#buttons").fadeIn();
				$("#buttons").append(ui.makeButton('new', function() {
					eg.newGame();
					eg.bet();
				}));
				$("#buttons").append(ui.makeButton('hit', eg.hit));
				$("#buttons").append(ui.makeButton('stand', eg.stand));
				// $("#buttons").append(ui.makeButton('Double', eg.doubleDown));
				$("#previousButton").hide();
				if (!les.progress[les.currLesson] ||  "completed" !== les.progress[les.currLesson]) {
					$("#instructions").css({
						height : '340px'
					});
				}
				$("#betbox")
						.html(
								'Bet:<input type="text" id="bet" maxlength="6" value="10" />');
				$("#bet").css({
					width : '3em'
				});

				$("#codebox").attr('disabled', 'disabled');
				$("#eval").attr('disabled', 'disabled');
				cb.add('end', les.checkObjectives);
				ui.minIns();
			},
			objectives : [ {
				text : "Play a round of Blackjack",
				check : function() {
					return true;
				},
			} ],
			prev : '',
			next : 'lesson1',
		},
		'lesson1' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				/*
				 * $("#buttons").fadeOut().queue(function() { $(this).html('');
				 * });
				 */
				cb.add('exec', les.checkObjectives);
			},
			objectives : [ {
				text : "Set your name",
				check : function() {
					if (typeof name == "string" && name.length > 0) {
						return true;
					}
					return false;
				},
			} ],
			noBet : true,
			prev : 'lesson0',
			next : 'lesson2',
		},
		'lesson2' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('hit', function() {
					les.lessonList.lesson2.complete = true;
				});
				cb.add('exec', les.checkObjectives);
			},
			complete : false,
			objectives : [ {
				text : "Hit every turn",
				check : function() {
					if (les.lessonList.lesson2.complete) {
						les.lessonList.lesson2.complete = false;
						return true;
					}
					return false;
				},
			} ],
			noBet : true,
			prev : 'lesson1',
			next : 'lesson3.1',
		},
		'lesson3.1' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('exec', les.checkObjectives);
			},
			objectives : [ {
				text : "Learn structure of if-else statement",
				check : function() {
					var code = ui.getUserCode();
					return code
							.match(/if\s*\(\s*true\s*\)\s*\{\s*hit\(\);\s*\}\s*else\s*\{\s*stand\(\);\s*\}/);

				},
			} ],
			noBet : true,
			prev : 'lesson2',
			next : 'lesson3.2',
		},
		'lesson3.2' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('exec', les.checkObjectives);
			},
			objectives : [
					{
						text : "Evaluate an if statement with a numerical boolean expression",
						check : function() {
							var code = ui.getUserCode();
							return (code
									.match(/\d+\s*(===|==|>=|<=|>|<)\s*\d+/)
									&& code.indexOf('if') != -1 && code
									.indexOf('else') != -1);
						},
					},
					{
						text : "Evaluate an if statement with a boolean expression using variables",
						check : function() {
							var code = ui.getUserCode();
							return ((code.match(/name\s*===?\s*("|')/) || code
									.match(/("|')\s*===?\s*name/))
									&& code.indexOf('if') != -1 && code
									.indexOf('else') != -1);
						},
					} ],
			noBet : true,
			prev : 'lesson3.1',
			next : 'lesson3.3',
		},
		'lesson3.3' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('exec', les.checkObjectives);
			},
			objectives : [ {
				text : "Implement a boolean expression that evaluates your cards",
				check : function() {
					var code = ui.getUserCode();
					return (code.indexOf('secondDealtCardVal') != -1
							&& (code.indexOf('<') != -1 || code.indexOf('>') != -1)
							&& code.indexOf('if') != -1 && code.indexOf('else') != -1);
				},
			} ],
			noBet : true,
			prev : 'lesson3.2',
			next : 'lesson4.1',
		},
		'lesson4.1' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('error', function(E) {
					var code = ui.getUserCode();
					if (code.indexOf("totalValue") != -1
							&& (code.match(/totalValue\(\)\s*<=?\s*\d/) || code
									.match(/\d\s*>=?\s*totalValue\(\)/))
							&& code.indexOf('if') != -1
							&& code.indexOf('else') != -1) {
						les.checkObjectives();
					}
				});
				cb.add('exec', function() {
					var code = ui.getUserCode();
					if (code.indexOf("totalValue") != -1
							&& (code.match(/totalValue\(\)\s*<=?\s*\d/) || code
									.match(/\d\s*>=?\s*totalValue\(\)/))
							&& code.indexOf('if') != -1
							&& code.indexOf('else') != -1) {
						les.checkObjectives();
					}
				});
			},
			objectives : [ {
				text : "Create a better boolean expression",
				check : function() {
					return true;
				},
			} ],
			noBet : true,
			prev : 'lesson3.3',
			next : 'lesson4.2',
		},
		'lesson4.2' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('exec', les.checkObjectives);
			},
			objectives : [
					{
						text : "Write a function that returns a value",
						check : function() {
							var code = ui.getUserCode();
							var funcName = code
									.match(/function ([a-zA-Z0-9_]+)\(\)/);
							if (!funcName) {
								return false;
							}
							if (typeof window[funcName[1]] === 'function'
									&& typeof window[funcName[1]]() === 'number'
									&& (code.match(new RegExp(funcName[1]
											+ '\\(\\)\\s*<=?\\s*\\d')) || code
											.match(new RegExp('\\d\\s*>=?\\s*'
													+ funcName[1] + '\\(\\)')))) {
								return true;
							} else {
								return false;
							}
						},
					},
					{
						text : "Evaluate a mathematical expression",
						check : function() {
							var code = ui.getUserCode();
							var funcName = code
									.match(/function ([a-zA-Z0-9_]+)\(\)/);
							if (!funcName) {
								return false;
							}
							if (code.match(/(\+|-|\*|\/|%)/)
									&& typeof window[funcName[1]] === 'function'
									&& typeof window[funcName[1]]() === 'number'
									&& (code.match(new RegExp(funcName[1]
											+ '\\(\\)\\s*<=?\\s*\\d')) || code
											.match(new RegExp('\\d\\s*>=?\\s*'
													+ funcName[1] + '\\(\\)')))) {
								return true;
							} else {
								return false;
							}
						},
					} ],
			noBet : true,
			prev : 'lesson4.1',
			next : 'lesson4.3',
		},
		'lesson4.3' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('exec', les.checkObjectives);
			},
			objectives : [ {
				text : "Write a function that returns the value of your first two cards",
				check : function() {
					var handValues = handValue();
					var code = ui.getUserCode();
					var funcName = code.match(/function ([a-zA-Z0-9_]+)\(\)/);
					if (!funcName) {
						return false;
					}
					if (typeof window[funcName[1]] === 'function'
							&& window[funcName[1]]() == handValues[0]
									+ handValues[1]) {
						return true;
					} else {
						return false;
					}
				},
			} ],
			noBet : true,
			prev : 'lesson4.2',
			next : 'lesson5',
		},
		'lesson5' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('exec', les.checkObjectives);
			},
			objectives : [ {
				text : "Comment your code",
				check : function() {
					var handValues = handValue();
					var code = ui.getUserCode();
					var funcName = code.match(/function ([a-zA-Z0-9_]+)\(\)/);
					if (!funcName) {
						return false;
					}
					if (typeof window[funcName[1]] === 'function'
							&& window[funcName[1]]() == handValues[0]
									+ handValues[1]
							&& (code.match(/\/\*.*\*\//) || code.indexOf("//") != -1)
							&& code.indexOf('hit') != -1 && code.indexOf('stand') != -1) {
						return true;
					} else {
						return false;
					}
				},
			} ],
			noBet : true,
			prev : 'lesson4.3',
			next : 'lesson6.1',
		},
		'lesson6.1' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('error', function(E) {
					les.checkObjectives();
				});
				cb.add('exec', function() {
					les.checkObjectives();
				});
			},
			objectives : [ {
				text : "Set up basic while loop structure.",
				check : function() {
					var code = ui.getUserCode();
					return !!(code.match(/while\s*\(.*\)\s*\{/));
				},
			} ],
			noBet : true,
			prev : 'lesson5',
			next : 'lesson6.2',
		},
		'lesson6.2' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('exec', les.checkObjectives);
			},
			objectives : [ {
				text : "Make a functional loop and return the total value",
				check : function() {
					var handValues = handValue();
					var code = ui.getUserCode();
					var funcName = code.match(/function ([a-zA-Z0-9_]+)\(\)/);
					if (!funcName) {
						return false;
					}

					var sum = 0;
					for ( var i = 0; i < handValues.length; i++) {
						sum += handValues[i];
					}

					if (typeof window[funcName[1]] === 'function'
							&& window[funcName[1]]() == sum
							&& code.indexOf('while') != -1
							&& code.indexOf('hit') != -1
							&& code.indexOf('stand') != -1) {
						return true;
					} else {
						return false;
					}
				},
			} ],
			noBet : true,
			prev : 'lesson6.1',
			next : 'lesson7.1',
		},
		'lesson7.1' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('exec', les.checkObjectives);
			},
			objectives : [ {
				text : "Simplify incrementation",
				check : function() {
					var handValues = handValue();
					var code = ui.getUserCode();
					var funcName = code.match(/function ([a-zA-Z0-9_]+)\(\)/);
					if (!funcName) {
						return false;
					}
					var sum = 0;
					for ( var i = 0; i < handValues.length; i++) {
						sum += handValues[i];
					}
					if (typeof window[funcName[1]] === 'function'
							&& window[funcName[1]]() == sum
							&& code.indexOf('while') != -1
							&& code.indexOf('++') != -1
							&& code.indexOf('hit') != -1
							&& code.indexOf('stand') != -1) {
						return true;
					} else {
						return false;
					}
				},
			} ],
			noBet : true,
			prev : 'lesson6.2',
			next : 'lesson7.2',
		},
		'lesson7.2' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('exec', les.checkObjectives);
			},
			objectives : [ {
				text : "Turn a while loop into a for loop",
				check : function() {
					var handValues = handValue();
					var code = ui.getUserCode();
					var funcName = code.match(/function ([a-zA-Z0-9_]+)\(\)/);
					if (!funcName) {
						return false;
					}
					var sum = 0;
					for ( var i = 0; i < handValues.length; i++) {
						sum += handValues[i];
					}
					if (typeof window[funcName[1]] === 'function'
							&& window[funcName[1]]() == sum
							&& code.indexOf('for') != -1
							&& code.indexOf('hit') != -1
							&& code.indexOf('stand') != -1) {
						return true;
					} else {
						return false;
					}
				},
			} ],
			noBet : true,
			prev : 'lesson7.1',
			next : 'lesson8.1',
		},
		'lesson8.1' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('bet', function() {
					les.lessonList['lesson8.1'].complete = true;
				});
				cb.add('exec', les.checkObjectives);
			},
			objectives : [ {
				text : "Bet, at the beginning of the hand only",
				check : function() {
					var code = ui.getUserCode();
					return (les.lessonList['lesson8.1'].complete
							&& code.indexOf('hit') != -1 && code.indexOf('stand') != -1);
				},
			} ],
			complete : false,
			prev : 'lesson7.2',
			next : 'lesson8.2',
		},
		'lesson8.2' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				les.lessonList['lesson8.2'].prevMoney = eg.money;
				cb.add('exec', les.checkObjectives);
			},
			objectives : [ {
				text : "Ensure you won't bet more than you can afford",
				check : function() {
					var code = ui.getUserCode();
					var allIn = (eg.money === 0 || eg.money === 2 * les.lessonList['lesson8.2'].prevMoney);
					les.lessonList['lesson8.2'].prevMoney = eg.money;
					return allIn && code.indexOf('hit') != -1
							&& code.indexOf('stand') != -1;
				},
			} ],
			prevMoney : 0,
			prev : 'lesson8.1',
			next : 'lesson9.1',
		},
		'end' : {
			action : function() {
				cb.clear();
				ui.maxIns();
			},
			objectives : [],
			prev : 'lesson8.2',
			next : '',
		},
		'lesson9.1' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('doubledown', function() {
					les.lessonList['lesson9.1'].complete = true;
				});
				cb.add('error', function() {
					les.checkObjectives();
				});
				cb.add('exec', function() {
					les.checkObjectives();
				});
			},
			objectives : [ {
				text : "Add a conditional double down command",
				check : function() {
					if (les.lessonList['lesson9.1'].complete) {
						les.lessonList['lesson9.1'].complete = false;
						return true;
					} else {
						return false;
					}
				},
			} ],
			complete: false,
			riggedDeck : [ {
				num : 8,
				suit : 3
			}, {
				num : 14,
				suit : 1
			}, {
				num : 6,
				suit : 1
			}, {
				num : 7,
				suit : 0
			}, {
				num : 6,
				suit : 1
			}, {
				num : 4,
				suit : 0
			}, {
				num : 5,
				suit : 3
			}, {
				num : 10,
				suit : 2
			}, ],
			prev : 'lesson8.2',
			next : 'lesson9.2',
		},
		'lesson9.2' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('doubledown', function() {
					les.lessonList['lesson9.2'].complete = true;
				});
				cb.add('exec', function() {
					les.checkObjectives();
				});
			},
			objectives : [ {
				text : "Prevent errors and increase efficiency with else if",
				check : function() {
					var code = ui.getUserCode();
					if (les.lessonList['lesson9.2'].complete
						&& code.match(/else\s+if/)
						&& code.indexOf('hit') != -1 && code.indexOf('stand') != -1) {
						les.lessonList['lesson9.2'].complete = false;
						return true;
					} else {
						return false;
					}
				},
			} ],
			riggedDeck : [ {
				num : 8,
				suit : 2
			}, {
				num : 14,
				suit : 0
			}, {
				num : 6,
				suit : 2
			}, {
				num : 7,
				suit : 3
			}, {
				num : 6,
				suit : 3
			}, {
				num : 4,
				suit : 1
			}, {
				num : 5,
				suit : 2
			}, {
				num : 10,
				suit : 0
			}, ],
			complete: false,
			prev : 'lesson9.1',
			next : 'lesson9.3',
		},
		'lesson9.3' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('doubledown', function() {
					les.lessonList['lesson9.3'].complete = true;
				});
				cb.add('exec', function() {
					les.checkObjectives();
				});
			},
			objectives : [ {
				text : "Use an \"or\" statement",
				check : function() {
					var code = ui.getUserCode();
					if (les.lessonList['lesson9.3'].complete
						&& code.indexOf('hit') != -1 && code.indexOf('stand') != -1) {
						les.lessonList['lesson9.3'].complete = false;
						return true;
					} else {
						return false;
					}
				},
			}, {
				text : "Use a combined \"and-or\" statement",
				check : function() {
					var code = ui.getUserCode();
					if (les.lessonList['lesson9.3'].complete
						&& code.indexOf('&&') != -1 
						&& code.indexOf('hit') != -1 && code.indexOf('stand') != -1) {
						les.lessonList['lesson9.3'].complete = false;
						return true;
					} else {
						return false;
					}
				},
			} ],
			riggedDeck : [ {
				num : 8,
				suit : 2
			}, {
				num : 14,
				suit : 0
			}, {
				num : 6,
				suit : 2
			}, {
				num : 7,
				suit : 3
			}, {
				num : 6,
				suit : 3
			}, {
				num : 5,
				suit : 1
			}, {
				num : 5,
				suit : 2
			}, {
				num : 10,
				suit : 0
			}, ],
			prev : 'lesson9.2',
			next : 'lesson10.1',
		},
		'lesson10.1' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('doubledown', function() {
					les.lessonList['lesson10.1'].complete = true;
				});
				cb.add('exec', function() {
					les.checkObjectives();
				});
			},
			objectives : [ {
				text : "Factor in the dealer's up card",
				check : function() {
					var code = ui.getUserCode();
					if (code.match(/else\s*if\s*\(.*\(\).*dealerUpCard.*\)/)
						|| code.match(/else\s*if\s*\(.*dealerUpCard\(\).*\(\).*\)/)) {
						return true;
					} else {
						return false;
					}
				},
			} ],
			prev : 'lesson9.3',
			next : 'lesson10.2',
		},
		'lesson10.2' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('hit', function() {
					les.lessonList['lesson10.2'].complete = true;
				});
				cb.add('exec', les.checkObjectives);
			},
			objectives : [ {
				text : "Add the second condition",
				check : function() {
					if (les.lessonList['lesson10.2'].complete){
						return true;
					} else {
						return false;
					}
				},
			} ],
			riggedDeck : [ {
				num : 8,
				suit : 2
			}, {
				num : 11,
				suit : 0
			}, {
				num : 8,
				suit : 2
			}, {
				num : 13,
				suit : 3
			}, {
				num : 3,
				suit : 2
			}, {
				num : 5,
				suit : 3
			}, {
				num : 3,
				suit : 1
			}, {
				num : 10,
				suit : 0
			}, ],
			prev : 'lesson10.1',
			next : 'lesson11.1',
		},
		'lesson11.1' : {
			action : function() {
				cb.clear();
				ui.maxIns();	
				cb.add('exec', les.checkObjectives);
			},
			objectives : [ {
				text : "Set up an if statement in the appropriate location",
				check : function() {
					var code = ui.getUserCode();
					return !!(code.match(/if\s*\(\s*handEnd\s*\)\s*\{/));
				},
			} ],
			prev : 'lesson10.2',
			next : 'lesson11.2',
			GRAWWR: true,
		},
		'lesson11.2' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('exec', les.checkObjectives);
			},
			objectives : [ {
				text : "Make an array by setting each position individually",
				check : function() {
					var code = ui.getUserCode();
					var matches = code.match(/([a-zA-Z0-9_]+)\[\s*\d+\s*\]\s*=\s*\d/);
					if (!matches || !matches[1] || typeof window[matches[1]] !== 'object') {
						return false;
					}
					var shouldMatch = [0,0,1, 1, 1, 1, 1, 0, 0, 0, -1, -1];
					for (var i = 2; i < window[matches[1]].length; i++) {
						
						if (shouldMatch[i]===undefined || window[matches[1]][i]===undefined || window[matches[1]][i] !== shouldMatch[i]) {
							return false;
						}
					}
					return true;
				},
			}, {
				text : "Make an array by setting all positions at once",
				check : function() {
					var code = ui.getUserCode();
					var matches = code.match(/([a-zA-Z0-9_]+)\s*=\s*\[\s*0\s*,\s*0\s*,\s*1\s*,\s*1\s*,\s*1\s*,\s*1\s*,\s*1\s*,\s*0\s*,\s*0\s*,\s*0\s*,\s*-1\s*,\s*-1\s*\]/);
					return !!matches;
				},
			}, {
				text : "Make an array with for loops",
				check : function() {
					var code = ui.getUserCode();
					var forCount = code.match(/for/g);
					return (forCount && forCount.length >= 2);
				},
			} ],
			prev : 'lesson11.1',
			next : 'lesson11.3',
			GRAWWR: true,
		},
		'lesson11.3' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('GRAWWR', les.checkObjectives);
			},
			objectives : [ {
				text : "Adjust and keep track of your card count",
				check : function() {
					var code = ui.getUserCode();
					var cardCountVal = [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, -1, -1];
					var count = 0;
					var counter;
					for(counter = 0; counter < (handValue()).length; counter++){
						count += cardCountVal[(handValue())[counter]];
					}
					
					for(counter = 0; counter < (dealerHandValue()).length; counter++){
						count += cardCountVal[(dealerHandValue())[counter]];
					}
					
					if (typeof cardCount == "number" && cardCount === count) {
						return true;
					}
					return false;
				},
			} ],
			prev : 'lesson11.2',
			next : 'lesson11.4',
			GRAWWR: true,
		},
		'lesson11.4' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('GRAWWR', les.checkObjectives);
			},
			objectives : [ {
				text : "Adjust and keep track of your card count",
				check : function() {
					var code = ui.getUserCode();
					if (code.indexOf('reshuffled') === -1) {
						return false;
					}
					var cardCountVal = [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, -1, -1];
					var count = 0;
					var counter;
					for(counter = 0; counter < (handValue()).length; counter++){
						count += cardCountVal[(handValue())[counter]];
					}
					
					for(counter = 0; counter < (dealerHandValue()).length; counter++){
						count += cardCountVal[(dealerHandValue())[counter]];
					}
					
					if (typeof cardCount == "number" && cardCount === count) {
						return true;
					}
					return false;
				}} ],
			prev : 'lesson11.3',
			next : 'lesson11.5',
			GRAWWR: true,
		},
		'lesson11.5' : {
			action : function() {
				les.lessonList['lesson11.5'].cardCount = 0;
				les.lessonList['lesson11.5'].complete = false;
				cb.clear();
				ui.maxIns();
				cb.add('bet', function(b) {
					if (b === les.lessonList['lesson11.5'].cardCount + 21) {
						if (!les.lessonList['lesson11.5'].prevWasRight) {
							les.lessonList['lesson11.5'].prevWasRight = true;
						} else {
							les.lessonList['lesson11.5'].complete = true;
						}
					} else {
						les.lessonList['lesson11.5'].prevWasRight = false;
					}
				});
				cb.add('GRAWWR', function() {
					if (eg.reshuffled) {
						les.lessonList['lesson11.5'].cardCount = 0;
					}
					var cardCountVal = [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, -1, -1];
					var count = 0;
					var counter;
					for(counter = 0; counter < (handValue()).length; counter++){
						count += cardCountVal[(handValue())[counter]];
					}
					
					for(counter = 0; counter < (dealerHandValue()).length; counter++){
						count += cardCountVal[(dealerHandValue())[counter]];
					}
					
					les.lessonList['lesson11.5'].cardCount += count;
					
				});
				cb.add('exec', les.checkObjectives);
			},
			objectives : [ {
				text : "Bet based on your card count",
				check : function() {
					var code = ui.getUserCode();
					return les.lessonList['lesson11.5'].complete;
				},
			} ],
			complete: false,
			cardCount: 0,
			prevWasRight: false,
			prev : 'lesson11.4',
			next : 'lesson11.6',
			GRAWWR: true,
			reshuffle: true,
		},
		'lesson11.6' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('bet', function(b) {
					if (b === les.lessonList['lesson11.6'].cardCount + 21) {
						if (!les.lessonList['lesson11.6'].prevWasRight) {
							les.lessonList['lesson11.6'].prevWasRight = true;
						} else {
							les.lessonList['lesson11.6'].complete = true;
						}
					} else {
						les.lessonList['lesson11.6'].prevWasRight = false;
					}
				});
				cb.add('GRAWWR', function() {
					if (eg.reshuffled) {
						les.lessonList['lesson11.6'].cardCount = 0;
					}
					var cardCountVal = [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, -1, -1];
					var count = 0;
					var counter;
					for(counter = 0; counter < (handValue()).length; counter++){
						count += cardCountVal[(handValue())[counter]];
					}
					
					for(counter = 0; counter < (dealerHandValue()).length; counter++){
						count += cardCountVal[(dealerHandValue())[counter]];
					}
					
					les.lessonList['lesson11.6'].cardCount += count;
					
				});
				cb.add('exec', les.checkObjectives);
			},
			objectives : [ {
				text : "Use functions to remove duplicate code in the program",
				check : function() {
					var code = ui.getUserCode();
					var fors = code.match(/for/g);
					var funcs = code.match(/function/g);
					return (fors && funcs && fors.length >= 4 && funcs.length >= 3 
							&& les.lessonList['lesson11.6'].complete);
				},
			} ],
			complete: false,
			cardCount: 0,
			prevWasRight: false,
			prev : 'lesson11.5',
			next : 'lesson11.7',
			GRAWWR: true,
			reshuffle: true,
		},
		'lesson11.7' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('bet', function(b) {
					if (b === les.lessonList['lesson11.7'].cardCount + 21) {
						if (!les.lessonList['lesson11.7'].prevWasRight) {
							les.lessonList['lesson11.7'].prevWasRight = true;
						} else {
							les.lessonList['lesson11.7'].complete = true;
						}
					} else {
						les.lessonList['lesson11.7'].prevWasRight = false;
					}
				});
				cb.add('GRAWWR', function() {
					if (eg.reshuffled) {
						les.lessonList['lesson11.7'].cardCount = 0;
					}
					var cardCountVal = [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, -1, -1];
					var count = 0;
					var counter;
					for(counter = 0; counter < (handValue()).length; counter++){
						count += cardCountVal[(handValue())[counter]];
					}
					
					for(counter = 0; counter < (dealerHandValue()).length; counter++){
						count += cardCountVal[(dealerHandValue())[counter]];
					}
					
					les.lessonList['lesson11.7'].cardCount += count;
					
				});
				cb.add('exec', les.checkObjectives);
			},
			objectives : [ {
				text : "Use more functions to remove more duplicate code in the program",
				check : function() {
					var code = ui.getUserCode();
					var fors = code.match(/for/g);
					var funcs = code.match(/function/g);
					return (fors && funcs && fors.length == 3 && funcs.length >= 4 
							&& les.lessonList['lesson11.7'].complete);
				},
			} ],
			complete: false,
			cardCount: 0,
			prevWasRight: false,
			prev : 'lesson11.6',
			next : 'lesson12.1',
			GRAWWR: true,
			reshuffle: true,
		},
		'lesson12.1' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('hint', les.checkObjectives);
			},
			objectives : [ {
				text : "Understand the logic of needed to count an Ace as 11 or 1",
				check : function() {
					return true;
				},
			}, {
				text : "Write a method to count the number of Aces in a hand",
				check : function() {
					return true;
				},
			}],
			prev : 'lesson11.7',
			next : 'lesson12.2',
			GRAWWR: true,
			reshuffle: true,
			suppressNotification: true,
		},
		'lesson12.2' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('hint', les.checkObjectives);
			},
			objectives : [ {
				text : "Set a boolean to true if there is at least one Ace in your hand",
				check : function() {
					return true;
				},
			}, {
				text : "Write a method to find the highest value of a hand with Aces that doesn't bust",
				check : function() {
					return true;
				},
			}, {
				text : "Set the value of this method to a variable",
				check : function() {
					return true;
				},
			} ],
			prev : 'lesson12.1',
			next : 'lesson12.3',
			GRAWWR: true,
			reshuffle: true,
			suppressNotification: true,
		},
		'lesson12.3' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('hint', les.checkObjectives);
			},
			objectives : [ {
				text : "Use if-else statements and boolean expressions to make your program bet appropriately",
				check : function() {
					return true;
				},
			} ],
			prev : 'lesson12.2',
			next : 'end',
			GRAWWR: true,
			reshuffle: true,
			suppressNotification: true,
		},
		'end' : {
			action : function() {
				cb.clear();
				ui.maxIns();
				cb.add('hint', les.checkObjectives);
			},
			objectives : [ {
				text : "Play Blackjack",
				check : function() {
					return false;
				},
			}, {
				text : "Get a job",
				check : function() {
					return false;
				},
			} ],
			prev : 'lesson12.2',
			next : 'end',
			GRAWWR: true,
			reshuffle: true,
			suppressNotification: true,
		},
	},

	checkObjectives : function() {
		if (les.objComplete) {
			return;
		}
		var allDone = true;
		for ( var i = 0; i < les.objectives.length; i++) {
			if (typeof les.objectives[i].complete == 'undefined'
					|| !les.objectives[i].complete) {
				if (les.objectives[i].check()) {
					les.objectives[i].complete = true;
					$(".objective" + i).append(
							$("<img src='./img/check.png' alt='O' />"));
					$("#lessonNumberForThisNotification").html(
							les.currLesson.substr(6));
					$("#objectiveThatIsComplete").html(les.objectives[i].text);
					if (!les.lessonList[les.currLesson].suppressNotification) {
						$("#notification").show().delay(1500).fadeOut();
					}
				} else {
					allDone = false;
				}
			}
		}
		if (allDone) {
			if (ui.isLoggedIn) {
				rem.acc('setLevelDone', function(n) {
					
				}, {
					level : les.currLesson
				});
				if (les.progress[les.lessonList[les.currLesson].next] !== "completed") {
					rem.acc('setLevelInProgress', function(n) {

					}, {
						level : les.lessonList[les.currLesson].next
					});
				}
			}
			// $("#instructions").append($(ui.nextButton));
			les.progress[les.currLesson] = "completed";
			les.progress[les.lessonList[les.currLesson].next] = "in progress";
			$.cookie('p', JSON.stringify(les.progress));
			$("#continueButton").show();
			$("#instructions").css({
				height : '310px'
			});
			les.objComplete = true;
		}
	},

	showHint : function(e) {
		if (!les.hintUnlocked) {
			alert('Please try the lesson yourself before looking at our hints!');
			return;
		}
		cb.call('hint');
		$(e).toggle(100).queue(function() {
			// Why does jQuery not work...

			// $('#instructions').attr('scrollTop',
			// $('#instructions').attr('scrollHeight'));
			var instructions = document.getElementById("instructions");
			instructions.scrollTop = instructions.scrollHeight;
			$(this).dequeue();
		});
	},

	loadLesson : function(lesson) {
		eg.lockEval();
		les.currLesson = lesson;
		les.hintUnlocked = false;
		if (les.currLesson != 'lesson0' && !les.progress[les.currLesson]) {
			location.hash = 'lesson0';
			return;
		}
		$("#betbox").html('');
		$("#buttons").html('');
		$("#codebox").removeAttr('disabled');
		$("#eval").removeAttr('disabled');
		$("#previousButton").show();
		$("#continueButton").hide();
		$("#instructions").css({
			height : '310px'
		});
		les.objectives = les.lessonList[les.currLesson].objectives;
		cardCount = 0;
		if (les.lessonList[les.currLesson].noBet) {
			$("#resetMoneyBox").css({
				display : 'none'
			});
		} else {
			$("#resetMoneyBox").css({
				display : 'inline'
			});
		}
		for ( var i = 0; i < les.objectives.length; i++) {
			les.objectives[i].complete = false;
		}
		les.objComplete = false, les.flags = {},

		$.get('./lessons/' + lesson + '.htm', function(data) {
			if (name) {
				data = data.replace(/\[NAME\]/g, name);
			} else {
				data = data.replace(/\[NAME\]/g, 'friend');
			}
			data = data.replace(/show="([^"]*)"/g,
					'href="javascript:void(les.showHint(\'#$1\'));"');

			les.lessonText = data;

			$("#instructions").fadeOut().queue(
					function() {
						$("#instructions").html(les.lessonText);
						
						var checkMark = '';
						
						if (les.progress[les.currLesson] && "completed" === les.progress[les.currLesson]) {
							checkMark = "<img src='./img/check.png' alt='O' />";
							$("#continueButton").show();
							$("#instructions").css({
								height : '310px'
							});
							les.objComplete = true;
						}
						
						if (les.objectives.length > 0) {
							var objList = $("<ol></ol>");
							for ( var i = 0; i < les.objectives.length; i++) {
								objList.append($("<li></li>").addClass(
										"objective" + i).html(
										les.objectives[i].text + checkMark));
							}
							var objBox = $("<div></div>")
									.addClass("objectives").append(
											$("<h4>Objectives</h4>")).append(
											objList);
							objBox.insertAfter($("#instructions h3"));
						}
						
						

						if (!ui.sideMaxed) {
							$(".objectives").css({
								width : '150px',
								float : 'none',
								margin : '10px auto 10px auto'
							});
						}

						if (les.lessonList[les.currLesson].action) {
							les.lessonList[les.currLesson].action();
						}
						$(this).dequeue();
					}).fadeIn().queue(function() {
				eg.unlockEval();
				document.getElementById("instructions").scrollTop = 0;
				$(this).dequeue();
			});
		});
	},
	prevLesson : function() {
		if (!les.lessonList[les.currLesson]) {

		} else {
			location.hash = les.lessonList[les.currLesson].prev;
		}
	},
	nextLesson : function() {
		if (!les.lessonList[les.currLesson]) {

		} else {
			location.hash = les.lessonList[les.currLesson].next;
		}
	},
};