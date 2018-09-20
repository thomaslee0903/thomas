window.onload = defaultSetting;

var org = document.getElementById("organization");


function defaultSetting() {
	//getStaff(getDepartment(getCorporation()));
    getCorporation();
    getDepartment();
    setTimeout(getStaff, 500);
}


/* Get corporation names from database
   and set to each corporation button  */
function getCorporation() {

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {

		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var dataObject = JSON.parse(xhttp.responseText);

			for (var i = 0; i < dataObject.length; i++) {

				// cor의 html 생성
				document.getElementById("btn" + (i + 1)).textContent = dataObject[i].CORPORATION;
			}
		};
	}
	xhttp.open("POST", "http://127.0.0.1:8080/getCorporation", true);
	xhttp.send();

}


/* Get department naems from database
   and set to each department according to corporation
*/
function getDepartment(corporation) {

	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function () {

		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var dataObject = JSON.parse(xhttp.responseText);

			var teamCount = 0;
			var reverseCount = 0;

			for (var i = 0; i < dataObject.length; i++) {
				var code = dataObject[i].CODE.toString();

				if (dataObject[i].DEPARTMENT != "GM") {
					switch (code.substring(1, 3)) {
						case "01":
							classify(1, code.substring(0, 1));
							break;

						case "02":
							classify(2, code.substring(0, 1));
							break;

						case "03":
							classify(3, code.substring(0, 1));
							break

						case "04":
							classify(4, code.substring(0, 1));
							break;

						case "05":
							classify(5, code.substring(0, 1));
							break;

						case "06":
							classify(6, code.substring(0, 1));
							break;

						case "07":
							classify(7, code.substring(0, 1));
							break;

						case "08":
							classify(8, code.substring(0, 1));
							break;

						case "09":
							classify(9, code.substring(0, 1));
							break;

						case "10":
							classify(10, code.substring(0, 1));
							break;
					}
				}

				function classify(cor, dep) {
					var depCode = parseInt(dep);
					reverseCount = teamCount;

					if (depCode == 1) {
						$("#sales" + cor).before("<p id='team" + teamCount + "' class='team'>" + dataObject[i].DEPARTMENT + "<p>");
						$("#team" + teamCount).after("<p id='reverse" + reverseCount + "' class='fake-line'>　<p>");
						teamCount++;
					} else if (depCode == 2) {
						$("#production" + cor).before("<p id='team" + teamCount + "' class='team'>" + dataObject[i].DEPARTMENT + "<p>");
						$("#team" + teamCount).after("<p id='reverse" + reverseCount + "' class='fake-line'>　<p>");
						teamCount++;
					} else if (depCode == 3) {
						$("#management" + cor).before("<p id='team" + teamCount + "' class='team'>" + dataObject[i].DEPARTMENT + "<p>");
						$("#team" + teamCount).after("<p id='reverse" + reverseCount + "' class='fake-line'>　<p>");
						teamCount++;
					}
				}
			}
		}
	};

	xhttp.open("POST", "http://127.0.0.1:8080/getDepartment", true);
	xhttp.send();

}


/* Get staffs from database
*/
function getStaff(department) {
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function () {

		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var dataObject = JSON.parse(xhttp.responseText);

			var staffCount = 0;
			var sectionCount = 0;

			for (var i = 0; i < dataObject.length; i++) {

				var co = document.getElementsByClassName("divCo");

				for (var j = 1; j <= co.length; j++) {
					if (document.getElementById("btn" + j).textContent == dataObject[i].CORPORATION) {
						separate(j);
					}
				}
			}

			function separate(number) {

				if (dataObject[i].DEPARTMENT == "GM") {
					document.getElementById("GM" + number).value = dataObject[i].NAME + " " + dataObject[i].POSITION;
					if (dataObject[i].MAJOR == false) {
						$("#GM" + number).addClass("duplicated");
					}
				} else {
					var dept = document.getElementById('section' + number).getElementsByClassName("team");
					var dd = document.getElementById('section' + number).getElementsByClassName("fake-line");
					var ee = document.getElementById('section' + number).parentElement.getElementsByClassName("btnCo")[0].textContent;

					for (var j = 0; j < dept.length; j++) {

						if (dataObject[i].DEPARTMENT == dept[j].textContent && dataObject[i].CORPORATION == ee) {
							$("#" + dd[j].id).before("<button id='staff" + staffCount + "' class='btnName' onclick='openFirstModal()' value='0'>" + dataObject[i].NAME + " " + dataObject[i].POSITION + "</button>");

							staffClass(dataObject[i], staffCount);
							staffCount++;
						}
					}
				}
			}
		}
	};

	function staffClass(data, count) {

		if (data.POSITION == "인턴") {
			$("#staff" + count).addClass("intern");
		}
		if (data.CORPORATION == "성남본사") {
			$("#staff" + count).addClass("domestic");
		}
		if (data.NAME.split("")[0].charCodeAt(0) >= 65 && data.NAME.split("")[0].charCodeAt(0) <= 122) {
			$("#staff" + count).removeClass("domestic").addClass("foreign");
		}
		if (data.MAJOR == false) {
			$("#staff" + count).addClass("duplicated");
		}
	}

	xhttp.open("GET", "http://127.0.0.1:8080/ab", true);
	xhttp.send();


	setTimeout(fingerCheck, 1000);
	setTimeout(countMember, 1000);

	setTimeout(autoHeight, 2000);
}


