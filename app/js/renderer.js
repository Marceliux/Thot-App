window.addEventListener('DOMContentLoaded', ()=> {

    const {ipcRenderer: ipc} = require('electron');

    
    const btnSearch = document.getElementById('btnSearch');
    const btnSubmitKb = document.getElementById('btnSubmitKb');
    const titleInput = document.getElementById('txtKbTitle');
    const caseNumberInput = document.getElementById('txtCaseNumber');
    const solutionDescriptionInput = document.getElementById('txtSolutionDescription');
    const transmitServerOption = document.getElementById('slctServerVersion');
    const platformOption = document.getElementById('slctPlatform'); 
    const sdkOption = document.getElementById('slctSDKVersion');
    const mobileOption = document.getElementById('slctMobileOS');
    const osVersionInput = document.getElementById('txtOsVersion');

    const renderChanges = (inputText, target) =>
        document.getElementById(`${target}`).innerHTML = inputText;
    
    const showHidden = (con, target) =>
        con === true 
            ? 
            document.getElementById(`${target}`).style.display = 'block'
            :
            target.map(val => document.getElementById(`${val}`).style.display = 'none')

    const validatingBlankInputs = (input) => input.value.trim() !== '' && true ;

    const validateWholeArray = arr =>  {
        let errors = 0;
        arr.map((val, ind) => {
            if(!validatingBlankInputs(val)){
                arr[ind].classList.add('is-invalid');
                errors++;
            }else
                arr[ind].classList.remove('is-invalid');
        });

        return errors === 0;
    }          


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
        }else
            showHidden(false, ['sdkDiv', 'mobileDiv', 'osDiv', 'platform']);
        
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

    btnSubmitKb.addEventListener('click', ()=> {
        const inputsToValidate = [titleInput, caseNumberInput, solutionDescriptionInput, transmitServerOption, platformOption, sdkOption];
        const optionalInputs = [mobileOption, osVersionInput];
        
        if (platformOption.value === '1') 
            if (validateWholeArray([...inputsToValidate, ...optionalInputs])){
                const dataToPost = {
                    kbTitle: titleInput.value, 
                    caseNumber: caseNumberInput.value, 
                    solutionDescription: solutionDescriptionInput.value, 
                    transmitServerVersion:transmitServerOption.value, 
                    platform: platformOption.value, 
                    sdkVersion: sdkOption.value,
                    mobileOs: mobileOption.value, 
                    osVersion: osVersionInput.value
                }

                ipc.send('postNewKb', dataToPost);
            } 
            else
                return;
        else
            if (validateWholeArray(inputsToValidate)){
                const dataToPost = {
                    kbTitle: titleInput.value, 
                    caseNumber: caseNumberInput.value, 
                    solutionDescription: solutionDescriptionInput.value, 
                    transmitServerVersion:transmitServerOption.value, 
                    platform: platformOption.value, 
                    sdkVersion: sdkOption.value,
                }

                ipc.send('postNewKb', dataToPost);
            }
            else
                return;

    });

    ipc.on('sendingResponseFromApi', (e, args) => {
        const {status, message} = args;
        if(status === 201){
            swal('Good job!', `${message}`, 'success');
            setTimeout(() => location.reload(), 1500);   
        }
        else{
            swal('Oops', `${message}`, 'error');
            setTimeout(() => location.reload(), 1500); 
        }

    });
})