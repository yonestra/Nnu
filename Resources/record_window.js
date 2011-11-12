var win = Ti.UI.currentWindow;

var dateField = Ti.UI.createTextField({
	hintText: '日付を入力してください',
	top:20, left:50, right:50, height:40,
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});
// dateField.addEventListener('change',function(e)
// {
	// dateField.text = e.value;
	// // Titanium.API.info("dateField.text:"+dateField.text);
// });
win.add(dateField);

var timeSelectButton = Titanium.UI.createTabbedBar({
	labels: ["朝食", "昼食", "夕食", "間食"],
	index: 0,
	top:80, left:50, right:50, height:40,
	backgroundColor:'#orange',
	style: Titanium.UI.iPhone.SystemButtonStyle.BAR
});
// timeSelectButton.addEventListener('change',function(e)
// {
	// timeSelectButton.index = e.index;
// });
win.add(timeSelectButton);

var titleField = Ti.UI.createTextField({
	hintText: '食事内容を入力してください',
	top:140, left:50, right:50, height:40,
	borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});
// titleField.addEventListener('change',function(e)
// {
	// titleField.text = e.value;
// });
win.add(titleField);

//
// BASIC SLIDER
//
var basicSliderLabel = Titanium.UI.createLabel({
	text:'Meet value = 0' ,
	color:'#orange',
	font:{
		fontFamily:'Helvetica Neue',
		fontSize:15
	},
	textAlign:'center',
	top:200, left:50, right:50, height:'auto'
});

var basicSlider = Titanium.UI.createSlider({
	backgroundDisabledColor:'#orange',
	min:0,
	max:10,
	top:230, left:50, right:50, height:'auto'
});
basicSlider.addEventListener('change',function(e)
{
	basicSliderLabel.text = 'Meet value = ' + Math.round(e.value);
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
	// backgroundColor:'#orange',
	background:true,
	backgroundGradient:{
    	type:'linear',
    	colors:[
        {position:0.00,color:'#feccb1'},
        {position:0.50,color:'#f17432'},
        {position:0.51,color:'#ea5507'},
        {position:1.00,color:'#fb955e'}
       ],
       startRadius:{x:0,y:0},
       endRadius:{x:50,y:50}
   },
	backgroundImage:'none',
	color:"#white",
	title: 'この値で保存する',
	top:280, left:50, right:50, height:40
});
win.add(saveButton);

saveButton.addEventListener(
'click', function () {
	var record = {};
	// record.index = win.record.index;
	record.time_select = timeSelectButton.index;
	record.title = titleField.value;
	record.meet_val = Math.round(basicSlider.value);
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
