const {app, BrowserWindow, ipcMain:ipc} = require('electron');
const axios = require('axios');



ipc.on('getTextSearch', async (event, arg)=>{
    try {
        let {data} = 
            await axios(
                {
                    method: 'get',
                    url: `http://localhost:8080/kb/${encodeURI(arg)}`
                }
            );


        let searchWin = new BrowserWindow({ 
            width: 800, 
            height: 600,
            webPreferences:{
                nodeIntegration:true,
            } 
        });

        searchWin.loadFile(__dirname + '/pages/search.html');

        searchWin.webContents.on('did-finish-load', () => {
            searchWin.webContents.send('sendingKbs', data)
        });
                   
        searchWin.on('closed', () => {
            win = null
        });

    } catch (error) {
        console.error(error);
    }

})

let mainWindow = null;

app.on('ready', ()=>{
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        backgroundColor: '#21232a',
        webPreferences:{
            nodeIntegration: true
        },
    });
    mainWindow.loadFile(__dirname + '/pages/index.html');
    mainWindow.on('closed', ()=> mainWindow=null);
})

