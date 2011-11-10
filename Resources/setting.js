// setting.js
var win = Titanium.UI.currentWindow;

Ti.Facebook.appid = '257658350951000';
Ti.Facebook.permissions = ['publish_stream'];


// var button = Ti.Facebook.createLoginButton();
// win.add(button);

var myButton = Ti.UI.createButton({
    title: 'login',
    top: 50,
    left: 100,
    height: 50,
    width: 100,
});
myButton.addEventListener('click',function(){
    if ( Ti.Facebook.loggedIn ) {
        Ti.Facebook.logout();
    } else {
        Ti.Facebook.authorize();
    }
});
win.add(myButton);

var getButton = Ti.UI.createButton({
    title: 'get',
    top: 125,
    left: 100,
    height: 50,
    width: 100,
});
getButton.addEventListener('click',function(){
    Ti.Facebook.requestWithGraphPath(
        'me',
        {},
        "GET",
        function(e) {
            if (e.success) {
                var obj = JSON.parse(e.result);
                alert("Success: " + obj.name);
            }
        }
    );
})
win.add(getButton);

var postButton = Ti.UI.createButton({
    title: 'post',
    top: 200,
    left: 100,
    height: 50,
    width: 100,
});
postButton.addEventListener('click',function(){
    Ti.Facebook.requestWithGraphPath(
        'me/feed',
        {
             message: "GraphAPIのテスト"
        },
        "POST",
        function(e) {
            if (e.success) {
                alert("Success" + e.result);
            }
        }
    );
})
win.add(postButton);