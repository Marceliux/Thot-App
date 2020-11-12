const {app, BrowserWindow, ipcMain:ipc} = require('electron');
const axios = require('axios');

let mainWindow = null;


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
            height: 519,
            parent: mainWindow, 
            modal: true,
            webPreferences:{
                nodeIntegration:true,
            } 
        });

        searchWin.loadFile(__dirname + '/pages/search.html');

        searchWin.webContents.on('did-finish-load', () => searchWin.webContents.send('sendingKbs', data));
                   
        searchWin.on('closed', () => searchWin = null);

    } catch (error) {
        console.error(error);
    }

})

ipc.on('postNewKb', async (event, arg)=> 
    axios.post('http://localhost:8080/new-kb', arg)
      .then(data => mainWindow.webContents.send('sendingResponseFromApi', {status: data.status, message: data.data.message}))
      .catch(error => mainWindow.webContents.send('sendingResponseFromApi', error))
)


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

