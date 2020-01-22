//Global variables declaration

let APImap;
let userLocation = {};
let markersArray = [];

//Create the elements for select the place that the user is looking for insinde the container with id="selection-area"
function placeSelectNodesCreate(nodes){
	function NodeCreateProcess(name,iconClass,searchName){
		let colDiv = document.createElement('div');
		colDiv.className = "col-4 col-md-2 plr-1";

		let selectionItemDiv = document.createElement('div');
		selectionItemDiv.className = "selection-item";
		selectionItemDiv.id="selectionItem";

		let selectionItemTopDiv = document.createElement('div');
		selectionItemTopDiv.className = "selection-item-top";

		let icon = document.createElement('i');

		let selectionItemBottomDiv = document.createElement('div');
		selectionItemBottomDiv.className = "selection-item-bottom";

		document.getElementById("selectionAreaRow").appendChild(colDiv);
		colDiv.append(selectionItemDiv);
		selectionItemDiv.append(selectionItemTopDiv);
		selectionItemDiv.append(selectionItemBottomDiv);
		selectionItemTopDiv.append(icon);
		icon.className=iconClass;
		selectionItemBottomDiv.innerHTML=name;

		//Add an event handler to selection element that trigger the connetcion to Maps API
		//IMPORTANT!! Cand asignez o functie gata declarata unui event nu se pun parenteze, nu se cheama funcia pentru ca ia doar rezultatul
		selectionItemDiv.onclick = () => {
			getPlaceFromAPI(searchName);
		}
	}

	for(key in nodes){
		NodeCreateProcess(key,nodes[key][0],nodes[key][1]);
	}
}

//Create places descrition in wrapper with id 'descriptionArea' based on infromations that are provided from maps API
function createPlaceDescriptionComponent(place){
	let colDiv=document.createElement('div');
	colDiv.className="col-12 col-lg-6";
	let cardDiv=document.createElement('div');
	cardDiv.className="card mb-3";
	let cardRow=document.createElement('div');
	cardRow.className="row no-gutters";
	let cardCol1=document.createElement('div');
	cardCol1.className="col-md-4";
	let cardImg=document.createElement('img');
	cardImg.className="card-img";
	let cardCol2=document.createElement('div');
	cardCol2.className="col-md-8";
	let cardBody=document.createElement('div');
	cardBody.className="card-body";
	let cardTitle=document.createElement('h5');
	cardTitle.className="card-title";
	let cardText1=document.createElement('p');
	cardText1.className="card-text";
	let cardText2=document.createElement('p');
	cardText2.className="card-text";
	let cardTextSmall=document.createElement('small');
	cardTextSmall.className="text-muted";
	let buttonAnchor=document.createElement('a');
	let mapsButton=document.createElement('button');
	mapsButton.className="btn btn-secondary btn-sm";

	document.querySelector('#descriptionArea div').appendChild(colDiv);
	colDiv.appendChild(cardDiv);
	cardDiv.appendChild(cardRow);
	cardRow.appendChild(cardCol1);
	cardRow.appendChild(cardCol2);
	cardCol1.appendChild(cardImg);
	cardCol2.appendChild(cardBody);
	cardBody.appendChild(cardTitle);
	cardBody.appendChild(cardText1);
	cardBody.appendChild(buttonAnchor);
	buttonAnchor.appendChild(mapsButton);
	cardBody.appendChild(cardText2);
	cardText2.appendChild(cardTextSmall);

	let photoURL;

	if(place.photos){
		photoURL = place.photos[0].getUrl();
	}
	else {
		photoURL = "Frontend/images/banner.jpg";
	}

	let directionLink = `https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat()},${place.geometry.location.lng()}&query_place_id=${place.place_id}`;

	cardImg.src=photoURL;
	cardImg.alt="...";
	cardTitle.innerHTML=place.name;
	cardText1.innerHTML = `Adress: ${place.formatted_address}`;
	cardTextSmall.innerHTML = `Rating: ${place.rating}`;
	buttonAnchor.href = directionLink;
	buttonAnchor.target = "_blank";
	mapsButton.innerHTML = "Open in maps";


}

