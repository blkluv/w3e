// Import jQuery (if needed for other parts of your code)
import $ from 'jquery'; // Or const $ = require('jquery'); if using CommonJS

window.$ = window.jQuery = $; // Make jQuery available to window

// Import only the necessary Bootstrap JS components
import 'bootstrap/js/dist/util.js';
import 'bootstrap/js/dist/button.js';
import 'bootstrap/js/dist/carousel.js';
import 'bootstrap/js/dist/collapse.js';
import 'bootstrap/js/dist/dropdown.js';

// Include Bootstrap CSS (do this in your main SCSS file - recommended)
// OR import 'bootstrap/dist/css/bootstrap.min.css'; (less recommended)