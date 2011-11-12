//table_view.js

Ti.include('record_db.js');

var db = new RecordDB();
var records = db.findAll();

var win = Ti.UI.currentWindow;
var data = [];
var tableView = Ti.UI.createTableView({
	data:data,
	editable: true
});
// win.add(tableView);
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
// var listlabel = Titanium.UI.createLabel({
	// text:"list",
	// color:'#999',
	// font:{fontSIze:20}
// });
// listview.add(listlabel);

var graphview = Titanium.UI.createView({
    backgroundColor: "#ff0",
    // opacity: 1,
    top: 10,
    left: 10,
    width: 300,
    height: 400
    // layout: "vertical"
});
var graphlabel = Titanium.UI.createLabel({
	text:"graph",
	color:'#999',
	font:{fontSIze:20}
});
graphview.add(graphlabel);
graphview.hide();

// NavBarに配置するインスタンス
var tabbar = Titanium.UI.createTabbedBar({
    labels: ['List', 'Graph'],
    style: Titanium.UI.iPhone.SystemButtonStyle.BAR,
    index:0
});
// 現在のwindowから非表示→表示
Titanium.UI.currentWindow.showNavBar();
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

win.add(listview);
win.add(graphview);

function updateRecord (records) {
	var data = currentData = [];
	for (var i=0;i<records.length;i++) {
		var record = records[i];
		Ti.API.info("meet_val:" + record.meet_val);
		var row = Ti.UI.createTableViewRow({
			height: 'auto',
			layout: 'vertical',
			hasChild: true,
		});
		var titleLabel = Ti.UI.createLabel({
			width: 100,
			height: 'auto',
			left: 60,
			top: 5,
			fontSize: 8,
			fontWeight: 'bold',
			textAlign: 'left',
			color: '#2b4771'
		}
		);
		titleLabel.text = record.title;
		row.add(titleLabel);
		var meetLabel = Ti.UI.createLabel({
			width: 100,
			height: 'auto',
			left: 160,
			top: -titleLabel.height,
			fontSize: 8,
			fontWeight: 'bold',
			textAlign: 'left',
			color: '#2b4771'
		}
		);
		if(record.meet_val != null){
			meetLabel.text = "meet:"+record.meet_val;
		}
		row.add(meetLabel);
		var timeSelectLabel = Ti.UI.createLabel({
			width: 50,
			height: 'auto',
			left: 5,
			top: -meetLabel.height,
			fontSize: 8,
			fontWeight: 'bold',
		}
		);
		switch(record.time_select){
			case 0:
				timeSelectLabel.text = "朝食";
				timeSelectLabel.color = "red"; 
				break;
			case 1:
				timeSelectLabel.text = "昼食";
				timeSelectLabel.color = "blue"; 
				break;
			case 2:
				timeSelectLabel.text = "夕食";
				timeSelectLabel.color = "green"; 
				break;
			case 3:
				timeSelectLabel.text = "間食";
				timeSelectLabel.color = "pink"; 
				break;
		}
		row.add(timeSelectLabel);
		var dateLabel = Ti.UI.createLabel({
			width: 290,
			height: 'auto',
			left: 5,
			top: 5,
			fontSize: 6,
			textAlign: 'right'
		}
		);
		dateLabel.text = record.at.toDateString();
		row.add(dateLabel);

		currentData.push(row);
	}
	tableView.setData(currentData);
}
updateRecord(records);

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
		record:{title:'', at: new Date()},
		func: 'insert_row',
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
		backgroundColor:'#fff'
	}
	);
	Ti.UI.currentTab.open(recordWindow);
});

Ti.App.addEventListener('update_row', function(record) {
	Titanium.API.debug("update_row");
	updateCallback(record);
});

function updateCallback(record) {
	db.update(record)
	records = db.findAll();
	updateRecord(records);
}