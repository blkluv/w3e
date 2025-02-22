'use strict';

require('process');

import L from 'leaflet';
import data from 'emoji-mart';
import 'leaflet-hash';
import 'leaflet.locatecontrol';
import 'leaflet-control-geocoder';  // Import the geocoder

// Protomaps Access Token (REPLACE WITH YOUR ACTUAL TOKEN - ESSENTIAL!)
const protomapsAccessToken = "cef94f3ae8cfd882"; // Replace with your actual token

// Geocoding API Key (REPLACE WITH YOUR ACTUAL API KEY)
const geocodingApiKey = "ge-793a784e03376196"; // Replace with your actual API key (e.g., OpenCage, etc.)

// Coordinates for Atlantic City Ocean Club Condos (Precise - Replace with your best estimate)
const atlanticCityLatitude = 39.3532; // Example: Replace with the best coordinates you can find
const atlanticCityLongitude = -74.4371; // Example: Replace with the best coordinates you can find

// Create Leaflet map, centered on Atlantic City
const map = L.map('map').setView([atlanticCityLatitude, atlanticCityLongitude], 15);

const layer = protomaps.leafletLayer({
  attribution: 'Map imagery © <a href="https://protomaps.com">Protomaps</a> © <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, Emoji by <a href="https://emojione.com/">Emoji One</a>',
  url: `https://api.protomaps.com/tiles/v2/{z}/{x}/{y}.pbf?key=${protomapsAccessToken}`
});
layer.addTo(map);

// Leaflet Hash
new L.Hash(map);

// Geolocator
L.control.locate({
  drawCircle: false,
  follow: false,
  showPopup: false,
  markerStyle: { opacity: 0 }
}).addTo(map);

// Geocoding (leaflet-control-geocoder)
const geocoder = L.Control.Geocoder({
  position: 'topleft',
  geocoder: new L.Control.Geocoder.OpenCage(geocodingApiKey, { // Use OpenCage (or other provider)
    // other options if needed
  })
}).addTo(map);


// Emoji Display
map.on('moveend', getEmoji);

// Touch Detection
if ('ontouchstart' in document.documentElement) {
  document.body.classList.add('leaflet-touch');
}

function getEmoji() {
  const center = map.getCenter();
  const emoji = geohash.coordAt(center.lat, center.lng);
  window.location.replace("#" + emoji);

  const emojiData = data.find(e => e.unified === geohash.unifiedFromHash(emoji));
  const emojiContainer = document.getElementById('emojis');

  if (emojiData) {
    const img = document.createElement('img');
    img.src = `https://twemoji.maxcdn.com/v/latest/72x72/${emojiData.unified}.png`;
    img.alt = emoji;
    img.onload = () => {
      emojiContainer.innerHTML = '';
      emojiContainer.appendChild(img);
    };
    img.onerror = () => {
      emojiContainer.textContent = emoji;
    };
    emojiContainer.innerHTML = '';
    emojiContainer.appendChild(img);
  } else {
    emojiContainer.textContent = emoji;
  }

  setTitle(emoji);
}

function setTitle(emoji) {
  document.title = emoji + ' · what3emojis map';
}