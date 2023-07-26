( function ( blocks, blockEditor, element ) {
    var el = element.createElement;
    var RichText = blockEditor.RichText;
    var useBlockProps = blockEditor.useBlockProps;
    const { useEffect } = wp.element;
    blocks.registerBlockType( 'wp-bil24/bil24', {
        attributes: {
            fid: {
                type: 'string',
                source: 'html',
                selector: 'p.bil-input-fid',
            },
            token: {
                type: 'string',
                source: 'html',
                selector: 'p.bil-input-token',
            },
        },
        edit: function ( props ) {
            
            useEffect( () => {  
                console.log(document.querySelector(".bil-input-fid"))
                buildCards()
              }, [] );

            var blockProps = useBlockProps();
            var fid = props.attributes.fid;
            var token = props.attributes.token;
            function onChangeFid( newFid ) {
                props.setAttributes( { fid: newFid } );
            }
            function onChangeToken( newToken ) {
                props.setAttributes( { token: newToken } );
            }
     
            return el(
                'div',
                blockProps,
                el(
                    RichText,
                    Object.assign(
                        {
                            tagName: 'p',
                            onChange: onChangeFid,
                            onLoad: testFunc,
                            className: "bil-input bil-input-fid",
                            value: fid,
                            placeholder: 'Fid',
                        }
                    )
                ),
                el(
                    RichText,
                    Object.assign(
                        {
                            tagName: 'p',
                            onChange: onChangeToken,
                            className: "bil-input bil-input-token",
                            value: token,
                            placeholder: 'Token',
                        }
                    )
                ),
                el(
                    "div",
                    {className: "bil-btn", onClick: buildCards},
                    "Submit"
                )
            );
        },

        save: function ( props ) {
            var blockProps = useBlockProps.save();
            return el('div',
                {
                    className: "display-none bil-block",
                    blockProps
                },
            
                el(
                    RichText.Content,
                    Object.assign( 
                        {
                            tagName: 'p',
                            className: "bil-input-fid",
                            value: props.attributes.fid,
                        }
                    )
                ),el(
                    RichText.Content,
                    Object.assign( 
                        {
                            tagName: 'p',
                            className: "bil-input-token",
                            value: props.attributes.token,
                        }
                    )
                )
            );
        },
    } 
    );
} )( window.wp.blocks, window.wp.blockEditor, window.wp.element );


function testFunc(){
    console.log("Test function is running")
}

//todo: make btn disabled if there are no changes in inputs
//sending API request to Bil24 and creating cards
function buildCards(){
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
    if (document.querySelector(".my_wrapper") != undefined){
        document.querySelector(".my_wrapper").innerHTML = ""
    }
    let elemInputs = '<div class="my_wrapper"><div class="wrapper__inputs"><select class="select cities-select" placeholder="Город"><option value="" selected>Город</option></select><select class="select venues-select"><option value="">Площадка</option></select><select class="select kinds-select"><option value="">Виды</option></select></div><div class="error-msg">Fid or token are incorrect!</div><div class="wrapper__events"></div></div>';
    document.querySelector(".bil-btn").insertAdjacentHTML('afterend', elemInputs);
    const cityElement = document.querySelector('.cities-select');
    cityChoices = new Choices(cityElement);
    const venueElement = document.querySelector('.venues-select');
    venueChoices = new Choices(venueElement);
    const kindElement = document.querySelector('.kinds-select');
    kindChoices = new Choices(kindElement);
    isChoicersCalled = true


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

        //todo: reset values
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


        //todo: wait til all cards are loaded and only then show it
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
            
                elem = '<a href="/widget/#/?frontendId=' + request.fid + '&token=' + request.token + '&id=' + actions[i].actionId + '&cityId=' + actions[i].actionEventList[0].cityId + '&agr=' + location.protocol + '//' + location.hostname + '/bil24-wp-script/agreement/agreement.html&zone=' + zone + '" class="events__event" data-cityid= "' + tempCityIdList + '" data-kindid="' + actions[i].kindId + '" data-venueid="' +tempVenueIdList +'"><div class="event__img_wrapper"><img src="'+ actions[i].smallPosterUrl + '" alt="" class="event__img"></div><p class="event__name">' + actions[i].actionName + '</p><span class="event__inf">' + actions[i].fullActionName + '</span><span class="event__inf">' + actions[i].firstEventDate + '</span><span class="event__inf">' + actions[i].actionEventTime + '</span><span class="event__inf">от ' + actions[i].minPrice + ' руб.</span></a>';
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
            let venueIdInCurrentCity;
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

