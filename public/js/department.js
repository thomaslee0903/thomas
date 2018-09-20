//시작할때 전부 로드
window.onload = defaultSetting;

var nodeDataArray1 = [];
var nodeDataArray2 = [];
var nodeDataArray3 = [];

var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function () {

	if (xhttp.readyState == 4 && xhttp.status == 200) {
		dataObject = JSON.parse(xhttp.responseText);


		for (var i = 0; i < dataObject.length; i++) {

			if (dataObject[i].TEAM == "SALES") {
				var add = new Object({
					key: dataObject[i].EMPID,
					boss: dataObject[i].DREPORTER,
					name: dataObject[i].NAME + " " + dataObject[i].POSITION
				});
				nodeDataArray1.push(add);
			} else if (dataObject[i].TEAM == "PRODUCTION") {
				var add = new Object({
					key: dataObject[i].EMPID,
					boss: dataObject[i].DREPORTER,
					name: dataObject[i].NAME + " " + dataObject[i].POSITION
				});
				nodeDataArray2.push(add);
			} else if (dataObject[i].TEAM == "MANAGEMENT") {
				var add = new Object({
					key: dataObject[i].EMPID,
					boss: dataObject[i].DREPORTER,
					name: dataObject[i].NAME + " " + dataObject[i].POSITION
				});
				nodeDataArray3.push(add);
			}

		}

	};
}

xhttp.open("POST", "http://203.113.151.215:8080/department/getReporter", true);
xhttp.send();

//************************************************** 여기부터 조직도함수시작 **********************************************
function defaultSetting() {

	setTimeout(organization('salesDiv', 'salesOverview', nodeDataArray1, '#5595d6', '#3F91C4'), 500);
	setTimeout(organization('productDiv', 'productOverview', nodeDataArray2, '#3a9d8b', '#3B505E'));
	setTimeout(organization('manageDiv', 'manageOverview', nodeDataArray3, '#d75c5c', '#13846E'));

}

//부서별 조직도 
function organization(departDiv, departOverview, nodeDataArray, buttonColor, buttonHoverColor) {
	//if (window.goSamples) goSamples();
	var $ = go.GraphObject.make;

	myDiagram =
		$(go.Diagram, departDiv, {
			initialContentAlignment: go.Spot.TopLeft,
			initialScale: 0.95,
			initialViewportSpot: go.Spot.TopCenter,
			"toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,

			layout: $(go.TreeLayout, {

				treeStyle: go.TreeLayout.StyleLastParents,
				//alignment: go.TreeLayout.AlignmentStart,
				angle: 90,
				layerSpacing: 80,
				alternateAngle: 0,
				alternateAlignment: go.TreeLayout.AlignmentStart,
				alternateNodeIndent: 15,
				alternateNodeIndentPastParent: 1,
				alternateNodeSpacing: 5,
				alternateLayerSpacing: 40,
				alternateLayerSpacingParentOverlap: 1,
				alternatePortSpot: new go.Spot(0.008, 1, 20, 0),
				alternateChildPortSpot: go.Spot.Left,
			})
		});

	/*보스랑 이어주기*/
	function theInfoTextConverter(info) {
		var str = "";
		if (info.title) str += "Title: " + info.title;
		if (info.headOf) str += "\n\nHead of: " + info.headOf;
		if (typeof info.boss === "number") {
			var bossinfo = myDiagram.model.findNodeDataForKey(info.boss);
			if (bossinfo !== null) {
				str += "\n\nReporting to: " + bossinfo.name;
			}
		}
		return str;
	}

	//다이아그램 템플릿  -- 기본
	myDiagram.nodeTemplate =
		$(go.Node, "Horizontal", {
				isTreeExpanded: false
			},
			$(go.Panel, "Auto",
				$(go.Shape, "RoundedRectangle", {
						stroke: "rgba(99,95,92,.5)",
						strokeWidth: 0,
						cursor: "pointer",
					},

					new go.Binding("fill", "isHighlighted", function (h) {
						return h ? "#F44336" : "#efefef";
					}).ofObject()),

				$(go.TextBlock, {
						maxSize: new go.Size(160, NaN),
						margin: new go.Margin(8, 10, 8, 10),
						font: "500 16px NanumSquare, sans-serif",
						//stroke:"white",
						alignment: go.Spot.Top
					},
					new go.Binding("text", "name")),
			),

			//트리 버튼 + -
			$("TreeExpanderButton", {
				alignment: go.Spot.Center,
				alignmentFocus: go.Spot.Top,
				width: 25,
				height: 25,
				"ButtonIcon.width": "8",
				"ButtonIcon.height": "8",
				"ButtonIcon.stroke": "white",
				"ButtonIcon.strokeWidth": 1.5,
				"ButtonBorder.figure": "Ellipse",
				"ButtonBorder.fill": "rgba(100,100,100,0.7)",
				"ButtonBorder.stroke": null,
				"_buttonFillOver": buttonHoverColor,
				"_buttonStrokeOver": null,
			})
		);

	//트리 접어두기 기능
	myDiagram.addDiagramListener("InitialLayoutCompleted", function (e) {
		e.diagram.findTreeRoots().each(function (r) {
			r.expandTree(6);
		});
	});
	//더블번클릭했을 때 이벤트 리스너 
	myDiagram.addDiagramListener("ObjectDoubleClicked", function (ev) {
		console.log(ev.subject.part.data.name.split(" ")[0]);
		departModal();
	});

	//링크 - 회색	 화살표없는 선 
	myDiagram.linkTemplate =
		$(go.Link, go.Link.Orthogonal, {
				corner: 5,
				selectable: true
			},
			$(go.Shape, {
				strokeWidth: 2,
				stroke: "#E5E5E5"
			}));

	//			링크 - 회색 화살표있는 선 
	//			myDiagram.lilnkTemplate =
	//				$(go.Link, go.Link.Bezier,
	//			    	$(go.Shape, {strokeWidth:1.5}),
	//			        $(go.Shape, {toArrow:"Standard", stroke:"#ccc"})
	//			     );

	myDiagram.model =
		$(go.TreeModel, {
			nodeParentKeyProperty: "boss",
			nodeDataArray: nodeDataArray
		});

	myDiagram.model.undoManager.isEnabled = true;

	myOverview = $(go.Overview, departOverview, {
		observed: myDiagram,
		contentAlignment: go.Spot.Center
	});

	myOverview.box.elt(0).stroke = "#A8A8A8";
}

