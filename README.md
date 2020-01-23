# findmeaplace.tk
Findmeaplace. A website for search places nearby

The idea of the project was to create a single page website like "TripAdvisor", but simpler to use and with less functionality. You can search places like coffe-shops, bars, clubs, restaurants,etc nearby you. So it became a "simplyfied version of TripAdvisor"
The website find your current location through geolocation API, it creates a marker on map that is provided from Maps API with your current location. When you press a button to find a type o place ( for example "Restaurants ), it make a request to Places API to find location based on a querry ( for this example the querry is "restaurant") for searching reastaurants nearby user location in google maps with a given radius. If the request is positive, it returns an array with javascript objects, every object is a place that was found, that contains details about the place ( Like: name, adress, raiting, photos, location, etc). After that, a function create markers on the map based on place location, another function dinamicly create HTML components for every place with location name, adress, photo, raiting and a button called "Open in maps" that open Google Maps at the place location. 
All the buttons, map and components that describe places are created dinamically through JavaScript-DOM interaction. 

This project is a website that use Bootstrap 4 for styling and making it responsive. The dominant piece is JavaScript because almost everything is dinamically inserted in webpage and make the connection to Maps API, Places API and Geolocation API possible.

IMPORTANT!
You need to allow the website to access your location before you can use it, and if you are using it from mobile, you need to manually activate your device location.

HOW TO USE IT
Allow acces to your location and press a button for search places nearby you.
