console.log("index.js loaded")


//sending API request to server and creating cards
function buildCardsInFront(){
    //getting values of fid & token
    let fidV
    let tokenV
    if (document.querySelector(".bil-input-fid").textContent.trim() != "" &&
    document.querySelector(".bil-input-token").textContent.trim() != ""){
        fidV = document.querySelector(".bil-input-fid").textContent.trim()
        tokenV = document.querySelector(".bil-input-token").textContent.trim()
    }else{
        return
    }

    let cityChoices;
    let venueChoices;
    let kindChoices;
    let elemInputs = '<div class="my_wrapper"><div class="wrapper__inputs"><select class="select cities-select" placeholder="Город"><option value="" selected>Город</option></select><select class="select venues-select"><option value="">Площадка</option></select><select class="select kinds-select"><option value="">Виды</option></select></div><div class="error-msg">Fid or token are incorrect!</div><div class="bil-spinload"></div><div class="wrapper__events"></div></div>';
    document.querySelector(".wp-block-wp-tixgear-tixgear").insertAdjacentHTML('afterbegin', elemInputs);
    const cityElement = document.querySelector('.cities-select');
    cityChoices = new Choices(cityElement);
    const venueElement = document.querySelector('.venues-select');
    venueChoices = new Choices(venueElement);
    const kindElement = document.querySelector('.kinds-select');
    kindChoices = new Choices(kindElement);



    let zone = "test";
    let url;
    if(zone == "real"){
        url = "https://api.bil24.pro/json";
    }else{
        url = "https://api.bil24.pro:1240/json";
        zone = "test";
    }
    let request = {
        fid: Number(fidV), //* 1248
        token: tokenV, //* "2876804e2c1741f1aa66"
        locale: "ru",
        command: "GET_ALL_ACTIONS"
    };
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
        
        let result = xhr.response;
        let actions = result.actionList;  
        console.log(result);
        let cityList = new Map();
        let kindList = new Map();
        let venueList = new Map();
        let venueCityList = new Map();
        
        //check for errors
        let bilError =  document.querySelector(".error-msg")
        if (result.resultCode == 101){
            bilError.style.display="block"
        }else{
            bilError.style.display="none"
        }

        //droplist city
        for(let i in result.cityList){
            cityChoices.setValue([result.cityList[i].cityName]);
            cityList.set(result.cityList[i].cityId, result.cityList[i].cityName);
            
        //droplist venue
        for(let j in result.cityList[i].venueList){
            venueChoices.setValue([result.cityList[i].venueList[j].venueName]);
            venueList.set(result.cityList[i].venueList[j].venueId, result.cityList[i].venueList[j].venueName);
            venueCityList.set(result.cityList[i].venueList[j].venueId, result.cityList[i].cityId);
            }
        }
        cityChoices.setChoiceByValue('');
        venueChoices.setChoiceByValue('');
        
        
        //droplist kind
        for(let i in result.kindList){
            kindChoices.setValue([result.kindList[i].kindName]);
            kindList.set(result.kindList[i].kindId, result.kindList[i].kindName);
        }   
        kindChoices.setChoiceByValue('');

        document.querySelector(".bil-spinload").style.display="none"
        //create all cards    
        document.querySelector(".wrapper__events").innerHTML = ""
        let tempCityId;
        let tempVenueId;
        let elem = '';  
        let tempCityIdList = [];
        let tempVenueIdList = [];
        for(let i = actions.length - 1; i >= 0; i--){
            tempCityId = -1;
            tempVenueId = -1;
            for(let j in actions[i].actionEventList){
                if(tempCityId != actions[i].actionEventList[j].cityId){
                    tempCityIdList.push(actions[i].actionEventList[j].cityId);
                    tempCityId = actions[i].actionEventList[j].cityId;
                }
                if(tempVenueId != actions[i].actionEventList[j].venueId){
                    tempVenueIdList.push(actions[i].actionEventList[j].venueId);
                    tempVenueId = actions[i].actionEventList[j].venueId;
                }

            }
            
                elem = '<a href="/wp-content/plugins/wp-tixgear/widget/#/?frontendId=' + request.fid + '&token=' + request.token + '&id=' + actions[i].actionId + '&cityId=' + actions[i].actionEventList[0].cityId + '&agr=' + location.protocol + '//' + location.hostname + '/wp-content/plugins/wp-tixgear/agreement.html/agreement.html&zone=' + zone + '" class="events__event" data-cityid= "' + tempCityIdList + '" data-kindid="' + actions[i].kindId + '" data-venueid="' +tempVenueIdList +'"><div class="event__img_wrapper"><img src="'+ actions[i].smallPosterUrl + '" alt="" class="event__img"></div><p class="event__name">' + actions[i].actionName + '</p><span class="event__inf">' + actions[i].fullActionName + '</span><span class="event__inf">' + actions[i].firstEventDate + '</span><span class="event__inf">' + actions[i].actionEventTime + '</span><span class="event__inf">от ' + actions[i].minPrice + ' руб.</span></a>';
                document.querySelector(".wrapper__events").insertAdjacentHTML('afterbegin', elem);
                tempCityIdList = [];
                tempVenueIdList = [];
        }

        //listeners
        let actionsDOM = document.querySelectorAll(".events__event");
        cityChoices.passedElement.element.addEventListener('change', changeVenues);
        cityChoices.passedElement.element.addEventListener('change', search);   
        venueChoices.passedElement.element.addEventListener('change', search);
        kindChoices.passedElement.element.addEventListener('change', search);

        
        
        //search
        function search(){
            let cityValue = cityChoices.getValue(true).toLowerCase().trim();
            let venueValue = venueChoices.getValue(true).toLowerCase().trim();
            let kindValue = kindChoices.getValue(true).toLowerCase().trim();
            let cityIdList = [];
            let venueIdList = [];
            for(let i = 0; i < actionsDOM.length; i++){
                cityIdList = actionsDOM[i].getAttribute('data-cityid').split(',');
                venueIdList = actionsDOM[i].getAttribute('data-venueid').split(',');
                for(let city in cityIdList){
                    new_card:
                    for (let venue in venueIdList){
                        if(cityList.get(Number(cityIdList[city])).toLowerCase().trim().includes(cityValue)
                           && venueList.get(Number(venueIdList[venue])).toLowerCase().trim().includes(venueValue)
                           && kindList.get(Number(actionsDOM[i].getAttribute('data-kindid'))).toLowerCase().trim().includes(kindValue)){
                            actionsDOM[i].style.display = "flex";
                            break new_card;
                        }else {
                            actionsDOM[i].style.display = "none";
                        }                   
                        
                    }
                } 
            }
        }
        
        //change inputs
        function changeVenues(){
            if(cityChoices.getValue(true).toLowerCase().trim() == ''){
                venueChoices.clearChoices();
                for(let i in result.cityList){
                    for(let j in result.cityList[i].venueList){
                        venueChoices.setValue([result.cityList[i].venueList[j].venueName]);
                    }
                }
                venueChoices.setChoices([{ value: '', label: 'Площадка', placeholder:true,selected:true }], 'value', 'label', false);
                venueChoices.setChoiceByValue('');
            }else{
                for (let [cityId, v] of cityList) {
                    if (v.toLowerCase().trim() == cityChoices.getValue(true).toLowerCase().trim()) { 
                        const CVK = result.cityList;
                        venueChoices.clearChoices();
                        for(let i in CVK){
                            if(CVK[i].cityId == cityId){
                                for(let j in CVK[i].venueList)
                                venueChoices.setValue([CVK[i].venueList[j].venueName]);
                            }
                        }
                        venueChoices.setChoices(
                            [{ value: '', label: 'Площадка', placeholder:true,selected:true }], 'value', 'label', false);
                        break;
                    }

                }  
            }

        }
        
    }
    xhr.send(JSON.stringify(request));
}
window.addEventListener("load", function() {
    console.log("All resources finished loading!");
    buildCardsInFront()
}); 