/* Count the number of member */
function countMember() {

	// Summary of each department of corporation	
	var content = document.getElementsByClassName("content");
	var count = document.getElementsByClassName("secCount");

	for (var j = 0; j < content.length; j++) {
		var num = content[j].id.split("content")[1];
		var btn = document.getElementById("" + content[j].id).getElementsByClassName("btnName").length;
		var intern = document.getElementById("" + content[j].id).getElementsByClassName("intern").length;
		var foreign = document.getElementById("" + content[j].id).getElementsByClassName("foreign").length;
		var duplicated = document.getElementById("" + content[j].id).getElementsByClassName("duplicated").length;
		var gg = (j / 3) + 1;
		var gm = 0;
		
		if($("#GM"+gg).hasClass("duplicated") == false && j%3 == 2){ gm = 1; }
        if(j != 2){
            count[j].value = (btn - intern - foreign - duplicated +gm) + "명";    
        }
        else{
            count[j].value = (btn - intern - foreign - duplicated) + "명";
        }
		
	}

	var gm = org.getElementsByClassName("GM").length;
	var staff = org.getElementsByClassName("btnName").length;
	var duplicated = org.getElementsByClassName("duplicated").length;
	var total = staff + gm - duplicated;
	var domestic = document.getElementById('section1').getElementsByTagName('button').length;
	var foreign = org.getElementsByClassName("foreign").length;
	var intern = org.getElementsByClassName("intern").length;

	var table = document.getElementById('table1');
	table.rows[1].cells[1].innerHTML = domestic + 2; // The number of domestic staff which contains chiarman and president.
	table.rows[4].cells[1].innerHTML = foreign; // The number of foregin staff
	table.rows[5].cells[1].innerHTML = intern; // The number of intern staff
	table.rows[2].cells[1].innerHTML = total - domestic - intern - foreign + 1; // The number of korean staff in abroad
	table.rows[3].cells[1].innerHTML = domestic + 2 + total - domestic - intern - foreign + 1; // The number of addition of domestic and abroad


};


/* Hide the department automatically which has not team */
function fingerCheck() {
	var cop = document.getElementsByClassName("divCo");

	for (var i = 0; i < cop.length; i++) {

		var a = cop[i].id;
		var b = document.getElementById("" + cop[i].id).getElementsByClassName("content");
		var c = document.getElementById("" + cop[i].id).getElementsByClassName("finger");

		for (var j = 0; j < b.length; j++) {
			if (b[j].getElementsByClassName("team").length == 0) {
				fingerToggle(a, c[j].id);
			}
		}
	}

	//return countMember();
}


/* Hide & See the each department */
function fingerToggle(coperation, finger) {

	var cop = document.getElementById(coperation);
	var fin = document.getElementById(finger);

	var sec = cop.getElementsByClassName("secName")[0];
	var con = $("#content" + finger.split("finger")[1]);


	var spl = finger.split("-");
	var spl2 = 0;

	if (fin.value == 1) {
		fin.style.backgroundColor = "rgb(0, 0, 0)";
		con.css("display", "none");
		(fin.value) --;
	} else if (fin.value == 0) {
		fin.style.backgroundColor = "rgb(255, 255, 255)";
		con.css("display", "block");
		con.css("width", "82px");
		(fin.value) ++;
	}

	for (var i = 1; i <= 3; i++) {
		spl2 += parseInt(document.getElementById(spl[0] + "-" + i).value);
	}

	if (spl2 == 3) {
		cop.style.width = '250px';
		sec.style.width = '250px';
	} else if (spl2 == 2) {
		cop.style.width = '170px';
		sec.style.width = '170px';
	} else if (spl2 <= 1) {
		cop.style.width = '120px';
		sec.style.width = '120px';
	}

	autoWidth();
}


