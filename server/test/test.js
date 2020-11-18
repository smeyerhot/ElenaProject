/*
    To run test suite

    cd server
    npm install mocha
    npm install chai
    npm test
*/

let assert = require('chai').assert;
let coords = require('../controllers/coords.controller.js');

let sLat = 42.389543803266825;
let sLong = -72.53482818603517;
let eLat = 42.38668987817437;
let eLong = -72.53087997436525;
let step = 3/3600;
let grid = coords.gen2DGrid(sLat, sLong, eLat, eLong);
let borderX = coords.getBorderX();
let borderY = coords.getBorderY();

describe('grid array population', function() {
    it('should contain at least 1 node', function() {
        assert.isAtLeast(grid.length, 1);
    });
    it('should have a certain amount of nodes based on lats, longs, step', function() {
        assert.equal(parseInt(((Math.abs(sLat - eLat) + (2 * borderX)) / (3/3600)) + 1) 
                    * parseInt(((Math.abs(sLong - eLong) + (2 * borderY)) / (3/3600)) + 1), grid.length);
    });
});

describe('latitude initialization for each node', function() {
    it('should not be null', function() {
        for (let i = 0; i < grid.length; i++) {
            assert.isNotNull(grid[i].lat);
        }
    });
});

describe('longitude initialization for each node', function() {
    it('should not be null', function() {
        for (let i = 0; i < grid.length; i++) {
            assert.isNotNull(grid[i].long);
        }
    });
});

describe('neighbors array population for each node', function() {
    it('should contain 4 nodes', function() {
        for (let i = 0; i < grid.length; i++) {
            assert.equal(grid[i].neighbors.length, 4);
        }
    });
});

describe('borderX initialization', function() {
    it('should not be null', function() {
        assert.isNotNull(borderX);
    });
    it('should not be negative', function() {
        assert.isAtLeast(borderX, 0);
    });
});

describe('borderY initialization for each node', function() {
    it('should not be null', function() {
        assert.isNotNull(borderY);
    });
    it('should not be negative', function() {
        assert.isAtLeast(borderY, 0);
    });
});

describe('proper distance from neighbors', function() {
    it('should be equal to the set step either latitudinally or longitudinally', function() {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].neighbors.length; j++) {
                let stepDist = true;
                if (!((Math.abs((Math.abs((grid[i].lat).toFixed(4) - (grid[i].neighbors[j].lat).toFixed(4)) - step.toFixed(4)) <= 0.0001)) 
                    || (Math.abs((Math.abs((grid[i].long).toFixed(4) - (grid[i].neighbors[j].long).toFixed(4)) - step.toFixed(4)) <= 0.0001)))) {
                        stepDist = false;
                }
                assert.isTrue(stepDist);
            }
        }
    });
    it('should not have neighbor with equal distance lat and long (diagonal)', function() {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < 4; j++) {
                assert.notEqual(Math.abs((grid[i].lat).toFixed(4) - (grid[i].neighbors[j].lat).toFixed(4)).toFixed(4), 
                                Math.abs((grid[i].long).toFixed(4) - (grid[i].neighbors[j].long).toFixed(4)).toFixed(4));
            }
        }
    });
});

/*describe('elevation initialization for each node', function() {
    it('should not be null', function() {
        for (let i = 0; i < grid.length; i++) {
            assert.isNotNull(grid[i].elevation);
        }
    });
});*/

/*describe('dist initialization for each node', function() {
    it('should not be null', function() {
        for (let i = 0; i < grid.length; i++) {
            assert.isNotNull(grid[i].dist);
        }
    });
});*/

/*describe('edist initialization for each node', function() {
    it('should not be null', function() {
        for (let i = 0; i < grid.length; i++) {
            assert.isNotNull(grid[i].edist);
        }
    });
});*/

/*describe('parent initialization for each node', function() {
    it('should not be null', function() {
        for (let i = 0; i < grid.length; i++) {
            assert.isNotNull(grid[i].parent);
        }
    });
});*/
