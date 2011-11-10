var win = Ti.UI.currentWindow;

var dateField = Ti.UI.createTextField({
	hintText: '日付を入力してください',
	top:20, left:50, right:50, height:40,
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});
win.add(dateField);

var timeSelectButton = Titanium.UI.createTabbedBar({
	labels: ["朝食", "昼食", "夕食", "間食"],
	index: 0,
	top:80, left:50, right:50, height:40,
	style: Titanium.UI.iPhone.SystemButtonStyle.BAR
});
win.add(timeSelectButton);

var titleField = Ti.UI.createTextField({
	hintText: '食事内容を入力してください',
	top:140, left:50, right:50, height:40,
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});
win.add(titleField);

var saveButton = Ti.UI.createButton({
	title: 'この値で保存する',
	top:200, left:50, right:50, height:40
});
win.add(saveButton);

saveButton.addEventListener(
'click', function () {
	var record = {};
	record.index = win.record.index;
	record.time_select = timeSelectButton.index;
	record.title = titleField.value;
	record.at = new Date(dateField.value);
	record.at.setHours(12); //日付がなぜかズレるのを防止
	Ti.App.fireEvent(win.func, record);
	win.close();
});