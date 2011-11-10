// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();


//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({  
    title:'List',
    backgroundColor:'#fff',
    url:"table_view.js"
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'List',
    window:win1
});

//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({  
    title:'Record',
    backgroundColor:'#fff',
    url:"record_window.js"
});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Record',
    window:win2
});

//
// create controls tab and root window
//
var win3 = Titanium.UI.createWindow({  
    title:'Setting',
    backgroundColor:'#fff',
    url:"setting.js"
});
var tab3 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Setting',
    window:win3
});


//
//  add tabs
//
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);
tabGroup.addTab(tab3);


// open tab group
tabGroup.open();

