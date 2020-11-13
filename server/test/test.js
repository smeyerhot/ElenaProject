let coords = require('../controllers/coords.controller.js');

let sLat = 42.389543803266825;
let sLong = -72.53482818603517;
let eLat = 42.38668987817437;
let eLong = -72.53087997436525;
let grid = coords.gen2DGrid(sLat, sLong, eLat, eLong);
