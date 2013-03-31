/*
 * ui.js
 * Provides functions dealing with the user interface of the lessons.
 * Sets up said interface.
 */

// Preload images
(function() {
	var preloads = [ "./img/cardsprite.png", "./img/objectivecomplete.png",
			"./img/continuesmall.png" ];
	var imgCache = new Array();
	for ( var i = 0; i < preloads.length; i++) {
		imgCache[i] = new Image();
		imgCache[i].src = preloads[i];
	}
})();

function insertAtCaret(areaId,text) {
    var txtarea = document.getElementById(areaId);
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? 
        "ff" : (document.selection ? "ie" : false ) );
    if (br == "ie") { 
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        strPos = range.text.length;
    }
    else if (br == "ff") strPos = txtarea.selectionStart;

    var front = (txtarea.value).substring(0,strPos);  
    var back = (txtarea.value).substring(strPos,txtarea.value.length); 
    txtarea.value=front+text+back;
    strPos = strPos + text.length;
    if (br == "ie") { 
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        range.moveStart ('character', strPos);
        range.moveEnd ('character', 0);
        range.select();
    }
    else if (br == "ff") {
        txtarea.selectionStart = strPos;
        txtarea.selectionEnd = strPos;
        txtarea.focus();
    }
    txtarea.scrollTop = scrollPos;
}

function removeComments(str) {
    str = ('__' + str + '__').split('');
    var mode = {
        singleQuote: false,
        doubleQuote: false,
        regex: false,
        blockComment: false,
        lineComment: false,
        condComp: false 
    };
    for (var i = 0, l = str.length; i < l; i++) {
 
        if (mode.regex) {
            if (str[i] === '/' && str[i-1] !== '\\') {
                mode.regex = false;
            }
            continue;
        }
 
        if (mode.singleQuote) {
            if (str[i] === "'" && str[i-1] !== '\\') {
                mode.singleQuote = false;
            }
            continue;
        }
 
        if (mode.doubleQuote) {
            if (str[i] === '"' && str[i-1] !== '\\') {
                mode.doubleQuote = false;
            }
            continue;
        }
 
        if (mode.blockComment) {
            if (str[i] === '*' && str[i+1] === '/') {
                str[i+1] = '';
                mode.blockComment = false;
            }
            str[i] = '';
            continue;
        }
 
        if (mode.lineComment) {
            if (str[i+1] === '\n' || str[i+1] === '\r') {
                mode.lineComment = false;
            }
            str[i] = '';
            continue;
        }
 
        if (mode.condComp) {
            if (str[i-2] === '@' && str[i-1] === '*' && str[i] === '/') {
                mode.condComp = false;
            }
            continue;
        }
 
        mode.doubleQuote = str[i] === '"';
        mode.singleQuote = str[i] === "'";
 
        if (str[i] === '/') {
 
            if (str[i+1] === '*' && str[i+2] === '@') {
                mode.condComp = true;
                continue;
            }
            if (str[i+1] === '*') {
                str[i] = '';
                mode.blockComment = true;
                continue;
            }
            if (str[i+1] === '/') {
                str[i] = '';
                mode.lineComment = true;
                continue;
            }
            mode.regex = true;
 
        }
 
    }
    return str.join('').slice(2, -2);
}

var ui = {
	sideMaxed : true,
	isLoggedIn : false,
	makeButton : function(label, func) {
		var but = $("<div></div>").css({
			backgroundImage: 'url(./img/' + label + '.png)',
			height: '25px',
			width: '98px',
			display: 'inline-block',
			backgroundPosition: 'top',
			cursor: 'pointer'
		});
		but.mouseover(function() {
			$(this).css({backgroundPosition: 'bottom'});
		})
		but.mouseout(function() {
			$(this).css({backgroundPosition: 'top'});
		})
		but.bind('click', func);
		return but;
	},
	maxIns : function() {
		if (ui.sideMaxed) {
			return;
		}
		ui.sideMaxed = true;
		$("#toggleIns").attr('src', './img/larr.png');
		$(".objectives").css({
			width : '200px',
			float : 'right'
		});
		$('#sidebar').animate({
			width : '800px'
		});
	},
	minIns : function() {
		if (!ui.sideMaxed) {
			return;
		}
		ui.sideMaxed = false;
		$("#toggleIns").attr('src', './img/rarr.png');
		$(".objectives").css({
			width : '150px',
			float : 'none',
			margin : '10px auto 10px auto'
		});
		$('#sidebar').animate({
			width : '200px'
		});
	},
	toggleIns : function() {
		if (ui.sideMaxed) {
			ui.minIns();
		} else {
			ui.maxIns();
		}
	},
	disableEval : function() {
		$("#eval").attr('disabled', 'disabled');
	},
	enableEval : function() {
		$("#eval").removeAttr('disabled');
	},
	getUserCode : function() {
		if (les.currLesson !== 'lesson5') {
			return removeComments($("#codebox").val());
		} else {
			return ($("#codebox").val());
		}
	},
};

