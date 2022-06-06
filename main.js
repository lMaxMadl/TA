const { app, BrowserWindow,Menu,webContents,ipcMain,ipcRenderer,Tray,Notification,remote } = require('electron')
const url = require('url')
const path = require('path')


const sound = require("sound-play");
var appIcon = null;
var timersd
var notifi=true
var sp=true;


let mwindo;
ipcMain.on('synMessage', (event, arg) => {
    clearInterval(timersd)
    timersd = setInterval(() => {
        sound.play(path.join(__dirname, "file.mp3"));
        event.sender.send('synReply', 'free')
        if(notifi){
        appIcon.displayBalloon({
            title: 'Timer',
            content: 'free',
            icon: path.join(__dirname, "/assets/icon.ico")
        })
    }
        setTimeout(() => {
             sound.play(path.join(__dirname, "file.mp3"));
            event.sender.send('synReply', 'Hold')
           
            if(notifi){
            appIcon.displayBalloon({
                title: 'Timer',
                content: 'Hold',
                icon: path.join(__dirname, "/assets/icon.ico")
            })}
        }, 90000);
       }, 390000);
  
   
   if(sp){
       sp=false
      
    sound.play(path.join(__dirname, "file.mp3"));
    setTimeout(()=>{
sp=true
    },1000)
   }
   
   appIcon.displayBalloon({
    title: 'Timer',
    content: 'Started',
    icon: path.join(__dirname, "/assets/icon.ico")
})
    event.sender.send('synReply', 'Started')
 
 })
app.on('ready',function(){
    mwindo = new BrowserWindow({minWidth:400,minHeight:300,webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        
        
    },icon:path.join(__dirname, "/assets/icon.ico")})
    // mwindo.loadURL(url.format({
    //     pathname :"m.html",
    //        protocol:'file',
    //         slashes : true,
    //     }))
        mwindo.loadFile("m.html")
        
    appIcon = new Tray(path.join(__dirname, "/assets/icon.ico"))
    var contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show App',id:"1",type:'checkbox', click: function () {
                mwindo.show()
                
            }
        },{label: 'Show Notification',id:"2",type:'checkbox', click: function () {
           
            notifi=!notifi
        }}
        
    ])
    contextMenu.getMenuItemById("2").checked=true
    const mmain = Menu.buildFromTemplate(mainmentempl)
    
    Menu.setApplicationMenu(mmain)
    appIcon.setContextMenu(contextMenu);
    
   
    mwindo.on('minimize',function(event){
        
        contextMenu.getMenuItemById("1").checked = true
        
        
    });
        
})

app.on('before-quit',()=>{
    appIcon.destroy()
})





const mainmentempl=[
    {
        
        label:'Quit',
        submenu:[{
            label:"Exit",
            accelerator: process.platform === 'darwin' ? '' : 'Alt+Q',
            click(){
                
                    app.quit()
                  
               
            }
        }]
    }
]