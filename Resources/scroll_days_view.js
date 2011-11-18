
//
// HORIZONTAL SCROLLING TABS
//
var scrollView = Titanium.UI.createScrollView({
	// animatedCenterPoint: {x:400, y:280},
	// contentOffset:{x:-100, y:0},
	contentWidth:'auto',
	contentHeight:'auto',
	// anchorPoint:{x:0.8, y:0.5},
	top:290,
	height:70,
	width:320,
	// backgroundColor:'#13386c'
	backgroundColor:'#gray',
	zIndex:1
});

var scrollValueLabel = Titanium.UI.createLabel({
	text:0,
	top:180,
	left:260,
	// top:250,
	// left:15,
	font:{fontSize:20},
	color:'#red',
	width:'auto',
	// height:'auto',
	textAlign:'center',
	zIndex:4
});

var allow = Titanium.UI.createLabel({
	text:"▼",
	font:{fontSize:20},
	color:'#gray',
	top:200,
	left:150,
	width:20,
	textAlign:'center',
	zIndex:3
});

// this.scrollView.addEventListener('load', function(e)
// {
	// this.scrollView.scrollTo(500, 280);
// });

var scrollToDfault = false;
var pos_old = 0;

//SDK 1.8に期待！
scrollView.addEventListener('dragend', function(){
	alert("dragend!");
});

var time_old = new Date();

scrollView.addEventListener('scroll', function(e)
{
	// Ti.API.info('x ' + e.x + ' y ' + e.y);
	
	scrollValueLabel.text = e.x;
	
	time = new Date();
	var time_diff = (time.getTime()-time_old.getTime());
	
	// if( time_diff < 200 && time_diff > 100 ){
	if( time_diff > 100 ){
		var pos = e.x;
		var pos_diff = Math.abs(pos - pos_old);
		
		var velocity = Math.round(pos_diff / time_diff * 1000);
		
		// Ti.API.info('pos_diff ' + pos_diff);
		// Ti.API.info('time_diff ' + time_diff);
		// Ti.API.info('velocity ' + velocity);
		
		// scrollValueLabel.text = velocity;
		
		time_old = time;
		pos_old = pos;
		
		if(time_diff < 200 && velocity <  25){
			// Ti.API.info('time_diff ' + time_diff);
			if(pos % 50 != 0){
				scrollView.scrollTo(Math.round(pos/50)*50,0);
			}
		}
	}
});

function computeDate(year, month, day, addDays) {
    var dt = new Date(year, month - 1, day);
    var baseSec = dt.getTime();
    var addSec = addDays * 86400000;//日数 * 1日のミリ秒数
    var targetSec = baseSec + addSec;
    dt.setTime(targetSec);
    return dt;
}

var labelNum = 30;
var labelWidth = 50;

var now = new Date();
now.setHours(12);
for(var i=labelNum+1; i>-4; i--){
	if(i < labelNum+1){
		var view = Ti.UI.createView({
			// backgroundColor:'#336699',
			borderColor:'#white',
			backgroundColor:'#A0522D',
			width:labelWidth,
			height:70,
			left: 135+labelWidth*(labelNum-i)
		});
		if(i == 0)
			view.backgroundColor = '#red';
		scrollView.add(view);
		var wdayLabel = Ti.UI.createLabel({
			font:{fontSize:13},
			color:'#fff',
			width:'auto',
			textAlign:'center',
			height:'auto',
			top:10
		});
		var date = computeDate(now.getYear(), now.getMonth()+1, now.getDate(), -i);
		var w = ["火","水","木","金","土","日","月"];
		wdayLabel.text = w[date.getDay()];
		view.add(wdayLabel);
		var dateLabel = Ti.UI.createLabel({
			text: date.getDate(),
			font:{fontSize:13},
			color:'#fff',
			width:'auto',
			textAlign:'center',
			height:'auto',
			top:40
		});
		view.add(dateLabel);
	} else {
		var view = Ti.UI.createView({
			backgroundColor:'#gray',
			width:135,
			height:70, left:0
		});
		scrollView.add(view);
	}
}
// scrollView.scrollTo(1000, 0);