// Set up the document
$(document).ready(function() {
	// Make the board
	for ( var r = 0; r < eg.rows; r++) {
		var tr = document.createElement("tr");
		for ( var c = 0; c < eg.cols; c++) {
			var td = document.createElement("td");
			td.style.width = "80px";
			td.setAttribute("id", "display" + r + c);
			tr.appendChild(td);
		}
		$("#display").append(tr);
	}
	$("#bet").removeAttr('disabled');
	$("#money").html("Money: " + eg.money);

	// Make automatic controls
	$("#submit").bind('click', function() {
		eg.execCode($("#codebox").val());
	});

	// Make the textarea fancy
	$('#codebox').keydown(function(e) {
		if (e.keyCode === 9) {
			insertAtCaret('codebox', '	');
			e.preventDefault();
			return false;
		}
		return true;
	})
	$('#code').click(function() {
		$('#codebox').focus();
	});

	if ($.cookie("c")) {
		$("#codebox").val($.cookie("c"));
	}

	$("#codebox").change(function() {
		$.cookie("c", $("#codebox").val(), {
			expires : 7
		});
	});

	$("#previousButton").click(function() {
		les.prevLesson();
	});

	$("#continueButton").click(function() {
		les.nextLesson();
	});

	$("#resetMoney").click(function() {
		eg.money = eg.defaultMoney;
		$("#money").html("Money: " + eg.money);
	});

	rem.acc('getLogin', function(l) {
		if (!l.isLoggedIn) {
			rem.loginUrl = l.URL;
			$("#accBig").attr('href', l.URL);
			$("#accBig").html('Login');
			if ($("#linkLogin")) {
				$("#linkLogin").attr('href', rem.loginUrl);
			}
		} else {
			ui.isLoggedIn = true;
			$("#accSmall").html('Logout');
			$("#accSmall").attr('href', l.URL);
			$("#accSmall").show();
			$("#accBig").hide();
			rem.acc('getName', function(n) {
				$("#accBig").show();	
				$("#accBig").attr('href', 'javascript:void(0);');
				$("#accBig").html(n.name);
				$("#accName").html();
			});
			rem.acc('getProgress', function(p) {
				les.progress = p;
				
				if ($.cookie("p")) {
					// Merge cookie and server data
					var diff = false;
					var cookieProgress = JSON.parse($.cookie("p"));
					var serverProgress = p;
					var mergedProgress = {};
					// Clone cookieProgress
					for (var i in cookieProgress) {
						mergedProgress[i] = cookieProgress[i];
					}
					// Merge in serverProgress
					for (var i in serverProgress) {
						if (serverProgress[i] === 'completed') {
							mergedProgress[i] = 'completed';
						} else if (serverProgress[i] === 'in progress' && mergedProgress[i] !== 'completed') {
							mergedProgress[i] = 'in progress';
						}
					}
					les.progress = mergedProgress;
					//$.cookie("p", cookieProgress);
				}
				var hasLesson = false;
				if (!location.hash) {
					for (state in les.progress) {	
						if (les.progress[state] === 'in progress') {
							location.hash = state;
							hasLesson = true;
							break;
						}
					}
					if (!hasLesson) {
						location.hash = "#lesson0";
					}
				} else {
					les.loadLesson(location.hash.substr(1));
				}
			});
		}

		// Start the lesson!
		if (!ui.isLoggedIn) {
			les.loadLesson(les.currLesson);
		}
	}, {
		returnURL : document.URL
	});

	var toggle = $("#toggleIns");
	toggle.bind('click', ui.toggleIns);

	// Check for bookmarks
	if (location.hash) {
		var lesson = location.hash.substr(1);
		if (les.lessonList[lesson]) {
			les.currLesson = lesson;
		}
	}

	$(window).hashchange(function() {
		var lesson = location.hash.substr(1);
		if (les.lessonList[lesson]) {
			les.currLesson = lesson;
		} else {
			les.currLesson = "lesson0";
		}
		les.loadLesson(les.currLesson);
	});
	
	$("#curtains").click(function() {
		var speed = 3000;
		$("#bleft").animate({left:'-50%'},speed,"linear");
		$("#bright").animate({left:'100%'},speed,"linear").queue(function() {
			$("#curtains").hide();
			$(this).dequeue();
		});
		$("body").css({overflow:'auto'});
	});
});

function winEverything() {
	var face = $("<img src='./img/face.png'></img>").css({position:'fixed', top:'0px', left: '0px'});
	var x = 0;
	var y = 0;
	var dx = 5;
	var dy = 5;
	var r = 0;
	var dr = 5;
	var bounce = window.setInterval(function() {
		var rotates = ['transform', '-ms-transform', '-moz-transform', '-webkit-transform', '-o-transform'];
		if (x + dx + face.width() > $(document).width() || x+dx < 0) {
			dx = -dx;
		}
		if (y + dy + face.height() > $(document).height() || y+dy < 0) {
			dy = -dy;
		}
		x += dx;
		y += dy;
		r = (r + dr) % 360;
		face.css({left:x+'px',top:y+'px'});
		for (var i = 0; i < rotates.length; i++) {
			face.css(rotates[i], 'rotate(' + r + 'deg)')
		}
	},10);
	$('body').append(face);
}
