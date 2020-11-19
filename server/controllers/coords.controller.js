require('dotenv').config();
const fetch = require('node-fetch');
const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});
const search = require('../lib/AStar')

const astar = search.AStar;
let step = 3/3600;
let borderX;
let borderY;

const vsearch = require('../lib/vAstar'); 
const { Console } = require('console');
const vprocessNodes = vsearch.processNodes; 
const algo = vsearch.aStarSearch;

var coordToNeighbors = {}

//processCoords needs to be async to get promise
async function processCoords(req, res) {
    console.log(req.body);
    let startLat = req.body.start.lat;
    let startLong = req.body.start.long;
    let endLat = req.body.end.lat;
    let endLong = req.body.end.long;
    let [grid,info] = gen2DGrid(startLat, startLong, endLat, endLong)
    addNeighbors(grid)
    //console.log("Horray it worked!");
    let flattenedGrid = grid.flat();
    await getElevation(flattenedGrid)
    graph = vprocessNodes(flattenedGrid, coordToNeighbors);
    let start_key = [info.startLat,info.startLong].join(",")
    let end_key = [info.endLat,info.endLong].join(",")
    let data = algo(start_key,end_key,coordToNeighbors);
    res.status(200).send({
        "grid": data
    })
}

function addNeighbors(grid) {
    const direcs = [[-1,0],[1,0],[0,-1],[0,1]]
    m = grid.length
    n = grid[0].length
    for (let row = 0; row < m; row++){
        for (let col = 0; col < n; col++) {
            let node = grid[row][col]
            for (direc of direcs){
                let newRow = row + direc[0]
                let newCol = col + direc[1]
                let inbound1 = (newRow < m && newRow >= 0)
                let inbound2 = (newCol < n && newCol >= 0)
                if (inbound1 && inbound2) { 
                    let neiLat = grid[newRow][newCol].lat
                    let neiLong =  grid[newRow][newCol].long
                    node.neighbors.push([neiLat,neiLong].join(","))
                }
           }
        }
    }
}

async function getElevation(grid) {
    function Location(node) {
        this.latitude = node.lat;
        this.longitude = node.long;
    }
    const body = {
        "locations": []
    }
    function createBody(){
        for (let i = 0; i < (grid.length / 512); ++i){
            let tempGrid = grid.slice(i * 512, ((i + 1) * 512)); 
            let bodyRow = [];
            for (node of tempGrid) {
                bodyRow.push(new Location(node));
            }
            body.locations.push(bodyRow);    
        }
    }
    createBody();
    let i = 0;
    for (let locationSet of body.locations){
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
                    return response;
                }
                catch (e) {
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
        if (Number((idx * 512)) + Number(i) < graph.length){
            let index = Number(idx * 512) + Number(i);
            graph[index].elevation = data[i].elevation;
        }
    }
}

function checkNode(currentBest, lat, long, startLat, startLong, endLat, endLong) {
    let startEst = Math.abs(startLat-lat)+Math.abs(startLong-long);
    let endEst = Math.abs(endLat-lat)+Math.abs(endLong-long);
    if (startEst < currentBest.startVal) {
        currentBest.startVal = startEst;
        currentBest.startLong =parseFloat((long).toFixed(4));
        currentBest.startLat = parseFloat((lat).toFixed(4));
    }
    if (endEst < currentBest.endVal) {
        currentBest.endVal = endEst;
        currentBest.endLong =parseFloat((long).toFixed(4));
        currentBest.endLat = parseFloat((lat).toFixed(4));
    }
}

function makeNode(lat, long) {
    let node = { 
        "lat": parseFloat((lat).toFixed(4)),
        "long": parseFloat((long).toFixed(4)),
        "neighbors":[],
        "elevation":null,
        "dist":null,
        "edist":null,
        "parent":null,
    }
    let key = [node.lat.toString(),node.long.toString()].join(",")
    coordToNeighbors[key] = node;
    return node
}

function gen2DGrid(startLat, startLong, endLat, endLong){
    let currentBest = {
        "endVal":Infinity,
        "endLat":null,
        "endLong":null,
        "startVal":Infinity,
        "startLat":null,
        "startLong":null
    }

    let step = 3/3600;
    let deltax = (endLat - startLat) / 2;
    let deltay = (endLong - startLong) / 2;
    if (deltax > deltay) {
        deltax= deltax;
        deltay = deltay + 2*((Math.abs(deltax-deltay))/2);
    }
    else {
        deltax = deltax+2*((Math.abs(deltay-deltax))/2);
        deltay= deltay;
    }

    let borderX = Math.abs(deltax);
    let borderY = Math.abs(deltay);
    let betterGrid = [];    
    if(startLat <= endLat){
        for(let lat = startLat-borderX; lat <= endLat+borderX; lat += step){
            let row = [];
            if (startLong <= endLong){ 
                for(let long=startLong-borderY; long <= endLong+borderY; long += step){
                    checkNode(currentBest,lat, long, startLat, startLong, endLat, endLong)
                    row.push(makeNode(lat, long));   
                }
            }
            else{
                for(let long = startLong+borderY; long >= endLong-borderY; long -= step){
                    checkNode(currentBest,lat, long, startLat, startLong, endLat, endLong)
                    row.push(makeNode(lat, long));           
                }
            }
            betterGrid.push(row)
        }
    } else {
        for(let lat = startLat+borderX; lat >= endLat-borderX; lat -= step){
            let row = [];
            if (startLong <= endLong){
                for(let long = startLong-borderY; long <= endLong +borderY; long += step){
                    checkNode(currentBest,lat, long, startLat, startLong, endLat, endLong)
                    row.push(makeNode(lat, long));
                }
            }
            else{
                for(let long = startLong+borderY; long >= endLong-borderY; long -= step){
                    checkNode(currentBest,lat, long, startLat, startLong, endLat, endLong)
                        row.push(makeNode(lat, long));       
                }
            }
            betterGrid.push(row)
        }
    }    
    return [betterGrid, currentBest];
}

function getBorderX() {
    return borderX;
}

function getBorderY() {
    return borderY;
}

module.exports = {
    processCoords,
    gen2DGrid,
    getBorderX,
    getBorderY
}
