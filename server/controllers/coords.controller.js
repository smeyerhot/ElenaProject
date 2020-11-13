require('dotenv').config()
const fetch = require('node-fetch');
const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});
const search = require('../lib/AStar')
const astar = search.AStar;

//processCoords needs to be async to get promise
async function processCoords(req, res) {
    let startLat = req.body.start.lat;
    let startLong = req.body.start.long;
    let endLat = req.body.end.lat;
    let endLong = req.body.end.long;
    let grid = gen2DGrid(startLat, startLong, endLat, endLong);
    // await getElevation(grid);
    console.log("Horray it worked!")
    // astar();
    console.log(testFunction(grid))
    res.status(200).send({
        "grid": grid
    })
}

function testFunction(node) {
    return node[0].getNeighbors()
    
}
async function getElevation(grid) {
    function Location(node) {
        this.latitude = node.lat;
        this.longitude = node.long;
    }
    const body = {
        "locations":
        []
    }
    function createBody(){
        for (node of grid) {
            body.locations.push(new Location(node))
        }
    }
    createBody();
    async function retrieveElevations() {
        try {
            const response = await client
                .elevation({
                params: {
                    locations: body.locations,
                    key: process.env.API_KEY,
                },
                timeout: 1000,
                })
                return response
            } catch (e) {
                console.log(e.response.data.error_message);
            }
    }

    let res = await retrieveElevations();
    let data = res.data.results;
    addElevations(grid, data);
    
}
function addElevations(graph, data) {
    for (i in graph) {
        graph[i].elevation = data[i].elevation;
    }
}
var coordToNeighbors = {}

function gen2DGrid(startLat, startLong, endLat, endLong){
    function makeNode(lat, long) {
        let node = { 
            "lat": parseFloat((lat).toFixed(4)),
            "long": parseFloat((long).toFixed(4)),
            "neighbors":[],
            "elevation":null,
            "dist":null,
            "edist":null,
            "parent":null,
            getNeighbors: function() {
                return node.neighbors.map((nei) => [nei.lat, nei.long].join(","))
            }
        }
        let key = [node.lat.toString(),node.long.toString()].join(",")
        coordToNeighbors[key] = node;
        node.neighbors = getNeighbors(lat, long);
        grid.push(node);
    }
    let grid = [];
    let step = 3/3600;
    let deltax = (endLat - startLat) / 2;
    let deltay = (endLong - startLong) / 2;
    if (deltax > deltay) {
        deltax= deltax;
        deltay = deltay + 2*((deltax-deltay)/2);
    }
    else {
        deltax = deltax+2*((deltay-deltax)/2);
        deltay= deltay;
    }
    let borderX = deltax;
    let borderY = deltay;
    if(startLat <= endLat){
        for(let lat = startLat-borderX; lat <= endLat+borderX; lat += step){
            if (startLong <= endLong){ 
                for(let long=startLong-borderY; long <= endLong+borderY; long += step){
                    makeNode(lat, long);
                }

            }
            else{
                for(let long = startLong+borderY; long >= endLong-borderY; long -= step){
                    makeNode(lat, long)
                }
            }

        }

    }
    else{
        for(let lat = endLat-borderX; lat >= startLat+borderX; lat -= step){
            if (startLong <= endLong){
                for(let long = startLong-borderY; long <= endLong +borderY; long += step){
                    makeNode(lat, long)
                }

            }
            else{
                for(let long = startLong+borderY; long >= endLong-borderY; long -= step){
                    makeNode(lat, long)
                }
            }

        }
    }

    return grid;
}


function stringToCoord(str) {
    return str.split(",")
}
function getNeighbors(lat, long){
    let neighbors = [];
    neighbors.push({"lat": parseFloat((lat+1/3600).toFixed(4)), "long": parseFloat(long.toFixed(4))});
    neighbors.push({"lat": parseFloat((lat-1/3600).toFixed(4)), "long": parseFloat(long.toFixed(4))});
    neighbors.push({"lat": parseFloat(lat.toFixed(4)), "long": parseFloat((long+1/3600).toFixed(4))});
    neighbors.push({"lat": parseFloat(lat.toFixed(4)), "long": parseFloat((long-1/3600).toFixed(4))});
    return neighbors;

}
function convertToDD(degrees, minutes, seconds){
    return degrees + (minutes/60) + (seconds/360);
}

function convertToDMS(degreeDecimal){
    let degrees = Math.floor(degreeDecimal);
    let remain = degreeDecimal - degrees;
    let minutes = Math.floor(remain*60);
    remain = (remain*60) - minutes;
    let seconds = Math.round(remain*60);
    return {degrees, minutes, seconds};
}
module.exports = {
    processCoords
}