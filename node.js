/*eslint-env node*/

// Import assert function
global.assert = require("assert");

delete global._$jscoverage; // Purge any previous blanket use

// Code coverage helper
require("blanket")({
    pattern: "src/sinon.js"
});

// 'Simulate' browser environment by creating a window object
global.window = {};

// 'Load' the current sinon file
require("./src/sinon.js");

// Map the sinon object to global in order to make it global
global.sinon = window.sinon;