//Create default map and by connetcing to maps API with the curent user location
function initMap(location) {
	var options = {
	  enableHighAccuracy: true,
	  timeout: 10000,
	  maximumAge: 0
	};

	navigator.geolocation.getCurrentPosition(pos => {
		location.lat=pos.coords.latitude;
		location.long=pos.coords.longitude;
		APImap = new google.maps.Map(document.getElementById('map'), {
			center: {lat: location.lat, lng: location.long},
			zoom: 14
			});
		createCurentLocationMarker({lat: location.lat, lng: location.long});
	},
		function () {
			alert("Your device location is off. Please turn it on and refresh browser");
			window.location.reload();
		},
		options);

}

//It connect to Places API to find that placeType selected by the user with custome request by nearbySearch then pass results and status to callback function
function getPlaceFromAPI(placeType){
	var pyrmont = new google.maps.LatLng(userLocation.lat,userLocation.long);
	let request = {
		location: pyrmont,
		radius: '1500',
		query: placeType
	};
	service = new google.maps.places.PlacesService(APImap);
    service.textSearch(request, callback);
  	// service.getDetails(request, callback);
}

//Callback function for nearbySearch in 'getPlaceFromApi' function
function callback(results,status){
	if(status == google.maps.places.PlacesServiceStatus.OK){
		console.log(results);
		createPlacesAndMarkers(results);
	}
	else{
		alert("Eroare. Nu s-a putut realiza operatia");
	}
}

//Create marker for the curent user location
function createCurentLocationMarker(placeLocation){
	 let marker = new google.maps.Marker({
	 	position: placeLocation,
	 	map: APImap,
	 	label: 'X'
	 });
}

//Create place description component and set markers on the map based on results that are returned from request to API
function createPlacesAndMarkers(results){
	//If another place was searched before the current call, it delets all markers and description components
	function checkForDelete(){
		if(markersArray){
			for (let i = 0; i < markersArray.length; i++ ) {
			    markersArray[i].setMap(null);
			}
			markersArray.length = 0;
		}
		if(document.querySelector('#descriptionArea div').innerHTML !== "") {
			document.querySelector('#descriptionArea div').innerHTML = "";
		}
	}

	//Create markers for every place that is in results array
	function createMarkers(results){
		for(result of results){
			let directionLink = `https://www.google.com/maps/search/?api=1&query=${result.geometry.location.lat()},${result.geometry.location.lng()}&query_place_id=${result.place_id}`;
			let icon = {
			    url: result.icon, // url
			    scaledSize: new google.maps.Size(25, 25), // scaled size
			    origin: new google.maps.Point(0,0), // origin
			    anchor: new google.maps.Point(0, 0) // anchor
			};
			console.log(result.geometry.location.lat);
			let infoContent = `<p>${result.name}</p>
				<p>${result.formatted_address}</p>
				<p>Raiting:${result.rating} </p>
				<a href=${directionLink} target="_blank">Open in maps</a>`;
			let infowindow = new google.maps.InfoWindow({
			    content: infoContent
			});
			let marker = new google.maps.Marker({
			 	position: result.geometry.location,
			 	map: APImap,
			 	icon: icon,
			 	title: result.name
		 	});
		 	marker.addListener('click', function() {
		 	    infowindow.open(APImap, this);
		 	});
		 	markersArray.push(marker);
	 	}
	}

	checkForDelete();
	createMarkers(results);
	//Creating places description elements using the results that are provided from API request
	for(result of results){
		createPlaceDescriptionComponent(result);
	}
	document.getElementById("map").scrollIntoView();

}

placeSelectNodesCreate({"Bars":["fas fa-glass-whiskey","bar"],"Restaurants":["fas fa-hamburger","restaurant"],"Clubs":["fas fa-cocktail","club"],
						"Pubs":["fas fa-hat-cowboy","pub"],"Coffe Shops":["fas fa-coffee","cafenea"],"Night Clubs":["fas fa-smile-wink","club de noapte"]});
initMap(userLocation);


