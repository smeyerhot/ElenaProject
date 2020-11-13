require('dotenv').config()
const fetch = require('node-fetch');
const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});
const search = require('../lib/AStar')
const astar = search.AStar;

// vanilla 
const vsearch = require('../lib/vAstar'); 
const vprocessNodes = vsearch.processNodes; 
const algo = vsearch.aStarSearch;

var coordToNeighbors = {}
var start_end = {}

//processCoords needs to be async to get promise
async function processCoords(req, res) {
    let startLat = req.body.start.lat;
    let startLong = req.body.start.long;
    let endLat = req.body.end.lat;
    let endLong = req.body.end.long;
    let grid = gen2DGrid(startLat, startLong, endLat, endLong);
    // console.log('AA grid 0'+JSON.stringify(grid[0], null, 4));
    // console.log(grid.length);
    //await getElevation(grid);
    console.log("Horray it worked!");
    // astar();
    // vanilla 
    graph = vprocessNodes(grid);
    // console.log('graph in coords'+JSON.stringify(graph[0], null, 4));
    // get the nodes corresponding to lat long values
    // how do i pass start and end node from here?

    let slat = parseFloat((startLat).toFixed(4));
    let slong = parseFloat((startLong).toFixed(4));
    // console.log('coordToNeighbors start'+slat+" "+slong);
    let elat = parseFloat((endLat).toFixed(4));
    let elong = parseFloat((endLong).toFixed(4));
    // get the start and end key to pass to the search algo
    let start_key = [slat.toString(),slong.toString()].join(",")
    let end_key = [elat.toString(),elong.toString()].join(",")

    algo(graph,start_key,end_key,{});
    // upto

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
        for(let i = 0; i<(grid.length/512); ++i){
            let tempGrid = grid.slice(i*512, ((i+1)*512)); 
            
            let bodyRow = [];
            for (node of tempGrid) {
                bodyRow.push(new Location(node));
            }
            body.locations.push(bodyRow);    
        }
    }
    createBody();
    
    let i = 0;
    
    for(let locationSet of body.locations){
        async function retrieveElevations() {
            try {
    
                const response = await client
                    .elevation({
                    params: {
                        locations: locationSet,
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
        addElevations(grid, data, i);
        ++i;
    }
    
    
}
function addElevations(graph, data, idx) {
    for (let i = 0; i < 512; ++i) {
        if(Number((idx*512))+Number(i) < graph.length){
            let index =Number(idx*512) + Number(i);
            
            graph[index].elevation = data[i].elevation;
        }
        
    }
}

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
        // console.log('2D gen key '+key);
        // console.log('inside grid2Dgen'+key+' and '+JSON.stringify(coordToNeighbors[key], null, 4));
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

    // AA could we push start and end node to the grid?
    //chnaged here for vanilla
    makeNode(startLat, startLong);
    makeNode(endLat, endLong);

    let borderX = Math.abs(deltax);
    let borderY = Math.abs(deltay);
    
    if(startLat <= endLat){
        for(let lat = startLat-borderX; lat <= endLat+borderX; lat += step){
            if (startLong <= endLong){ 
                for(let long=startLong-borderY; long <= endLong+borderY; long += step){
                    makeNode(lat, long);
                    
                }

            }
            else{
                for(let long = startLong+borderY; long >= endLong-borderY; long -= step){
                    makeNode(lat, long);
                    
                }
            }
            
        }

    }
    else{
        for(let lat = startLat+borderX; lat >= endLat-borderX; lat -= step){
            
            if (startLong <= endLong){
                for(let long = startLong-borderY; long <= endLong +borderY; long += step){

                    makeNode(lat, long);
                    
                }

            }
            else{
                for(let long = startLong+borderY; long >= endLong-borderY; long -= step){
                    
                    makeNode(lat, long);
                    
                }
            }
            

        }
    }

    return grid;
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