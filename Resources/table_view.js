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
win.add(tableView);

function updateRecord (records) {
	var data = currentData = [];
	for (var i=0;i<records.length;i++) {
		var record = records[i];
		Ti.API.info("id:" + record.id);
		var row = Ti.UI.createTableViewRow({
			height: 'auto',
			layout: 'vertical',
			hasChild: true,
		});
		var titleLabel = Ti.UI.createLabel({
			width: 50,
			height: 'auto',
			left: 5,
			top: 5,
			fontSize: 8,
			fontWeight: 'bold',
			textAlign: 'right',
			color: '#2b4771'
		}
		);
		titleLabel.text = record.title;
		row.add(titleLabel);
		var titleUnit = Ti.UI.createLabel({
			width: 50,
			height: 'auto',
			left: 60,
			top: -titleLabel.height,
			fontSize: 8,
			fontWeight: 'bold',
			text: 'Kg',
			color: '#2b4771'
		}
		);
		row.add(titleUnit);
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