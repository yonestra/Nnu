// record.js
var win = Titanium.UI.currentWindow;



var listview = Titanium.UI.createView({
    backgroundColor: "#f00",
    // opacity: 1,
    top: 10,
    left: 10,
    width: 300,
    height: 400
    // layout: "vertical"
});
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

// RecordListオブジェクトとして諸機能を定義します。
var RecordList = {};
(function () {
	//--------------------------------------
	// ロジック部分
	//--------------------------------------
	// リクエストデータ取得
	RecordList.getJSON = function(params, successFunc, errorFunc) {
		var json = {
			Error: false,
			RecordInfo: {
				NumOfResult : 0,
				Item:[]
			}
		};
		// データベースファイルを開きます（ない場合、作成されます）
		var db = Titanium.Database.open('nnu');
		try {
			// RECORDSテーブルをSELECTします。
			var rows = db.execute('SELECT * FROM RECORDS ORDER BY UPDATED_ON DESC');
			var thisJSON = {
				id: "",
				title: "",
				// staple_vol: 0,
				// meet_vol: 0,
				// vegetable_vol: 0,
				// milk_vol: 0,
				// alcohol_vol: 0,
				// snack_vol: 0,
				date: "",
				time: "",
				update_on: ""
			}
			while(rows.isValidRow()) {
				// thisJSON.id = rows.fieldByName('id');
				thisJSON.title = rows.fieldByName('title');
				thisJSON.date = rows.fieldByName('date');
				thisJSON.time = rows.fieldByName('time');
				
				json.RecordInfo.Item.push(thisJSON);
				// json.RecordInfo.Item.push(JSON.parse(thisJSON));
				json.RecordInfo.NumOfResult++;
				rows.next();
			}
			// 走査が終わったらResultSetを閉じておきます。
			rows.close();
			rows = null;
		} catch(ex) {
			Titanium.API.info(ex);
			errorFunc(ex);
		}
		// 操作が終わったら後片付け
		db.close();
		db = null;
		// 結果を返す
		successFunc(json);
	};
	// RecordData表示
	RecordList.showRecordData = function(item) {
		var winRecordData = Titanium.UI.createWindow({
			title: '食事記録',
			backgroundColor:'#fff',
			url:'recordData.js',
			RecordData: item,
			owner: 'records'
		});
		winRecordData.addEventListener('close', function(e){
			loadRecordList();
		});
		Titanium.UI.currentTab.open(winRecordData, {
			animated:true
		})
	};
	
	//--------------------------------------
	// UI部分
	//--------------------------------------
	// 表示対象のTableView
	RecordList.tableView = Ti.UI.createTableView({
		top:0,
		bottom:0,
		editable:true,
		style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
		deleteButtonTitle:'削除する'
	});
	// ベースとなるTableViewRowを作成する
	RecordList.createTableViewRow = function() {
		var row = Titanium.UI.createTableViewRow();
		row.height = 100;
		row.hasDetail = true;
		row.className = 'datarow';
		return row;
	};
	// ラベルの作成を行う
	RecordList.createLabel = function(text, top, left, height, width, font) {
		var label = Titanium.UI.createLabel({
			text:   text,
			top:    top,
			left:   left,
			width:  width,
			height: height
		});
		if(font) {
			label.font = font;
		}
		return label;
	};
	// TableViewRowの構築
	RecordList.buildTableViewRow = function(item) {
		var row  = RecordList.createTableViewRow();
		var w    = RecordList.tableView.width;
		row.item = item;
		row.add(RecordList.createLabel(item.date, 8, 8, 16, w - 16, null));
		row.add(RecordList.createLabel(item.time, 40, 8, 'auto', 72, {
			fontFamily : 'DBLCDTempBlack',
			fontSize: 32
		}));
		row.add(RecordList.createLabel(item.title, 28, 84, 16, w - (84 + 8), {
			fontSize: 12
		}));
		// 行選択時にはショップデータウィンドウを表示する。
		row.addEventListener('click', function() {
			RecordList.showRecordData(item);
		});
		return row;
	};
	// TableViewのデータ構築を行う。
	RecordList.buildTableView = function(json, clear) {
		// エラーの時はなにもしない
		if(!json || !json.RecordInfo || json.Error) {
			return;
		}
		if(clear) {
			// 一旦中身をクリアする
			RecordList.tableView.data = [];
		}
		// 取得したデータを並べる
		for(var i = 0; i < json.RecordInfo.Item.length; i++) {
			RecordList.tableView.appendRow(
			RecordList.buildTableViewRow(json.RecordInfo.Item[i])
			);
		}
	};
})();
var loadRecordList = function() {
	// 状態取得時の処理
	// データ取得し、TableViewとして表示する。
	RecordList.getJSON({}, function(json) {
		Titanium.API.info(json);
		// クリアして新たに表示する。
		RecordList.buildTableView(json, true);
	}, function(message) {
		alert(message);
	}
	);
};
listview.add(RecordList.tableView);
RecordList.tableView.data = [{
	title: 'ンヌ'
}];
win.addEventListener('focus', function() {
	loadRecordList();
});
win.add(listview);
win.add(graphview);

// 削除ボタン実行時イベント
RecordList.tableView.addEventListener('delete', function(e) {
	// Rowのitemカスタムプロパティでキーを取得する。
	var date = e.rowData.item.date;
	// Titanium.API.info("e.rowData:" + e.rowData);
	// Titanium.API.info("e.rowData.item:" + e.rowData.item);
	// Titanium.API.info("e.rowData.item.date:" + e.rowData.item.date);
	// Titanium.API.info("date:" + date);
	// データベースファイルを開きます。
	var db = Titanium.Database.open('nnu');
	try {
		db.execute(
		"DELETE FROM RECORDS WHERE DATE = ?", date
		);
		Titanium.API.info('削除された行数 = ' + db.rowsAffected);
	} catch(ex) {
		Titanium.API.info(ex);
	}
	// 操作が終わったら後片付け
	db.close();
	db = null;

	// データが0件になったときにはダミーデータを表示する
	if(e.section.rowCount == 0) {
		RecordList.tableView.data = [{
			title: 'お気に入りデータがありません。'
		}
		];
	}
});

// // 検索条件に基づき再検索
// win.leftNavButton = (function() {
	// var refreshButton = Titanium.UI.createButton({
		// systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
	// });
	// refreshButton.addEventListener('click', function() {
		// loadRecordList();
	// });
	// return refreshButton;
// })();