//모달 함수
//더블클릭을 하면 이게 실행된다
function departModal() {
	$('.modal').fadeIn();
	$('.close-modal').click(function () {
		$('.modal').fadeOut();
	});
}

function searchDiagram() {
	var input = document.getElementById("mySearch");
	if (!input) return;
	input.focus();

	myDiagram.startTransaction("highlight search");

	if (input.value) {
		var regex = new RegExp(input.value, "i");
		var results = myDiagram.findNodesByExample({
			name: regex
		});
		myDiagram.highlightCollection(results);
		if (results.count > 0) myDiagram.centerRect(results.first().actualBounds);
	} else {
		myDiagram.clearHighlighteds();
	}
	myDiagram.commitTransaction("highlight search");
}


$(document).ready(function () {
	//처음 창 켰을 때 크기 변하기
	$('#salesDiv').css('width', $(window).width());
	$('#productDiv').css('width', $(window).width());
	$('#manageDiv').css('width', $(window).width());
	$('#salesDiv').css('height', $(window).height() - $('#title1').height() - $("header").height());
	$('#productDiv').css('height', $(window).height() - $('#title1').height() - $("header").height());
	$('#manageDiv').css('height', $(window).height() - $('#title1').height() - $("header").height());

	//창 사이즈 바꿨을 때 자동으로 크기 변하기
	$(window).resize(function () {
		$('#salesDiv').css('width', $(window).width());
		$('#productDiv').css('width', $(window).width());
		$('#manageDiv').css('width', $(window).width());
	});
});


/*헤더 작아지게*/
$(window).scroll(function () {
	var sc = $(window).scrollTop();
	var head = $("header");
	var menu = $(".menu");

	if (sc > 20) {
		head.addClass("small");
		head.css("height", "25px");
		menu.css("margin-top", "2px");
	} else {
		head.removeClass("small");
		head.css("height", "35px");
		menu.css("margin-top", "5px");
	}
});



<!--모달 안의 내용 자바스크립트-->

