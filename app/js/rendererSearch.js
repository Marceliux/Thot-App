window.addEventListener('DOMContentLoaded', ()=>{
    const {ipcRenderer: ipc} = require ('electron');
    const listItemContainer = document.getElementById('listItemContainer');
    
    const renderAlert = () => {
        listItemContainer.innerHTML = `
            <div class="alert alert-error" role="alert">
                <h4 class="alert-heading">Sorry!</h4>
                <p>We were not able to find any matches on Transmit's db to your query, please try again with any other keyword.</p>
                <hr>
                <p class="mb-0">Close this window and try again! Good Luck!.</p>
            </div>
        `


        listItemContainer.classList.add('alert');
        listItemContainer.classList.add('alert-danger');
    }      

    const checkMobile = (mobile, os) =>{
        let liMobileAndOs;

        typeof mobile === 'string' ? liMobileAndOs = `
        <li class="list-group-item" id="mobileOs">${mobile}</li>
        <li class="list-group-item" id="osVersion">${os}</li>` : liMobileAndOs = '<li class="list-group-item" style="display: none;" id="mobileOs"></li>';

        return liMobileAndOs;
    }

    const renderCard = ({kbTitle, caseNumber, platform, transmitServerVersion, sdkVersion, solutionDescription, mobileOs = 0, osVersion = 0}) => document.getElementById('cardContainer').innerHTML = `
        <div class="container-fluid mt-3">
            <div class="jumbotron d-flex justify-content-center">
                <div class="card" style="width: 18rem;">
                    <div class="card-header">
                        <h5 id="kbTitle" class="card-title">${kbTitle}</h5>
                        <h6 id="caseNumber" class="card-subtitle mb-2 text-muted">${caseNumber}</h6>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item" id="transmit">Transmit Server ${transmitServerVersion}</li>
                        <li class="list-group-item" id="platform">${platform}</li>
                        <li class="list-group-item" id="sdk">SDK Version ${sdkVersion}</li>
                        ${checkMobile(mobileOs, osVersion)}
                    </ul>
                    <div class="card-footer">
                        <p id="solutionDescription" class="font-italic">${solutionDescription}</p>
                    </div>
                </div>
            </div>
        </div>`

    const getTimeDifference = date => {
        let timeDifference = Math.abs(Date.parse(date) - new Date().getTime());
        if ((timeDifference / (1000 * 3600 * 24)) < 1)
            return 'Today'
        
        return Math.ceil(timeDifference / (1000 * 3600 * 24)).toString() + ' days ago';
    }

    const renderlistItemBlueprint = kbs =>
        kbs.forEach(kb => {
            const listItem = `<a href="#" id='${kb._id}' class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${kb.kbTitle}</h5>
                    <small class="text-muted">${getTimeDifference(kb.createdDate).toString()}</small>
                </div>
                <p class="mb-1">${kb.solutionDescription}</p>
                <small class="text-muted">${kb.caseNumber}.</small>
            </a>`;

            listItemContainer.innerHTML = listItemContainer.innerHTML + listItem;
        }); 
        
    
    const addingClickFunctionality = (callback) => {
        let listItems;
        if (document.querySelectorAll(".list-group-item") !== undefined) {
            listItems = document.querySelectorAll(".list-group-item");
            listItems.forEach(element => element.addEventListener("click", callback));
        }
    
    }

    ipc.on('sendingKbs', (e, args) => {
        const {kbs, message} = args;

        if(kbs.length > 0){
            renderlistItemBlueprint(kbs);
            addingClickFunctionality((e)=> {
                const _id = e.target.id;

                if(_id.trim() !== ''){
                    const [kbCard] = kbs.filter(kb => kb._id === _id);
                    console.log(kbCard);
                    renderCard(kbCard);
                }
            });
        }else
            renderAlert();
    });
});