function processCoords(req, res) {
    let startLat = req.body.start.lat;
    let startLong = req.body.start.long;
    let endLat = req.body.end.lat;
    let endLong = req.body.end.long;

    
    res.status(200).send({
        "grid": genGrid(startLat, startLong, endLat, endLong)
    })
}

function genGrid(startLat, startLong, endLat, endLong){
    let grid = [];

    if(startLat <= endLat){
        for(let lat = startLat; lat <= endLat; lat = lat+1/360){
            if (startLong <= endLong){
                for(let long = startLong; long <= endLong; long = long+1/360){
                    let node = {
                        "lat": lat,
                        "long": long,
                        "neighbors":[]
                    }
                    node.neighbors = getNeighbors(lat, long);
                    grid.push(node);
                }

            }
            else{
                for(let long = endLong; long >= startLong; long-1/360){
                    let node = {
                        "lat": lat,
                        "long": long,
                        "neighbors":[]
                    }
                    node.neighbors = getNeighbors(lat, long);
                    grid.push(node);
                }
            }

        }

    }
    else{
        for(let lat = endLat; lat >= startLat; lat = lat-1/360){
            if (startLong <= endLong){
                for(let long = startLong; long <= endLong; long = long+1/360){
                    let node = {
                        "lat": lat,
                        "long": long,
                        "neighbors":[]
                    }
                    node.neighbors = getNeighbors(lat, long);
                    grid.push(node);
                }

            }
            else{
                for(let long = endLong; long >= startLong; long = long-1/360){
                    let node = {
                        "lat": lat,
                        "long": long,
                        "neighbors":[]
                    }
                    node.neighbors = getNeighbors(lat, long);
                    grid.push(node);
                }
            }

        }
    }


    return grid;
}

function getNeighbors(lat, long){
    let neighbors = [];
    neighbors.push({"lat": lat+1/60, "long": long});
    neighbors.push({"lat": lat-1/60, "long": long});
    neighbors.push({"lat": lat, "long": long+1/60});
    neighbors.push({"lat": lat, "long": long-1/60});
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