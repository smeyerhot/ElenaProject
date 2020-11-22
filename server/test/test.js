/*
    To run test suite

    cd server
    npm install mocha
    npm install chai
    npm test
*/

let assert = require('chai').assert;
let coords = require('../controllers/coords.controller');

let sLat = 42.389543803266825;
let sLong = -72.53482818603517;
let eLat = 42.38668987817437;
let eLong = -72.53087997436525;
let grid2D = coords.gen2DGrid(sLat, sLong, eLat, eLong);
let grid = grid2D[0];
coords.addNeighbors(grid);
let borderX = coords.getBorderX();
let borderY = coords.getBorderY();
let step = coords.getStep();

describe('grid array population', function() {
    it('should contain at least 1 node', function() {
        assert.isAtLeast(grid.length, 1);
    });
    it('should have a certain amount of nodes based on lats, longs, step', function() {
        assert.equal(parseInt(((Math.abs(sLat - eLat) + (2 * borderX)) / (step)) + 1) 
                    * parseInt(((Math.abs(sLong - eLong) + (2 * borderY)) / (step)) + 1), grid.length * grid[0].length);
    });
});

describe('latitude initialization for each node', function() {
    it('should not be null', function() {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                assert.isNotNull(grid[i][j].lat);
            }
        }
    });
});

describe('longitude initialization for each node', function() {
    it('should not be null', function() {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                assert.isNotNull(grid[i][j].long);
            }
        }
    });
});

describe('neighbors array population for each node', function() {
    it('should contain 3-8 nodes', function() {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                let neighbs = true;
                if (grid[i][j].neighbors.length < 3 || grid[i][j].neighbors.length > 8) {
                    neighbs = false;
                }
                assert.isTrue(neighbs);
            }
        }
    });
});

describe('borderX initialization for each node', function() {
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
    it('should be equal to the set step latitudinally or longitudinally', function() {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                for (let k = 0; k < grid[i][j].neighbors.length; k++) {
                    let stepDist = true;
                    let neighbs = grid[i][j].neighbors[k].split(",");
                    let neighbLat = parseInt(neighbs[0]).toFixed(4);
                    let neighbLong = parseInt(neighbs[1]).toFixed(4);
                    if (!((Math.abs(Math.abs(grid[i][j].lat.toFixed(4) - neighbLat) - step.toFixed(4)) <= 1) 
                        || (Math.abs(Math.abs(grid[i][j].long.toFixed(4) - neighbLong) - step.toFixed(4) <= 1)))) {
                            stepDist = false;
                    }
                    assert.isTrue(stepDist);
                }
            }
        }
    });
    /*it('should not have neighbor with equal distance lat and long (diagonal)', function() {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                for (let k = 0; k < grid[i][j].neighbors.length; k++) {
                    assert.notEqual(Math.abs((grid[i][j].lat).toFixed(4) - (grid[i][j].neighbors[k].lat).toFixed(4)).toFixed(4), 
                                    Math.abs((grid[i][j].long).toFixed(4) - (grid[i][j].neighbors[k].long).toFixed(4)).toFixed(4));
                }
            }
        }
    });*/
});

/*describe('elevation initialization for each node', function() {
    it('should not be null', function() {
        for (let i = 0; i < grid.length; i++) {
            assert.isNotNull(grid.betterGrid[i].elevation);
        }
    });
});*/

/*describe('dist initialization for each node', function() {
    it('should not be null', function() {
        for (let i = 0; i < grid.length; i++) {
            assert.isNotNull(grid.betterGrid[i].dist);
        }
    });
});*/

/*describe('edist initialization for each node', function() {
    it('should not be null', function() {
        for (let i = 0; i < grid.length; i++) {
            assert.isNotNull(grid.betterGrid[i].edist);
        }
    });
});*/

/*describe('parent initialization for each node', function() {
    it('should not be null', function() {
        for (let i = 0; i < grid.length; i++) {
            assert.isNotNull(grid.betterGrid[i].parent);
        }
    });
});*/
