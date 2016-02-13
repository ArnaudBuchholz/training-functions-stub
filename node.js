/*eslint-env node*/

// 'Simulate' browser environment by creating a window object
global.window = {};

// 'Load' the current sinon file
require("./src/sinon.js");

// Map the sinon object to global in order to make it global
global.sinon = window.sinon;
