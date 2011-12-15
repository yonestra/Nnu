//calendar_view.js

var win = Ti.UI.currentWindow;

var now = new Date();
now.setHours(12);
var Y = now.getYear()+1900;
var M = now.getMonth()+1;
var D = now.getDate();
if(String(M).length == 1) M = "0"+M;
if(String(D).length == 1) D = "0"+D;
var y_m_d = parseInt(Y+""+M+""+D);
var y_m_d_old = y_m_d;

var whenLabel = Ti.UI.createLabel({
	font:{
		fontFamily:'Helvetica Neue',
		fontSize:25
	},
	textAlign:'center',
	text:"12月",
	top:5, left:120, height:25, width:100
});
win.add(whenLabel);

var backMonthButton = Ti.UI.createLabel({
	backgroundColor:"blue",
	top:35, left:30, height:25, width:120
});
win.add(backMonthButton);
var forwardMonthButton = Ti.UI.createLabel({
	backgroundColor:"green",
	top:35, left:170, height:25, width:120
});
win.add(forwardMonthButton);

var scrollView = Titanium.UI.createScrollView({
	contentWidth:'auto',
	contentHeight:'auto',
	top:70,
	height:300,
	width:320,
	backgroundColor:'#fff'
});
win.add(scrollView);

var cal = function(date){
	// if(!date) date = new Date();
	Ti.API.info("cal!");
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();
	var leap_year=false;
 	if ((year%4 == 0 && year%100 != 0) || (year%400 == 0)) leap_year=true;
	var lom = new Array(31,28+leap_year,31,30,31,30,31,31,30,31,30,31);
	var w = new Array("red","gray","gray","gray","gray","gray","blue");
	
	var cols = 0;
	var rows = 0;
	var week = 0;
	var width = 80;
	var height = 80;
	for(var i=0; i<lom[month]; i++){
		var top = 0 + height * rows;
		var left = 0 + width * cols;
		var calLabel = Ti.UI.createLabel({
			backgroundColor:w[week],
			borderColor:"black",
			top:top, left:left, height:height, width:width
		});
		scrollView.add(calLabel);
		if(cols != 3){
			cols++;
		} else {
			cols = 0;
			rows++;
		}
		if(week != 6){
			week++;
		} else {
			week = 0;
		}
	}
}

cal(now);

//設定ボタン
var cameraButton = Ti.UI.createButton({
	systemButton: Titanium.UI.iPhone.SystemButton.CAMERA
});
cameraButton.addEventListener('click', function () {
	// Titanium.Media.showCamera({
	    // // JSON形式の引数です
	    // success:function(event){
	        // // cropRectにはx,y,height,widthといったデータがはいる。
	        // var cropRect = event.cropRect;
	        // var image    = event.media;
// 	
	        // // 撮影されたデータが写真ならばImageViewとしてWindowに貼り付ける
	        // if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO){
	            // var imageView = Ti.UI.createImageView({
	                // width:win.width,
	                // height:win.height,
	                // image:event.media
	            // });
	            // win.add(imageView);  
	        // }
// 	        
	        // // アプリケーションデータディレクトリに camera_photo.png として出力する。
			// var f = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'camera_photo.png');
			// f.write(event.image);
// 			
			// // 現在のウィンドウ背景画像としてそのまま使う場合は次のようにする
			// // Titanium.UI.currentWindow.backgroundImage = f.nativePath;
	    // },
	    // cancel:function(){
	        // // ...
	    // },
	    // error:function(error){
	        // // errorとしてカメラがデバイスにないようなケース(iPod touchなどがそうでしょうか)では
	        // // error.code が Titanium.Media.NO_CAMERA として返ります。
	    // },
	    // // 撮影データのフォトギャラリーへの保存
	    // saveToPhotoGallery:true,
	    // // 撮影直後に拡大縮小移動をするか否かのフラグ
	    // allowEditing:true,
	    // // 撮影可能なメディア種別を配列で指定
	    // mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO],
    // });
    
    Titanium.Media.openPhotoGallery({
	    success: function(event) {
	        // アプリケーションデータディレクトリに camera_photo.png として出力する。
			var f = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'camera_photo.png');
			f.write(event.image);
	    },
	    error: function(error) {
	        // notify(e.message);
	    },
	    cancel: function() {
	        // キャンセル時の挙動
	    },
	    // 選択直後に拡大縮小移動をするか否かのフラグ
	    allowEditing: true,
	    // 選択可能なメディア種別を配列で指定
	    mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO]
	});
	
	// //デバイス画面をカメラ同様に取り込める　キャラのキャプチャ
	// Titanium.Media.takeScreenshot(function(event){
	    // var image = event.media;
	    // var imageView = Ti.UI.createImageView({image:event.media});
    	// Ti.UI.currentWindow.add(imageView);
	// });
});
win.rightNavButton = cameraButton;
