//table_view.js

Ti.include('record_db.js');

var db = new RecordDB();
var records = db.findAll();

var win = Ti.UI.currentWindow;

var meats = "[";
var vegetables = "[";
var carbs = "[";
var days = "[";
var meat_mean;
var vegetable_mean;
var carb_mean;
if (records.length > 0) {
	var meat_sum = 0;
	var vegetable_sum = 0;
	var carb_sum = 0;
	for (i = records.length-1; i >= 0; i--) {
		var Y = String(records[i].y_m_d).slice(0,4);
		var M = String(records[i].y_m_d).slice(4,6);
		var D = String(records[i].y_m_d).slice(6,8);
		var time = new Date(Y, M-1, D);
		meats = meats + "[" + time.getTime() +","+records[i].meat_val+"],";
		vegetables = vegetables + "[" + time.getTime() +","+records[i].vegetable_val+"],";
		carbs = carbs + "[" + time.getTime() +","+records[i].carb_val+"],";
		days = days + time.getTime() + ",";
		
		meat_sum += records[i].meat_val;
		vegetable_sum += records[i].vegetable_val;
		carb_sum +=  records[i].carb_val;
	} 
	meats = meats + "]"; vegetables = vegetables + "]"; carbs = carbs + "]"; days = days + "]";
	meat_mean = meat_sum / records.length;
	vegetable_mean = vegetable_sum / records.length;
	carb_mean = carb_sum / records.length;
	// Titanium.API.info(meats);
	// var graphWindow = Ti.UI.createWindow({
		// url: 'plot_window.js',
		// carbs: carbs,
		// days: days
	// }
	// );
	// Ti.UI.currentTab.open(graphWindow);
}

//横グラフUI
var webview = Ti.UI.createWebView({
	top:0,
	height:300,
	backgroundColor:"#fff",
	url:"graph.html"
});
webview.addEventListener('load', function(){
	webview.evalJS('meats =' + meats + ';');
	webview.evalJS('vegetables =' + vegetables + ';');
	webview.evalJS('carbs =' + carbs + ';');
	webview.evalJS('days =' +  days + ';');
	webview.evalJS('setting.xaxis.ticks = days;');
	webview.evalJS('plotWithOptions();');//このタイミングではなぜか実行できない
});
var graphview = Titanium.UI.createView({
    backgroundColor: "#ff0",
    // opacity: 1,
    top: 0,
    left: 0,
    width: 320
    // layout: "vertical"
});

var imagePostButton = Titanium.UI.createButton({
	top:315, left:10, height:25, width:70,
	title:"post"
});
imagePostButton.addEventListener('click', function(){
	webview.evalJS(
        'var image = postCanvas.toDataURL();'
        +'Titanium.App.fireEvent( "postImage", { image: image } );'
	);
});
var stackButton = Titanium.UI.createButton({
	top:315, left:90, height:25, width:70,
	title:"stack"
});
var stack_toggle = true;
stackButton.addEventListener("click", function(){
	if(stack_toggle){
		stack_toggle = null;
	} else {
		stack_toggle = true;
	}
    webview.evalJS('stack = ' + stack_toggle + ';');
    webview.evalJS('setting.series.stack = stack;');
    webview.evalJS('plotWithOptions();');
});
var graphTypeButton = Titanium.UI.createButton({
	top:315, left:170, height:25, width:70,
	title:"type"
});
var typeNum = 1;
graphTypeButton.addEventListener("click", function(){
	typeNum++;
	if(typeNum > 3) typeNum = 1;
	var lines, steps, bars;
	switch(typeNum){
		case 1:
			lines = true;
			steps = false;
			bars = false;
			break;
		case 2:
			lines = true;
			steps = true;
			bars = false;
			break;
		case 3:
			lines = false;
			steps = false;
			bars = true;
			break;
	}
	webview.evalJS(
		'setting.series.lines.show = ' + lines + ';'
	    +'setting.series.lines.steps = ' + steps + ';'
	    +'setting.series.bars.show = ' + bars + ';'
	);
	webview.evalJS('plotWithOptions();');
});
graphview.add(imagePostButton);
graphview.add(stackButton);
graphview.add(graphTypeButton);
graphview.add(webview);
graphview.hide();


//円グラフUI
// var pieview = Titanium.UI.createView({
    // backgroundColor: "#f00",
    // // opacity: 1,
    // top: 0,
    // left: 0,
    // width: 320,
    // height: 370
    // // layout: "vertical"
// });
var pie_webview = Ti.UI.createWebView({
	top:0,
	height:370,
	backgroundColor:"#fff"
});
pie_webview.addEventListener('load', function(){
	pie_webview.evalJS('meat_mean =' + meat_mean + ';');
	pie_webview.evalJS('vegetable_mean =' + vegetable_mean + ';');
	pie_webview.evalJS('carb_mean =' + carb_mean + ';');
	pie_webview.evalJS("plotPieWithOptions();");
});
pie_webview.url = "pieGraph.html";

// pieview.add(pie_webview);


// NavBarに配置するインスタンス
var tabbar = Titanium.UI.createTabbedBar({
	width:150,
	backgroundColor:'#orange',
    labels: ['List', 'Graph'],
    style: Titanium.UI.iPhone.SystemButtonStyle.BAR,
    index:0
});
// 現在のwindowから非表示→表示
Titanium.UI.currentWindow.showNavBar();

//設定ボタン
var settingButton = Ti.UI.createButton({
	systemButton: Titanium.UI.iPhone.SystemButton.INFO_LIGHT
});
settingButton.addEventListener('click', function () {
	var recordWindow = Ti.UI.createWindow({
		url: 'setting.js',
		title:'Setting',
    	barColor:'#orange',
		backgroundColor:'#fff'
	});
	Ti.UI.currentTab.open(recordWindow);
});
win.rightNavButton = settingButton;

// Ti.App.addEventListener('update_row', function(record) {
	// Titanium.API.debug("update_row");
	// updateCallback(record);
// });
// 
// function updateCallback(record) {
	// // db.update(record)
	// db.updateByYMD(record)
	// records = db.findAll();
	// updateRecord(records);
// }

// Navbarの中央に配置
Titanium.UI.currentWindow.setTitleControl(tabbar);
tabbar.addEventListener('click', function(e)
{
	if (this.index == 0)
	{
		pie_webview.show();
		graphview.hide();
	}
	else if (this.index == 1)
	{
		pie_webview.hide();
		graphview.show();
		webview.evalJS('plotWithOptions();');
	}
});

//webviewと連携
// Titanium.App.addEventListener("webAction", function(e){
	// alert(e.text);
// });

Titanium.App.addEventListener("postImage", function(e){
	// var f = e.image.read();
	var file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "images/carb.png");
	var blob = file.read();
	Ti.API.info("file:" + file);
	Ti.API.info("blob:" + blob);
    if ( Ti.Facebook.loggedIn ) {
    	Ti.API.info("you logined already!");
	    Ti.Facebook.requestWithGraphPath(
	        'me/photos',
	        {
	             message: "image post test",
	             picture: blob
	        },
	        "POST",
	        function(e) {
	            if (e.success) {
	                alert("Success" + e.result);
	            }
	        }
	    );
	} else {
		alert("not login yet!");
	}
});

win.add(pie_webview);
win.add(graphview);