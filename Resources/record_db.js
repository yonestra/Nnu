//record_db.js

//DB操作のメソッドをここに書く
var RecordDB = function() {
	this.startDate = new Date(2011,10,22);
	
	this.dbName = 'records';
	
	this.open = function () {
		this.db = Titanium.Database.open(this.dbName);
	};
	this.close = function () {
		this.db.close();
	};
	this.setRows = function (rows) {
		var res = [];
		// Ti.API.debug('rows.getRowCount():' + rows.getRowCount());
		if ( rows.getRowCount() > 0 ) {
			for (i =0; rows.isValidRow(); i++) {
				var record = {};
				record.id = rows.fieldByName('id');
				record.meat_val = rows.fieldByName('meat_val');
				record.vegetable_val = rows.fieldByName('vegetable_val');
				record.carb_val = rows.fieldByName('carb_val');
				record.y_m_d = rows.fieldByName('y_m_d');
				// var time = rows.fieldByName('created_at', Titanium.Database.FIELD_TYPE_DOUBLE);
				// record.created_at = new Date();
				// record.created_at.setTime(time);
				res.push(record);
				rows.next();
			}
		}
		return res;
	};
	this.deleteOne = function(record) {
		this.open();
		var res = this.db.execute(
		'DELETE FROM records WHERE id=?',
		record.id
		);
		Ti.API.debug('Delete from DB');
		this.close();
		return true;
	};
	this.update = function(record) {
		this.open();
		var res = this.db.execute(
		'UPDATE records SET meat_val=?, vegetable_val=?, carb_val=?, y_m_d=?, updated_at=? WHERE id=?',
		record.meat_val,
		record.vegetable_val,
		record.carb_val,
		record.y_m_d,
		record.updated_at.getTime(),
		record.id
		);
		Ti.API.debug('Update DB');
		this.close();
		return true;
	};
	this.updateByYMD = function(record) {
		this.open();
		var res = this.db.execute(
		'UPDATE records SET meat_val=?, vegetable_val=?, carb_val=?, updated_at=? WHERE y_m_d=?',
		record.meat_val,
		record.vegetable_val,
		record.carb_val,
		record.updated_at.getTime(),
		record.y_m_d
		);
		Ti.API.debug('Update DB by y_m_d');
		this.close();
		return true;
	};
	this.insert = function(record) {
		this.open();
		var res = this.db.execute(
		'INSERT INTO records (meat_val, vegetable_val, carb_val, y_m_d, created_at, updated_at) VALUES(?,?,?,?,?,?)',
		record.meat_val,
		record.vegetable_val,
		record.carb_val,
		record.y_m_d,
		record.created_at.getTime(),
		record.updated_at.getTime()
		);
		// Titanium.API.info("record.meat_val:"+record.meat_val);
		Titanium.API.info("record.y_m_d:"+record.y_m_d);
		Ti.API.debug('Insert into DB');
		this.close();
	};
	this.findAll = function() {
		this.open();
		var rows = this.db.execute( 'SELECT * FROM records ORDER BY y_m_d DESC' );
		var res = this.setRows(rows);
		rows.close();
		this.close();
		return res;
	};
	this.findOne = function(id) {
		this.open();
		var row = this.db.execute( 'SELECT * FROM records WHERE id=?',
			id
		 );
		var res = this.setRows(row)[0];
		row.close();
		this.close();
		return res;
	};
	this.findOneByYMD = function(y_m_d) {
		this.open();
		var row = this.db.execute( 'SELECT * FROM records WHERE y_m_d=?',
			y_m_d
		 );
		var res = this.setRows(row)[0];
		row.close();
		this.close();
		return res;
	};
	// テーブル作成
	this.open();
	// this.db.execute('DROP TABLE records');
	this.db.execute('CREATE TABLE IF NOT EXISTS records (id INTEGER PRIMARY KEY, meat_val INTEGER, vegetable_val INTEGER, carb_val INTEGER, y_m_d INTEGER, created_at real, updated_at real)');
	this.close();
};