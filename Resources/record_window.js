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

//
// BASIC SLIDER
//
var basicSliderLabel = Titanium.UI.createLabel({
	text:'Basic Slider - value = 0' ,
	color:'#999',
	font:{
		fontFamily:'Helvetica Neue',
		fontSize:15
	},
	textAlign:'center',
	top:200, left:50, right:50, height:'auto'
});

var basicSlider = Titanium.UI.createSlider({
	min:0,
	max:10,
	top:230, left:50, right:50, height:'auto'
});
basicSlider.addEventListener('change',function(e)
{
	basicSliderLabel.text = 'value = ' + Math.round(e.value);
});
// For #806
basicSlider.addEventListener('touchstart', function(e)
{
	Ti.API.info('Touch started: '+e.value);
});
basicSlider.addEventListener('touchend', function(e)
{
	Ti.API.info('Touch ended: '+e.value);
});
basicSlider.value = 0; // For regression test purposes
win.add(basicSliderLabel);
win.add(basicSlider);

var saveButton = Ti.UI.createButton({
	title: 'この値で保存する',
	top:260, left:50, right:50, height:40
});
win.add(saveButton);

saveButton.addEventListener(
'click', function () {
	var record = {};
	// record.index = win.record.index;
	record.time_select = timeSelectButton.index;
	record.title = titleField.value;
	record.at = new Date(dateField.value);
	record.at.setHours(12); //日付がなぜかズレるのを防止
	Ti.App.fireEvent(win.func, record);
	win.close();
});

//初期化すると更新できなくなるためコメントアウト
// if(win.func == "update_row"){
	// Ti.include('record_db.js');
	// var db = new RecordDB();
	// var record = db.findOne(win.record.id);
	// timeSelectButton.index = record.time_select;
	// titleField.value = record.title;
	// dateField.value = record.at.toString();
// }
