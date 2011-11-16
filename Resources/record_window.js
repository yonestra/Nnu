var win = Ti.UI.currentWindow;

var monthLabel = Titanium.UI.createLabel({
	color:'#black',
	font:{
		fontFamily:'Helvetica Neue',
		fontSize:25
	},
	textAlign:'center',
	top:5, left:5, height:'auto', width:'auto'
});
monthLabel.text = new Date().getMonth()+1 + "月";
win.add(monthLabel);

//
// meat SLIDER
//
var meatSliderLabel = Titanium.UI.createLabel({
	text:'meat value = 0' ,
	color:'#orange',
	font:{
		fontFamily:'Helvetica Neue',
		fontSize:15
	},
	textAlign:'center',
	top:30, left:50, right:50, height:'auto'
});
var meatSlider = Titanium.UI.createSlider({
	backgroundDisabledColor:'#orange',
	min:0,
	max:10,
	top:60, left:50, right:50, height:'auto'
});
meatSlider.addEventListener('change',function(e)
{
	meatSliderLabel.text = 'meat value = ' + Math.round(e.value);
});
meatSlider.value = 0; // For regression test purposes
win.add(meatSliderLabel);
win.add(meatSlider);

//
// vegetable SLIDER
//
var vegetableSliderLabel = Titanium.UI.createLabel({
	text:'vegetable value = 0' ,
	color:'#orange',
	font:{
		fontFamily:'Helvetica Neue',
		fontSize:15
	},
	textAlign:'center',
	top:90, left:50, right:50, height:'auto'
});

var vegetableSlider = Titanium.UI.createSlider({
	backgroundDisabledColor:'#orange',
	min:0,
	max:10,
	top:120, left:50, right:50, height:'auto'
});
vegetableSlider.addEventListener('change',function(e)
{
	vegetableSliderLabel.text = 'vegetable value = ' + Math.round(e.value);
});
vegetableSlider.value = 0; // For regression test purposes
win.add(vegetableSliderLabel);
win.add(vegetableSlider);

//
// carb SLIDER
//
var carbSliderLabel = Titanium.UI.createLabel({
	text:'carb value = 0' ,
	color:'#orange',
	font:{
		fontFamily:'Helvetica Neue',
		fontSize:15
	},
	textAlign:'center',
	top:150, left:50, right:50, height:'auto'
});

var carbSlider = Titanium.UI.createSlider({
	backgroundDisabledColor:'#orange',
	min:0,
	max:10,
	top:180, left:50, right:50, height:'auto'
});
carbSlider.addEventListener('change',function(e)
{
	carbSliderLabel.text = 'carb value = ' + Math.round(e.value);
});
carbSlider.value = 0; // For regression test purposes
win.add(carbSliderLabel);
win.add(carbSlider);

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
   	borderRadius:10,
	backgroundImage:'none',
	color:"#white",
	title: 'この値で保存する',
	top:220, left:50, right:50, height:40
});
win.add(saveButton);

// saveButton.addEventListener('singletap',function(){
	// this.backgroundColor = "#blue";
// });

saveButton.addEventListener(
'click', function () {
	this.backgroundGradient = {
    	type:'linear',
    	colors:[
	        {position:0.00,color:'#white'},
	        {position:0.50,color:'#blue'},
	        {position:0.51,color:'#blue'},
	        {position:1.00,color:'#white'}
	    ],
	    startRadius:{x:0,y:0},
	    endRadius:{x:50,y:50}
   	}
   	
   	this.backgroundGradient = {
    	type:'linear',
    	colors:[
        	{position:0.00,color:'#feccb1'},
        	{position:0.50,color:'#f17432'},
        	{position:0.51,color:'#ea5507'},
        	{position:1.00,color:'#fb955e'}
        ],
        startRadius:{x:0,y:0},
        endRadius:{x:50,y:50}
   	}
	
	var record = {};
	// record.index = win.record.index;
	record.meat_val = Math.round(meatSlider.value);
	record.vegetable_val = Math.round(vegetableSlider.value);
	record.carb_val = Math.round(carbSlider.value);
	record.at = new Date();
	record.at.setHours(12); //日付がなぜかズレるのを防止c, record);
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

Ti.include('scroll_days_view.js');

// var scrollDays = new ScrollDays();
// scrollDays.scrollView.scrollTo(100, 0);

// win.add(scrollDays.leftImage);
// win.add(scrollDays.rightImage);
win.add(scrollView);
win.add(scrollValueLabel);
win.add(allow);

// win.addEventListener('focus', function(){
	// Titanium.API.info("window focus!");
	// scrollView.scrollTo(1000,0);
// });
