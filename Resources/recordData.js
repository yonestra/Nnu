// record.js
var win = Titanium.UI.currentWindow;


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
			while(rows.isValidRow()) {
				var thisJSON = rows.fieldByName('JSON');
				json.RecordInfo.Item.push(JSON.parse(thisJSON));
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
	// 食事情報表示
	RecordList.showRecordData = function(item) {
		var winRecordData = Titanium.UI.createWindow({
			title: '食事記録',
			backgroundColor:'#fff',
			url:'Recorddata.js',
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
		row.add(RecordList.createLabel(item.RestaurantName, 8, 8, 16, w - 16, null));
		row.add(RecordList.createLabel(item.TotalScore, 40, 8, 'auto', 72, {
			fontFamily : 'DBLCDTempBlack',
			fontSize: 32
		}));
		row.add(RecordList.createLabel(item.Category, 28, 84, 16, w - (84 + 8), {
			fontSize: 12
		}));
		row.add(RecordList.createLabel(item.Station, 44, 84, 16, w - (84 + 8), {
			fontSize: 12
		}));
		if(item.LunchPrice) {
			row.add(RecordList.createLabel('昼：' + item.LunchPrice, 60, 84, 16, w - (84 + 8), {
				fontSize: 12
			}));
		}
		if(item.DinnerPrice) {
			row.add(RecordList.createLabel('夜：' + item.DinnerPrice, 76, 84, 16, w - (84 + 8), {
				fontSize: 12
			}));
		}
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
		// クリアして新たに表示する。
		RecordList.buildTableView(json, true);
	}, function(message) {
		alert(message);
	}
	);
};
win.add(RecordList.tableView);
RecordList.tableView.data = [{
	title: '食べナビ'
}
];
win.addEventListener('focus', function() {
	loadRecordList();
});
// 削除ボタン実行時イベント
RecordList.tableView.addEventListener('delete', function(e) {
	// Rowのitemカスタムプロパティでキーを取得する。
	var rcd = e.rowData.item.Rcd;

	// データベースファイルを開きます。
	var db = Titanium.Database.open('tabenavi');
	try {
		db.execute(
		"DELETE FROM FAVORITES WHERE RCD = ?", rcd
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
if(Titanium.Platform.osname === 'android') {
	var activity = Titanium.Android.currentActivity;
	if(activity) {
		activity.onCreateOptionsMenu = function(e) {
			var menu = e.menu;
			var menuItem = menu.add({
				title: "再読込"
			});
			menuItem.setIcon("./dark/dark_refresh.png");
			menuItem.addEventListener("click", function(e) {
				loadRecordList();
			});
		};
	}
} else {
	// 検索条件に基づき再検索
	win.leftNavButton = (function() {
		var refreshButton = Titanium.UI.createButton({
			systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
		});
		refreshButton.addEventListener('click', function() {
			loadRecordList();
		});
		return refreshButton;
	})();
}