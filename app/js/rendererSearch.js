window.addEventListener('DOMContentLoaded', ()=>{
    const {ipcRenderer: ipc} = require ('electron');

    ipc.on('sendingKbs', (e, args) => {
        const {message} = args;
        console.log(message);
    });

    //TODO once we have test data in db, start designing list to render kbs there 
    //TODO onclick for each list item 
    //TODO design card for click event
});