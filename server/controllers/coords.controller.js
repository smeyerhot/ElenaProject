function processCoords(req, res) {
    let startLat = req.body.start.lat;
    let startLong = req.body.start.long;
    let endLat = req.body.end.lat;
    let endLong = req.body.end.long;

    
    res.status(200).send({
        "grid": genGrid(startLat, startLong, endLat, endLong)
    })
}
//{
//     "start": {
//         "lat": 42.3868,
//         "long": -72.5301
//     },
//     "end": {
//         "lat": 42.4007,
//         "long": -72.5162
//     }
// }

function genGrid(startLat, startLong, endLat, endLong){
    let grid = [];
    let step = 1/3600;
    let borderX = 5/3600;
    let borderY = 5/3600;
    // let start = {
    //     lat: parseFloat((startLat).toFixed(4)),
    //     long: parseFloat((startLong).toFixed(4)),
    //     neighbors: []
    // }
    // start.neighbors = getNeighbors(startLat, startLong);
    // grid.push(start);
    if(startLat <= endLat){
        for(let lat = startLat-borderX; lat <= endLat+borderX; lat += step){
            if (startLong <= endLong){ 
                for(let long=startLong-borderY; long <= endLong+borderY; long += step){
                    let node = { 
                        "lat": parseFloat((lat).toFixed(4)),
                        "long": parseFloat((long).toFixed(4)),
                        "neighbors":[]
                    }
                    node.neighbors = getNeighbors(lat, long);
                    grid.push(node);
                }

            }
            else{
                for(let long = startLong+borderY; long >= endLong-borderY; long -= step){
                    let node = {
                        "lat": parseFloat((lat).toFixed(4)),
                        "long": parseFloat((long).toFixed(4)),
                        "neighbors":[]
                    }
                    node.neighbors = getNeighbors(lat, long);
                    grid.push(node);
                }
            }

        }

    }
    else{
        for(let lat = endLat-borderX; lat >= startLat+borderX; lat -= step){
            if (startLong <= endLong){
                for(let long = startLong-borderY; long <= endLong +borderY; long += step){
                    let node = {
                        "lat": parseFloat((lat).toFixed(4)),
                        "long": parseFloat((long).toFixed(4)),
                        "neighbors":[]
                    }
                    node.neighbors = getNeighbors(lat, long);
                    grid.push(node);
                }

            }
            else{
                for(let long = startLong+borderY; long >= endLong-borderY; long -= step){
                    let node = {
                        "lat": parseFloat((lat).toFixed(4)),
                        "long": parseFloat((long).toFixed(4)),
                        "neighbors":[]
                    }
                    node.neighbors = getNeighbors(lat, long);
                    grid.push(node);
                }
            }

        }
    }
    // let end = {
    //     lat: parseFloat((endLat).toFixed(4)),
    //     long: parseFloat((endLong).toFixed(4)),
    //     neighbors: []
    // }
    // end.neighbors = getNeighbors(endLat, endLong);
    // grid.push(end);

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