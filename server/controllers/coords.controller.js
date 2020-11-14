require('dotenv').config()
const fetch = require('node-fetch');
const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});
const search = require('../lib/AStar')

const astar = search.AStar;

// vanilla 
const vsearch = require('../lib/vAstar'); 
const { Console } = require('console');
const vprocessNodes = vsearch.processNodes; 
const algo = vsearch.aStarSearch;

var coordToNeighbors = {}

//processCoords needs to be async to get promise
async function processCoords(req, res) {
    let startLat = req.body.start.lat;
    let startLong = req.body.start.long;
    let endLat = req.body.end.lat;
    let endLong = req.body.end.long;

    let [grid,info] = gen2DGrid(startLat, startLong, endLat, endLong)
    

    // console.log([startLat,startLong, endLat, endLong])
    // console.log(info.startLat,info.startLong,info.endLat,info.endLong)
    addNeighbors(grid)
    // console.log(grid)
    // console.log('AA grid 0'+JSON.stringify(grid[0], null, 4));
    // console.log(grid.length);
    //await getElevation(grid);
    console.log("Horray it worked!");
    // astar();
    // vanilla 
    let flattenedGrid = grid.flat();
    await getElevation(flattenedGrid)
    console.log(flattenedGrid[0])
    graph = vprocessNodes(flattenedGrid, coordToNeighbors);
    // console.log('graph in coords'+JSON.stringify(graph[0], null, 4));
    // get the start and end key to pass to the search algo
    let start_key = [info.startLat,info.startLong].join(",")
    let end_key = [info.endLat,info.endLong].join(",")
    let data = algo(start_key,end_key,{},coordToNeighbors);

    // upto
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
                    // node.neighbors.push(nei)
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
        // getNeighbors: function() {
        //     // return node.neighbors.map((nei) => [nei.lat, nei.long].join(","))
        //     return node.neighbors;
        // }
    }
    let key = [node.lat.toString(),node.long.toString()].join(",")
    coordToNeighbors[key] = node;
    // console.log('2D gen key '+key);
    // console.log('inside grid2Dgen'+key+' and '+JSON.stringify(coordToNeighbors[key], null, 4));
    // node.neighbors = getNeighbors(lat, long);
    // grid.push(node);
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
    let grid = [];
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

    // AA could we push start and end node to the grid?
    //chnaged here for vanilla
    // makeNode(startLat, startLong);
    // makeNode(endLat, endLong);

    let borderX = Math.abs(deltax);
    let borderY = Math.abs(deltay);
    let betterGrid = [];
    let startNode = null;
    let endNode = null;
    

    // let latStart = null;
    // let latEnd = null;
    // let longStart = null;
    // let longEnd = null;
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
       

    }
    else{
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

// function getNeighbors(lat, long){
//     let neighbors = [];
//     neighbors.push({"lat": parseFloat((lat+1/3600).toFixed(4)), "long": parseFloat(long.toFixed(4))});
//     neighbors.push({"lat": parseFloat((lat-1/3600).toFixed(4)), "long": parseFloat(long.toFixed(4))});
//     neighbors.push({"lat": parseFloat(lat.toFixed(4)), "long": parseFloat((long+1/3600).toFixed(4))});
//     neighbors.push({"lat": parseFloat(lat.toFixed(4)), "long": parseFloat((long-1/3600).toFixed(4))});
//     return neighbors;

// }
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