jQuery(document).ready(function ($) {

	//SWITCH FROM TO TO FROM
	bouncy_filter($('.dep-container'));

	function bouncy_filter(container) {
		container.each(function () {
			var dep_table = $(this);
			var filter_list_container = dep_table.children('.dep-switcher'),
				filter_radios = filter_list_container.find('input[type="radio"]'),
				dep_table_wrapper = dep_table.find('.dep-wrapper');

			//store dep table items
			var table_elements = {};

			var cnt = 1;

			filter_radios.each(function () { //각각의 filter_radios
				var filter_type = $(this).val(); //filter type에 filter_radios의 
				table_elements[filter_type] = dep_table_wrapper.find('li[data-type="' + filter_type + '"]');
			});

			//detect input change event
			filter_radios.on('change', function (event) {

				event.preventDefault();

				//어느 input이 체크되어있는지
				//detect which radio input item was checked
				var selected_filter = $(event.target).val();

				//선택된 라디오에 
				//give higher z-index to the dep table items selected by the radio input
				show_selected_items(table_elements[selected_filter]);

				//rotate each dep-wrapper 
				//at the end of the animation hide the not-selected dep tables and rotate back the .dep-wrapper
				//이 브라우저가 css를 담당허면
				if (!Modernizr.cssanimations) {
					hide_not_selected_items(table_elements, selected_filter);
					dep_table_wrapper.removeClass('is-switched');
				} else {
					//텍스트 바꾸기
					if (cnt % 2 == 1) {
						$('.toggleTitle').text("INDIRECT REPORT FROM.");

					} else if (cnt % 2 == 0) {
						$('.toggleTitle').text("INDIRECT REPORT TO.");
					}

					cnt++;

					//세개의 칸 각각에 is-switched클래스를 추가한다. (뒤집는 토글)
					dep_table_wrapper.addClass('is-switched').eq(0).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function () {
						hide_not_selected_items(table_elements, selected_filter);
						//is-switched클래스를 삭제한다
						dep_table_wrapper.removeClass('is-switched');
						//change rotation direction if .dep-list has the .bounce-invert class
						//bounce-invert클래스를 가지고 있으면 true
						if (dep_table.find('.dep-list').hasClass('bounce-invert')) dep_table_wrapper.toggleClass('reverse-animation');
					});

				}
			});
		});
	}

	//선택된 요소에 is-selected를 넣어준다.
	function show_selected_items(selected_elements) {
		selected_elements.addClass('is-selected');
	}

	function hide_not_selected_items(table_containers, filter) {
		$.each(table_containers, function (key, value) {
			if (key != filter) {
				$(this).removeClass('is-visible is-selected').addClass('is-hidden');

			} else {
				$(this).addClass('is-visible').removeClass('is-hidden is-selected');
			}
		});
	}
});



<!--동적으로 리스트 추가하기-->

/*배열*/
var salesArray = ["경윤경 차장", "조소미 대리", "전익용 상무", "이지현 이사", "나상인 대리", "김지민 이사", "김상혁 부장", "이정이 과장", "고성안 사원", "이종현 과장", "빈우진 이사", "권혁구 부장", "진정식 차장", "오세창 과장", "안상현 부장", "박병규 부장", "황윤심 차장", "성하경 차장", "강상구 차장", "이용휘 사원", "FRANCIS", "김지원 사원", "ARDIN", "LIZA", "김태엽 부장", "이예슬 사원", "윤미식 부장", "NOEL", "권혁구 부장", "김연호 부장", "안병훈 대리", "정좋은 과장", "김이영 대리", "곽태숙 과장", "박소영 대리", "박진규 과장", "장진오 부장", "김경태 과장", "이용휘 사원", "최용준 부장", "권소영 차장", "H.QIANJUN", "송이슬 과장"];

var productionArray = ["강성국 이사", "남길영 차장", "GRACE", "최창용 차장", "D.SHOUHUA", "이윤석 부장", "김무성 사원", "이종학 계장", "공진우 계장", "손형이 계장", "김도경 과장", "조인기 사원", "신우창 사원", "박순태 이사", "김빛솔 사원", "표기원 계장", "Z.ZHITAO", "김성철 사원", "강성찬 부장", "D.SHOUY", "오성용 부장", "김영상 사원", "LI BING", "김태영 부장", "신용욱 과장", "조상식 부장", "오승현 사원", "박상완 부장", "김도형 사원", "HE,XINGGUI", "주기현 사원", "ZHAO,GUIXI", "장신영 사원", "김성용 부장", "VERGUAN", "이호영 부장", "이재홍 계장", "JENNYLYN", "JOSEPHINE", "JOEL", "고재욱 사원", "ALINE"];

var managementArray = ["김승현 부장", "이병훈 사원", "장기태 차장", "임화영 과장", "김소연", "지성휘 부장", "NAVEEN", "김지연", "장우진 사원", "전형국 차장", "전병익 부장", "이은태 부장", "이상풍 상무", "송인숙 과장", "김혜숙 과장", "이창수 부장", "김진오 주임", "이규설 과장", "유미경 계장", "장현홍 부장", "이병정 차장", "신동진 차장", "김진희 과장", "도설 대리", "전민성 차장", "신성환 주임", "윤영환 과장", "서학 주임", "한동철 차장", "김순단", "강민호 차장"];

/*함수*/
function callList(eplyList, nameArray) {
	//사람 하나씩 추가
	for (var i = 0; i < nameArray.length; i++) {
		$(eplyList).append(" <li>" + nameArray[i] + "</li>");
	}
}

/*함수 호출*/
callList('.eplyList1', salesArray)
callList('.eplyList2', productionArray)
callList('.eplyList3', managementArray)
