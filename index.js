let grantAccess = document.querySelector('.grant-access');
let grantAccessContainer = document.querySelector('.grant-access-container');
let userinfo = document.querySelector('.user-weather-info');
let searchContainer = document.querySelector('.search-container');
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
let loading = document.querySelector('.loading-container');
let userTab = document.querySelector('#userTab');
let searchTab = document.querySelector('#searchTab');
let search = document.querySelector('.search-btn');
let error = document.querySelector('.error-page');

grantAccess.addEventListener('click', getLocation);
getFromSessionStorage();

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position){
    let coordinates = {
        lat : position.coords.latitude,
        long : position.coords.longitude
    }
    sessionStorage.setItem('userCoordinates', JSON.stringify(coordinates));
    renderData(coordinates);
}

async function renderData(coordinates){
    let {lat, long} = coordinates;
    grantAccessContainer.classList.remove('active');
    userinfo.classList.remove('active');
    error.classList.remove('active');
    loading.classList.add('active');
    
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`);
        
        let data = await response.json();
        
        loading.classList.remove('active');
        userinfo.classList.add('active');
        
        let cityName = document.querySelector('.city-name');
        cityName.innerText = data?.name;

        let flagimg = document.querySelector('.city img');
        flagimg.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;

        let desc = document.querySelector('.desc');
        desc.innerText = `${data?.weather?.[0]?.main}`;

        let descImg = document.querySelector('.desc-img');
        descImg.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;

        let temp = document.querySelector('.temp');
        temp.innerText = `${data?.main?.temp} °C`;

        let wind = document.querySelector('.speed-value');
        wind.innerText = `${data?.wind?.speed}m/s`;

        let humid = document.querySelector('.humidity-value');
        humid.innerText = `${data?.main?.humidity}%`;

        let clouds = document.querySelector('.clouds-percent');
        clouds.innerText = `${data?.clouds?.all}%`;

    }
    catch(e){
        //404 error
        console.log(e);
        grantAccessContainer.classList.remove('active');
        userinfo.classList.remove('active');
        error.classList.add('active');
        loading.classList.remove('active');
    }
}

userTab.addEventListener('click', getFromSessionStorage);
searchTab.addEventListener('click', searchBar);

function getFromSessionStorage(){
    let local = sessionStorage.getItem('userCoordinates');
    if(local){
        let coordinates = JSON.parse(local);
        searchContainer.classList.remove('active');
        renderData(coordinates);
    }
    else{
        grantAccessContainer.classList.add('active');
        userinfo.classList.remove('active');
        searchContainer.classList.remove('active');
        error.classList.remove('active');
        loading.classList.remove('active');
    }
}

function searchBar(){
    loading.classList.remove('active');
    error.classList.remove('active');
    userinfo.classList.remove('active');
    grantAccessContainer.classList.remove('active');
    searchContainer.classList.add('active');
}

search.addEventListener('click', fetchWeatherinfo);
let searchInput = document.querySelector('.search-container input');

async function fetchWeatherinfo(){
    if(searchInput.value === ""){
        return;
    }
    else{
        try{
            let city = searchInput.value;
            let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            let data = await response.json();
            if(data?.cod == 404){
                grantAccessContainer.classList.remove('active');
                userinfo.classList.remove('active');
                loading.classList.remove('active');
                error.classList.add('active');
                return;
            }
            let coordinates = {
                lat : data?.coord?.lat,
                long : data?.coord?.lon
            }
            renderData(coordinates);
        }
        catch(e){
            grantAccessContainer.classList.remove('active');
            userinfo.classList.remove('active');
            loading.classList.remove('active');
            error.classList.add('active');
        }
    }
}