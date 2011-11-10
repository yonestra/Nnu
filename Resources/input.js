// input.js
var win = Titanium.UI.currentWindow;

// 引き継ぎデータ
// var item = win.inputData;
 
// InputDataオブジェクト
var InputData = {};
(function() {
	//--------------------------------------
	// ロジック部分
	//--------------------------------------
	InputData.addRecord = function(title, date, time, id) {
		var dialog = Titanium.UI.createAlertDialog({
			title: '確認',
			message: '登録しますか？',
			buttonNames: ['はい','いいえ']
		})
		dialog.addEventListener('click', function(e) {
			// Titanium.API.info("datetime('now'):" + datetime('now'));
			if(e.index == 0) {
				// お気に入り追加処理を行う。
				// データベースファイルを開きます。
				var db = Titanium.Database.open('nnu');
				try {
					// すでにお気に入りに追加されている場合はUPDATEするため
					// 存在確認を行います。
					var forUpdate = false;
					if(id){
						var rows = db.execute(
						'SELECT COUNT(*) CNT FROM RECORDS WHERE ID = ?',
						id
						);
						// 値の取得
						if(rows.isValidRow()) {
							if(rows.field(0) != 0) {
								forUpdate = true;
							}
						}
						// ResultSetを閉じておきます。
						rows.close();
						rows = null;
					}
					
					// 日付の取得
					var date_ = new Date();
					// var year = date_.getYear();
					// var mon = date_.getMonth() + 1;
					// var day = date_.getDate();
					// // 西暦の処理とゼロパディング
					// year = (year < 2000) ? year+1900 : year;
					// if (mon < 10) { mon = "0" + mon; }
					// if (day < 10) { day = "0" + day; }
					// var datetime = year + "-" + mon + "-" + day;
					var datetime = date_.getTime().toString();
					Titanium.API.info("datetime:" + datetime);
					
					Titanium.API.info("forUpdate:" + forUpdate);
					if(forUpdate) {
						Titanium.API.info("Update!");
						db.execute(
						"UPDATE RECORDS SET TITLE = ?, DATE = ?, TIME = ?, UPDATED_ON = ? " +
						" WHERE ID = ?",
						// "UPDATE RECORDS SET ID = ?, TITLE = ?, STAPLE_VOL = ?, MEET_VOL = ?, VEGETABLE_VOL = ?, MILK_VOL = ?, ALCOHOL_VOL = ?, SNACK_VOL = ?, DATE = ?, TIME = ?, UPDATED_ON = datetime('now') " +
						// " WHERE ID = ?",
						title, date, time, datetime,
						id
						);
					} else {
						Titanium.API.info("not Update!");
						db.execute(
						"INSERT INTO RECORDS (TITLE, DATE, TIME, UPDATED_ON)" +
						// "INSERT INTO RECORDS (ID, TITLE, STAPLE_VOL, MEET_VOL, VEGETABLE_VOL, MILK_VOL, ALCOHOL_VOL, SNACK_VOL, DATE, TIME, UPDATED_ON)" +
						" VALUES(?, ?, ?, ?)",
						title, date, time, datetime
						);
					}
					Titanium.API.info('追加・更新された行数 = ' + db.rowsAffected);
				} catch(ex) {
					// Titanium.API.info("catch ex!");
					Titanium.API.info(ex);
				}
				// 操作が終わったら後片付け
				db.close();
				db = null;
			}
		});
		dialog.show();
	};
	
	//--------------------------------------
	// UI部分
	//--------------------------------------
	//食べた日付のラベル
	InputData.createDateLabel = function(year, mon, day) {
		var label = Titanium.UI.createLabel({
			text: year + "-" + mon + "-" + day,
			color:'#999',
			font:{fontSize:30},
			// fontFamily : 'DBLCDTempBlack',
			height: 25,
			width: 200,
			top: 10,
			left: 10
		});
		return label;
	}
	
	InputData.createTimeSelectLabel = function() { 
		var label = Titanium.UI.createLabel({
			text: "食事をした時間",
			color:'#999',
			font:{fontSize:20},
			height: 25,
			width: 200,
			top: 75,
			left: 10
		});
		return label;
	}
	
	//食べた時間帯の選択ボタン UI:[Controls]>>[Tabbed Bar] Element:(朝食, 昼食, 夕食, 間食)
	InputData.createTimeSelectButton = function() { 
		var button = Titanium.UI.createTabbedBar({
			labels: ["朝食", "昼食", "夕食", "間食"],
			index: 0,
			height: 25,
			width: 200,
			top: 100,
			left: 10,
			style: Titanium.UI.iPhone.SystemButtonStyle.BAR
		});
		return button;
	}
	
	InputData.createTitleLabel = function() { 
		var label = Titanium.UI.createLabel({
			text: "食事内容",
			color:'#999',
			font:{fontSize:20},
			height: 25,
			width: 200,
			top: 175,
			left: 10
		});
		return label;
	}
	
	//食事の説明（タイトル）の入力
	InputData.createTitleField = function() { 
		var field = Titanium.UI.createTextField({
	        color:'#336699',
	        top:200,
	        left:10,
	        width:250,
	        height:40,
	        hintText:'Menu, Caption etc',
	        keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	        returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
	        borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
		});
		
		// // TEXT FIELD EVENTS (return, focus, blur, change)
		// field.addEventListener('return',function(e){
	        // l.text = 'return received, val = ' + e.value;
	        // tf1.blur();
		// });
		// field.addEventListener('focus',function(e){
	        // l.text = 'focus received, val = ' + e.value;
		// });
		// field.addEventListener('blur',function(e){
	        // l.text = 'blur received, val = ' + e.value;     
		// });
		// field.addEventListener('change', function(e){
	        // l.text = 'change received, event val = ' + e.value + '\nfield val = ' + tf1.value;      
		// });
		
		return field;
	}
	
	//保存ボタン
	InputData.createSaveButton = function() { 
		var button = Titanium.UI.createButton({
			title: "保存",
			height: 20,
			width: 60,
			top: 280,
			left: 10
		});
		
		return button;
	}
})();

