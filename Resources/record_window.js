var win = Ti.UI.currentWindow;

var dateField = Ti.UI.createTextField({
	hintText: '日付を入力してください',
	top:20, left:50, right:50, height:40,
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});
win.add(dateField);

var titleField = Ti.UI.createTextField({
	hintText: '体重を入力してください',
	top:80, left:50, right:50, height:40,
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});
win.add(titleField);

var saveButton = Ti.UI.createButton({
	title: 'この値で保存する',
	top:140, left:50, right:50, height:40
});
win.add(saveButton);

saveButton.addEventListener(
'click', function () {
	var record = {};
	record.index = win.record.index;
	record.title = titleField.value;
	record.at = new Date(dateField.value);
	record.at.setHours(12); //日付がなぜかズレるのを防止
	Ti.App.fireEvent(win.func, record);
	win.close();
});