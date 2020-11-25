require('dotenv').config();
const fetch = require('node-fetch');
const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});



let step = 3/3600;
let borderX;
let borderY;

const vsearch = require('../lib/pathfinders'); 
const estar = vsearch.eStar;
const vprocessNodes = vsearch.processNodes; 
const hybrid = vsearch.aStarSearch;
const bellmanford = vsearch.BellmanFord;

var coordToNeighbors = {}

//processCoords needs to be async to get promise
async function processCoords(req, res) {
    let startLat = req.body.start.lat;
    let startLong = req.body.start.long;
    let pref = req.body.minMax;
    let x_percent = JSON.parse(req.body.percent);
    let endLat = req.body.end.lat;
    let endLong = req.body.end.long;
    let [grid,info] = gen2DGrid(startLat, startLong, endLat, endLong)
    addNeighbors(grid)
    let flattenedGrid = grid.flat();
    await getElevation(flattenedGrid)
    vprocessNodes(flattenedGrid, coordToNeighbors);
    
    let start_key = [info.startLat,info.startLong].join(",")
    let end_key = [info.endLat,info.endLong].join(",")
    let payload = {
        "grid1":null,
        "grid1Length":null,
        "grid1ElevNet": null,
        "grid1Shortest": null,
        "grid2":null,
        "grid2Length":null,
        "grid2ElevNet": null,
        "grid2Shortest": null,
        "grid3":null,
        "toolong":false
    }
    
    let [p1, _, minDist] = [...bellmanford(start_key,end_key,coordToNeighbors, pref, x_percent)];

    if (p1!=null){
        payload["grid3"] = p1
    } 
    let [path, dist] = [...hybrid(start_key,end_key,coordToNeighbors, pref, x_percent)];
    
    if (path!=null){
        payload["grid1"] = path
        payload["grid1Length"] = calculatePathDistance(path);
        payload['grid1ElevNet'] = calculateNetElevation(path);
        payload['grid1Shortest'] = haversine_distance(path[0], path[path.length -1]);
    } 
    vprocessNodes(flattenedGrid, coordToNeighbors);
    let [p,hybridDist] = [...estar(start_key,end_key,coordToNeighbors, pref, x_percent)]
    payload["grid2"] = p
    payload['grid2Length'] = calculatePathDistance(p);
    payload['grid2ElevNet'] = calculateNetElevation(p);
    payload['grid2Shortest'] = haversine_distance(p[0], p[p.length -1]);
    // if (dist > minDist){
    //     payload["toolong"] = true
    // }
    console.log("Complete");
    res.status(200).send(payload)
   
}
function addNeighbors(grid) {
    const direcs = [[-1,0],[-1, -1],[1,0],[1,1],[0,-1],[1,-1],[0,1],[-1, 1]]
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

    borderX = Math.abs(deltax);
    borderY = Math.abs(deltay);
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

function calculateNetElevation(path){
    let net = 0;
    for(let i = 0; i<path.length-1; ++i){
        net += path[i].elevation - path[i+1].elevation;
    }
    return parseFloat(net.toFixed(3));
}
function calculatePathDistance(path){
    let dist = 0;
    for(let i = 0; i<path.length-1; ++i){
        dist += haversine_distance(path[i], path[i+1]);
    }
    return parseFloat(dist.toFixed(3));
}
function haversine_distance(node1,node2) {
    var R = 3958.8; // Radius of the Earth in miles
    var lat_1 = node1.lat * (Math.PI/180); // degrees to radians
    var lat_2 = node2.lat * (Math.PI/180); // degrees to radians
    var d_latitude = lat_2-lat_1; // Radian difference (latitudes)
    var d_longitude = (node2.long-node1.long) * (Math.PI/180); // Radian difference (longitudes)
    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(d_latitude/2)*Math.sin(d_latitude/2)+Math.cos(lat_1)*Math.cos(lat_2)*Math.sin(d_longitude/2)*Math.sin(d_longitude/2)));
    
    return d;

}

function getBorderX() {
    return borderX;
}

function getBorderY() {
    return borderY;
}

function getStep() {
    return step;
}

module.exports = {
    processCoords,
    gen2DGrid,
    addNeighbors,
    getBorderX,
    getBorderY,
    getStep
}