/* Determine organization's width automatically according to the number of content */
function autoWidth() {
	var cor = document.getElementsByClassName("divCo").length;
	var maxWidth = (cor * 260) + 50;
	var orgWidth = document.getElementsByClassName("finger");
	var fingerCount = 0;
	var reverseCount = 0;

	for (var i = 0; i < orgWidth.length; i++) {
		fingerCount += parseInt(orgWidth[i].value);
	}
	reverseCount = orgWidth.length - fingerCount;
	org.style.width = maxWidth - (reverseCount * 75) + "px";
}

/* Determine organization's height automatically according to the number of team and staff */
function autoHeight() {
	var max = 0;
	var cot = org.getElementsByClassName("content");

	for (var i = 0; i < cot.length; i++) {
		var id = cot[i].id;
		var a = document.getElementById(id).getElementsByClassName("team").length;
		var b = document.getElementById(id).getElementsByClassName("btnName").length;

		if (max < (a * 2) + b) {
			max = (a * 2) + b;
		}
	}
	org.style.height = 120 + (max * 21) + 40 + "px";
	$(".secName").css("height", (max * 21) + 40 + "px");
}


/* Change size of toggle button with corporation name */
function coToggle(divCo) {

	var div = document.getElementById(divCo);
	var button = div.getElementsByClassName("btnCo")[0];
	var section = div.getElementsByClassName("secName")[0];
	var fingers = div.getElementsByClassName("fingers")[0];
	var fin = fingers.children;

	var f1 = parseInt(document.getElementById(fin[0].id).value);
	var f2 = parseInt(document.getElementById(fin[1].id).value);
	var f3 = parseInt(document.getElementById(fin[2].id).value);
	var count = f1 + f2 + f3;

	if (button.value == 1) {
		button.value = 0;
		div.style.width = "80px";
		section.style.display = "none";
		fingers.style.visibility = 'hidden';
	} else {
		button.value = 1;
		fingers.style.visibility = 'visible';

		if (count == 0) {
			div.style.width = "80px";
			section.style.width = "80px";
			section.style.display = "flex";
		} else if (count == 1) {
			div.style.width = "120px";
			section.style.width = "120px";
			section.style.display = "flex";
		} else if (count == 2) {
			div.style.width = "170px";
			section.style.width = "170px";
			section.style.display = "flex";
		} else if (count == 3) {
			div.style.width = "250px";
			section.style.width = "250px";
			section.style.display = "flex";
		}
	}
}


/* Header controller */
$(window).scroll(function () {
	var sc = $(window).scrollTop();
	var head = $("header");
	var menu = $(".menu");

	if (sc > 20) {
		head.addClass("small");
		head.css("height", "25px");
		menu.css("margin-top", "3px");
		menu.css("font-size", "15px");
	} else {
		head.removeClass("small");
		head.css("height", "35px");
		menu.css("margin-top", "5px");
		menu.css("font-size", "18px");
	}
});


/* Toggle Button for Search */
function showSearch() {
	var sBar = document.getElementById("searchSection").style.visibility;

	if (sBar == "visible") {
		document.getElementById("search").style.backgroundColor = "#dddddd";
		document.getElementById("searchSection").style.visibility = "hidden";
	} else {
		document.getElementById("search").style.backgroundColor = "#000000";
		document.getElementById("searchSection").style.visibility = "visible";
	}
}


/* Search Function */
function search() {
	var input = $('.searchInput').val();
	var names = document.getElementById("body").getElementsByClassName("btnName");

	for (var i = 0; i < names.length; i++) {
		var list = names[i].innerHTML.split(" ")[0];

		if (input == list) {
			$(names[i]).addClass("searched");

			if (names[i].offsetTop > 500) {
				$('html, body').animate({
					scrollTop: names[i].offsetTop
				}, 100);
			}
			if (names[i].offsetLeft > 1000) {
				$('html, body').animate({
					scrollLeft: names[i].offsetLeft
				}, 100);
			}
		} else {
			$(names[i]).removeClass("searched");
		}
	}
}


