window.addEventListener('DOMContentLoaded', ()=> {
    const {ipcRenderer: ipc} = require('electron');
    const btnSearch = document.getElementById('btnSearch');
    const titleInput = document.getElementById('txtKbTitle');
    const caseNumberInput = document.getElementById('txtCaseNumber');
    const solutionDescriptionInput = document.getElementById('txtSolutionDescription');
    const transmitServerOption = document.getElementById('slctServerVersion');
    const platformOption = document.getElementById('slctPlatform'); 
    const sdkOption = document.getElementById('slctSDKVersion');
    const mobileOption = document.getElementById('slctMobileOS');
    const osVersionInput = document.getElementById('txtOsVersion');

    const renderChanges = (markdown, target) =>
        document.getElementById(`${target}`).innerHTML = markdown;
    
    const showHidden = (con, target) =>
        con === true 
            ? 
            document.getElementById(`${target}`).style.display = 'block'
            :
            target.map(val => document.getElementById(`${val}`).style.display = 'none')

    titleInput.addEventListener('keyup', e => renderChanges(e.target.value, 'kbTitle'));

    caseNumberInput.addEventListener('keyup', e => renderChanges(e.target.value, 'caseNumber'));

    solutionDescriptionInput.addEventListener('keyup', e => renderChanges(e.target.value, 'solutionDescription'));

    osVersionInput.addEventListener('keyup', e =>{ 
        showHidden(true, 'osVersion')
        renderChanges(e.target.value, 'osVersion')
    });

    transmitServerOption.addEventListener('change', (e)=>{
        if(e.target.value.trim() !== ''){
            renderChanges(`Transmit Server ${e.target.value}`, 'transmit');  
            showHidden(true, 'transmit');
        } 
        else{
            showHidden(false, ['transmit']);
        }      
    });
 
    platformOption.addEventListener('change', (e) => {
        if (e.target.value.trim() !== ''){
            e.target.value > 0 ? showHidden(true, 'mobileDiv') : showHidden(false, ['mobileDiv']);

            showHidden(true, 'sdkDiv');

            switch(e.target.value){
                case '0':
                    renderChanges('Web SDK', 'platform');
                    showHidden(true, 'platform');               
                    break;
                case '1':
                    renderChanges('Mobile SDK', 'platform');      
                    showHidden(true, 'platform');                        
                    break;
            }
        }else{
            renderChanges('', 'platform');
            showHidden(false, ['sdkDiv', 'mobileDiv', 'osDiv']);
        }
    });
    
    mobileOption.addEventListener('change', (e) => {
        if(e.target.value.trim() !== '') { 
            renderChanges(e.target.value, 'mobileOs');
            showHidden(true, 'mobileOs');
            showHidden(true, 'osDiv');
        } else{ 
            showHidden(false, ['osDiv'])
        }
    }
    );

    sdkOption.addEventListener('change', (e) => {
        if (e.target.value.trim() !== '') {
            renderChanges(`SDK Version ${e.target.value}`, 'sdk');
            showHidden(true, 'sdk'); 
        } 
        else
            showHidden(false, 'sdk');
    });
    
    btnSearch.addEventListener('click', (e)=>{
        e.preventDefault();
        const txtSearch = document.getElementById('txtSearch').value;
        ipc.send('getTextSearch', txtSearch);
    });

    //TODO validation, show submit when and just when every input is filled.
    //TODO once validation is done, handle POST request to our API.
    //TODO clean input method
    //TODO sweet alert notification when server returns 201.
})