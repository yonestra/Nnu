//table_view.js

Ti.include('record_db.js');

var db = new RecordDB();
// var records = db.findAll();

var win = Ti.UI.currentWindow;
var data = [];
var tableView = Ti.UI.createTableView({
	data:data,
	editable: true
});
var listview = Titanium.UI.createView({
    backgroundColor: "#f00",
    // opacity: 1,
    top: 10,
    left: 10,
    width: 300,
    height: 400
    // layout: "vertical"
});
listview.add(tableView);

var webview = Ti.UI.createWebView({
	backgroundColor:"#fff"
});
webview.url = "graph.html";
var graphview = Titanium.UI.createView({
    backgroundColor: "#ff0",
    // opacity: 1,
    top: 0,
    left: 0,
    width: 320
    // layout: "vertical"
});
graphview.add(webview);
graphview.hide();

// NavBarに配置するインスタンス
var tabbar = Titanium.UI.createTabbedBar({
	width:200,
	backgroundColor:'#orange',
    labels: ['List', 'Graph'],
    style: Titanium.UI.iPhone.SystemButtonStyle.BAR,
    index:0
});
// 現在のwindowから非表示→表示
Titanium.UI.currentWindow.showNavBar();

win.add(listview);
win.add(graphview);

function updateRecord (records) {
	var data = currentData = [];
	for (var i=0;i<records.length;i++) {
		var record = records[i];
		// Ti.API.info("meat_val:" + record.meat_val);
		var row = Ti.UI.createTableViewRow({
			height: 'auto',
			layout: 'vertical',
			hasChild: true,
		});
		var meatLabel = Ti.UI.createLabel({
			width: 60,
			height: 'auto',
			left: 60,
			top: 5,
			fontSize: 8,
			fontWeight: 'bold',
			textAlign: 'left',
			color: '#2b4771'
		}
		);
		if(record.meat_val != null){
			meatLabel.text = "肉：" + record.meat_val;
		} else {
			meatLabel.text = "肉：" + 0;
		}
		row.add(meatLabel);
		var vegetableLabel = Ti.UI.createLabel({
			width: 60,
			height: 'auto',
			left: 130,
			top: -meatLabel.height,
			fontSize: 8,
			fontWeight: 'bold',
			textAlign: 'left',
			color: '#2b4771'
		}
		);
		if(record.vegetable_val != null){
			vegetableLabel.text = "菜:"+record.vegetable_val;
		} else {
			vegetableLabel.text = "菜:"+0;
		}
		row.add(vegetableLabel);
		var carbLabel = Ti.UI.createLabel({
			width: 60,
			height: 'auto',
			left: 200,
			top: -meatLabel.height,
			fontSize: 8,
			fontWeight: 'bold',
			textAlign: 'left',
			color: '#2b4771'
		}
		);
		if(record.carb_val != null){
			carbLabel.text = "菜:"+record.carb_val;
		} else {
			carbLabel.text = "菜:"+0;
		}
		row.add(carbLabel);
		var ymdLabel = Ti.UI.createLabel({
			width: 290,
			height: 'auto',
			left: 5,
			top: 5,
			fontSize: 6,
			textAlign: 'right'
		}
		);
		var Y = String(record.y_m_d).slice(0,3);
		var M = String(record.y_m_d).slice(4,5);
		var D = String(record.y_m_d).slice(6,7);
		ymdLabel.text = Y+"/"+M+"/"+D;
		row.add(ymdLabel);

		currentData.push(row);
	}
	tableView.setData(currentData);
}
// updateRecord(records);

function deleteCallback(index) {
	db.deleteOne(records[index]);
	records.db.findAll();
	updateRecord(records);
}

tableView.addEventListener('delete', function(e){
	deleteCallback(e.index);
});

//リスト項目追加ボタン
var addButton = Ti.UI.createButton({
	systemButton: Titanium.UI.iPhone.SystemButton.ADD
});
addButton.addEventListener(
'click', function () {
	var recordWindow = Ti.UI.createWindow({
		url: 'record_window.js',
		record:{at: new Date()},
		func: 'insert_row',
		title:'Record',
    	barColor:'#orange',
		backgroundColor:'#fff'
	});
	Ti.UI.currentTab.open(recordWindow);
});
win.rightNavButton = addButton;

Ti.App.addEventListener('insert_row', function(record) {
	Titanium.API.debug("insert_row");
	insertCallback(record);
});

function insertCallback(record) {
	db.insert(record);
	records = db.findAll();
	updateRecord(records);
}

//リスト項目更新
tableView.addEventListener(
'click', function(e) {
	var record = records[e.index];
	record.index = e.index;
	var recordWindow = Ti.UI.createWindow({
		url: 'record_window.js',
		record: record,
		func: 'update_row',
		title:'Record',
    	barColor:'#orange',
		backgroundColor:'#fff'
	});
	Ti.UI.currentTab.open(recordWindow);
});

Ti.App.addEventListener('update_row', function(record) {
	Titanium.API.debug("update_row");
	updateCallback(record);
});

function updateCallback(record) {
	// db.update(record)
	db.updateByYMD(record)
	records = db.findAll();
	updateRecord(records);
}

// Navbarの中央に配置
Titanium.UI.currentWindow.setTitleControl(tabbar);
tabbar.addEventListener('click', function(e)
{
	if (this.index == 0)
	{
		listview.show();
		graphview.hide();
	}
	else if (this.index == 1)
	{
		listview.hide();
		graphview.show();
	}
});