/* Execute a search function when the user release a enter key */
var input = document.getElementById("searchInput");

input.addEventListener("keyup", function (event) {
	event.preventDefault();
	if (event.keyCode === 13) {
		search();
	}
});


var zoomCount = 0;

/* Zoom In and Zoom Out Function */
function Zoom(type) {

	zoomCount += type;

	if (zoomCount >= 2) {
		zoomCount = 2;
	} else if (zoomCount <= 0) {
		zoomCount = 0;
	}

	if (zoomCount == 0) {
		org.style.marginLeft = "0";
		org.style.marginTop = "10px";
		org.style.transform = "scale(1.0)";
	} else if (zoomCount == 1) {
		org.style.marginLeft = "110px";
		org.style.marginTop = "50px";
		org.style.transform = "scale(1.1)";

	} else if (zoomCount == 2) {
		org.style.marginLeft = "220px";
		org.style.marginTop = "100px";
		org.style.transform = "scale(1.2)";
	}
}

var summaryCount = 0;

/* 인원 현황 버튼 */
function summary() {
	if (summaryCount == 0) {
		document.getElementById("table1").style.visibility = "visible";
		document.getElementById("table2").style.visibility = "visible";
		document.getElementById("summary").style.backgroundColor = "#000000";
		summaryCount++;
	} else {
		document.getElementById("table1").style.visibility = "hidden";
		document.getElementById("table2").style.visibility = "hidden";
		document.getElementById("summary").style.backgroundColor = "#dddddd";
		summaryCount--;
	}
}


/* Open info-modal */
function openFirstModal() {
	$("#infoModal").addClass("vivify pullUp");
	$("#infoModal").modal({
		backdrop: false,
		target: '#infoModal'
	})
}


/* Open large-modal */
function openSecondbModal() {
	$("#infoModal").removeClass("vivify pullUp");
	$('#infoModal').modal('hide');
	$('#largeModal').modal({
		backdrop: false,
		target: '#largeModal'
	});
}


/* Close the large-modal and return to info-modal */
function backToFirst() {
	$("#largeModal").modal('hide');
	$("#largeModal").on('hidden.bs.modal', function () {
		$('#infoModal').modal('show');
	});
}


/* Toggle button for detail section in info-modal */
function showInfo() {
	var hide = document.getElementById("hiddenInfo1").style.visibility;

	if (hide == "visible") {
		document.getElementById("hiddenInfo1").style.visibility = "hidden";
		document.getElementById("hiddenInfo2").style.visibility = "hidden";
	} else {
		document.getElementById("hiddenInfo1").style.visibility = "visible";
		document.getElementById("hiddenInfo2").style.visibility = "visible";
	}
}


/* Get staff's infomation from database */
function getdata() {
	//	var xhttp = new XMLHttpRequest();
	//	var dataObject;
	//
	//	xhttp.onreadystatechange = function () {
	//
	//		if (xhttp.readyState == 4 && xhttp.status == 200) {
	//			dataObject = JSON.parse(xhttp.responseText);
	//
	//			document.getElementById("info0").src = "/images/" + dataObject[0].photo + ".png";
	//			document.getElementById("info1").value = dataObject[0].name;
	//			document.getElementById("info2").value = dataObject[0].position;
	//			document.getElementById("info3").value = dataObject[0].empid;
	//			document.getElementById("info4").value = dataObject[0].nameen;
	//			document.getElementById("info5").value = dataObject[0].department;
	//			document.getElementById("info6").value = dataObject[0].phone;
	//			document.getElementById("info7").value = dataObject[0].gender;
	//			document.getElementById("info8").value = dataObject[0].job;
	//			document.getElementById("info9").value = dataObject[0].email;
	//			document.getElementById("info10").value = dataObject[0].nationality;
	//			document.getElementById("info11").value = dataObject[0].skill;
	//			document.getElementById("info12").value = dataObject[0].religion;
	//			document.getElementById("info13").value = dataObject[0].edate;
	//			document.getElementById("info14").value = dataObject[0].bdate;
	//			document.getElementById("info15").value = dataObject[0].contract;
	//		}
	//	};
	//
	//	xhttp.open("GET", "http://127.0.0.1:3000/ab", true);
	//	xhttp.send();
}

//setTimeout(fingerCheck, 1500);