// 日付の取得
var date = new Date();
var year = date.getYear();
var mon = date.getMonth() + 1;
var day = date.getDate();
// 西暦の処理とゼロパディング
year = (year < 2000) ? year+1900 : year;
if (mon < 10) { mon = "0" + mon; }
if (day < 10) { day = "0" + day; }
var dateLabel = InputData.createDateLabel(year, mon, day);
var timeSelectLabel = InputData.createTimeSelectLabel();
var timeSelectButton = InputData.createTimeSelectButton();
var titleLabel = InputData.createTitleLabel();
var titleField = InputData.createTitleField();
var saveButton = InputData.createSaveButton();

saveButton.addEventListener('click', function() {
	InputData.addRecord(titleField.value, dateLabel.text, timeSelectButton.index);
	Ti.API.info("title:" + titleField.value);
	Titanium.API.info("date:" + dateLabel.text);
	Titanium.API.info("time:" + timeSelectButton.index);
	
	// InputData.addRecord(titleField.value, dateLabel.value, timeSelectButton.value);
	// Titanium.API.info("title:" + titleField.value);
	// Titanium.API.info("date:" + dateLabel.value);
	// Titanium.API.info("time:" + timeSelectButton.value);
	// Titanium.API.info("id:");
});

// saveButton.addEventListener('click', 
	// addrecord(titleField.value, dateLabel.value, timeSelectButton.value)
// );
// 
// function addrecord(title, date, time, id) {
	// InputData.addRecord(title, date, time, id);
	// Titanium.API.info("title:" + title);
	// Titanium.API.info("date:" + date);
	// Titanium.API.info("time:" + time);
	// Titanium.API.info("id:" + id);
// }

win.add(dateLabel);
win.add(timeSelectLabel);
win.add(timeSelectButton);
win.add(titleLabel);
win.add(titleField);
win.add(saveButton);
