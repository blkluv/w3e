'use strict';

// Shim `process` for `geohash-emoji` (Parcel will throw error without it)
require('process');
var L = require('leaflet');
var LHash = require('leaflet-hash');
var geocoder = require('leaflet-geocoder-mapzen');
var geohash = require('geohash-emoji');
var emojione = require('emojione');
var protomaps = require('protomaps');
require('leaflet.locatecontrol');

// Create a basic Leaflet map
var map = L.map('map').setView([51.4700, 0.2592], 12);

var accessToken = "cc006399f6b2bdd1"; // Replace with your actual access token
var layer = protomaps.leafletLayer({
  attribution: 'Map imagery © <a href="https://protomaps.com">Protomaps</a> © <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, Emoji by <a href="http://emojione.com/">Emoji One</a>',
  url: 'https://api.protomaps.com/tiles/v2/{z}/{x}/{y}.pbf?key=' + accessToken
});
layer.addTo(map);

var urlFragment = decodeURIComponent(window.location.hash).replace('#', '');
if ([...urlFragment].length == 3) {
  var location = geohash.coordFromHash(urlFragment);
  map.setView([location[0], location[1]], 12);
} else {
  new L.Hash(map);
}

// Geolocator
L.control.locate({
  drawCircle: false,
  follow: false,
  showPopup: false,
  markerStyle: {
    opacity: 0,
  }
}).addTo(map);

// Bundle
const pointIcon = require('../images/point_icon.png');
const polygonIcon = require('../images/polygon_icon.png');

// Add Pelias geocoding plugin
var pelias = new L.Control.Geocoder('ge-793a784e03376196', { // Replace with your Pelias API key
  url: 'https://api.geocode.earth/v1',
  markers: false,
  pointIcon: pointIcon,
  polygonIcon: polygonIcon,
  expanded: true,
  fullWidth: false, // Handle this ourselves.
}).addTo(map);

map.on('moveend', getEmoji);

// Configure Emoji (Important: Set to PNG for broader compatibility)
emojione.emojiSize = '64';
emojione.imageType = 'png'; // Force PNG rendering

getEmoji();

if (document.getElementById('map').className.indexOf('leaflet-touch') > 0) {
  document.body.className += ' leaflet-touch';
}

function getEmoji() {
  var center = map.getCenter();
  var lat = center.lat;
  var lng = center.lng;
  var emoji = geohash.coordAt(lat, lng);
  window.location.replace("#" + emoji);

  // Improved Emoji Display with Fallback
  var output = emojione.toImage(emoji); // Get the <img> tag
  var emojiContainer = document.getElementById('emojis');

  // Create a fallback in case the emoji doesn't render
  var fallback = document.createElement('span');
  fallback.textContent = emoji; // Display the geohash as text

  // Check if the image loaded successfully. If not, show the fallback.
  var img = document.createElement('img');
  img.src = output.match(/src="([^"]*)"/)[1]; // Extract the src from the emojione output
  img.alt = emoji; // Set alt text for accessibility
  img.onerror = function() {
    emojiContainer.innerHTML = ''; // Clear previous content
    emojiContainer.appendChild(fallback);
  };
    img.onload = function() {
      emojiContainer.innerHTML = ''; // Clear previous content
      emojiContainer.appendChild(img);
  };

  emojiContainer.innerHTML = ''; // Clear previous content
  emojiContainer.appendChild(img);

  setTitle(emoji);
}


function setTitle(emoji) {
  document.title = emoji + ' · what3emojis map';
}