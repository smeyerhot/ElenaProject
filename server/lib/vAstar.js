
const heap = require('./heap'); 
const BinaryHeap = heap.BinaryHeap;
/**
 * 
 * @param {*} grid - grid2DGen
 * returns the graph from the grid
 */

class Graph {
  constructor(dict,min_max) {
    this.dict = dict
    this.opt = min_max
    this.edges = []
    
    
  }
  addEdge(u) {
    let neighbors = this.dict[u].neighbors;
    for (let i=0; i < neighbors.length;i++) {
      let v = neighbors[i]
      let nei  = this.dict[v]
      let w = getEdist(this.dict[u], nei, this.opt)
      
      this.edges.push([u,v,w])
    }
  }
}
function BellmanFord(startkey, endkey,dict,min_max,x_val) {
  var begin = new Date().getTime();
  const x = x_val/100;
  
  let g = new Graph(dict,min_max)
  for (node of Object.keys(dict))
    g.addEdge(node)
  let start = dict[startkey];
  let end =  dict[endkey];
  start.edist = 0;
  start.dist = 0;
  let n = Object.keys(dict).length
  for (key in dict){
    for (edge of g.edges){
      var curr = new Date().getTime();
      if ((curr - begin) > 2000) {
        return [null,null,null]
      }
      let [u, v, w] = [...edge]
      node = dict[u]
      nei = dict[v]
      let value = node.edist + w
      
      if (node.edist != Infinity && value < nei.edist) {
        nei.edist = value
        nei.dist = heuristics.haversine_distance(nei,node) + node.dist
        nei.parent = node
      }
      console.log(edge)
    }
  }
  //There are never any negative weight cycles because starting at ending at the same location is a weight 0 cycle.
  return [pathTo(end), end.dist, heuristics.haversine_distance(start,end)* x]

}


function nodeToCoords(node){
  let key = [node.lat.toString(),node.long.toString()].join(",")
  return key
}

function processNodes(grid, dict)
{
    console.log('Processing nodes');

    var graph = [];
    console.log('processNodes grid length'+grid.length);
    for(gridNode of grid)
    {
        var node = new nodeValue(gridNode.lat,gridNode.long,gridNode.neighbors,0,0,0,false,false,null,gridNode.elevation,Infinity,Infinity);
        graph.push(node);
        let key = [node.lat.toString(),node.long.toString()].join(",")
        dict[key]=node;
    }
    return graph;

}

// not taking into account elevation currently
// try changing it to more better approach
function nodeValue(lat,long,neighbors,f,g,h,closed,visited,parent,elevation,edist,dist) {
    this.lat = lat;
    this.long = long;
    this.neighbors = neighbors;
    this.f = f;
    this.g = g;
    this.h = h;
    this.visited = visited;
    this.closed = closed;
    this.parent =  parent;
    this.elevation = elevation;
    this.edist=edist
    this.dist=dist
}
function pathTo(node) {
    var curr = node;
    var path = [];
    while (curr.parent) {
      path.unshift(curr); // add to the beginning of the array
      curr = curr.parent;
    }
    return path;
}

function getHeap() {
    return new BinaryHeap(function(node) {
      return node.f;
    });
}
function getElevationHeap() {
    return new BinaryHeap(function(node) {
      return node.f + node.edist;
    });
}
function dictMutator(dict, offset) {
  console.log(offset)
  for (idx in dict) {
    console.log(dict[idx].elevation )
    dict[idx].elevation = dict[idx].elevation - offset;
    console.log(dict[idx].elevation)
  }
}


// graph and start and end node of the grid
function eStar(startkey, endkey, dict,min_max,x_val) {

      const x = x_val/100;

      let start = dict[startkey];
      let end =  dict[endkey];
      start.edist = 0;     
      var heuristic =  heuristics.haversine_distance;
      var openHeap = getHeap(); 
      openHeap.push(start);
      start.h = heuristic(start, end); 

      while (openHeap.size() > 0) {
        var currentNode = openHeap.pop();
        if (currentNode == end) {
            return [pathTo(end),end.edist];
        }     
        currentNode.closed = true; 
        var neighbors = currentNode["neighbors"];
        for (var i = 0; i < neighbors.length; i++) {
          let key  = neighbors[i]
          var neighbor = dict[key];
          if (neighbor.closed) {
            continue;
          }
          let best = heuristic(start,neighbor) * x
          var gScore = currentNode.g + heuristic(currentNode,neighbor);
          var eScore = currentNode.edist + getEdist(currentNode, neighbor, min_max);
          if (gScore > best)
            continue
          var beenVisited = neighbor.visited;
          if (!beenVisited || gScore < neighbor.g) {
            neighbor.visited = true;
            neighbor.parent = currentNode;
            neighbor.h = getEdist(neighbor, end)
            neighbor.g = gScore;
            neighbor.edist = eScore;
            neighbor.f = eScore + getEdist(neighbor, end)
            if (!beenVisited) {
              openHeap.push(neighbor);
            } else {
              openHeap.rescoreElement(neighbor);
            }
          }
        }
      }
      return [pathTo(currentNode), end.edist];
    }

function aStarSearch(startkey, endkey, dict,min_max,x_val) {

      const x = x_val/100;

      let start = dict[startkey];
      let end =  dict[endkey];
      start.edist = 0;     
      var heuristic =  heuristics.haversine_distance;
      var openHeap = getElevationHeap(); 
      openHeap.push(start);
      start.h = heuristic(start, end); 

      while (openHeap.size() > 0) {
        // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
        var currentNode = openHeap.pop();
        // End case -- result has been found, return the traced path.
        if (currentNode == end) {
            return [pathTo(end),end.edist];
        }     
        // Normal case -- move currentNode from open to closed, process each of its neighbors.
        currentNode.closed = true; 
        // Find all neighbors for the current node.
        var neighbors = currentNode["neighbors"];
        //iterate through neighbors
        for (var i = 0; i < neighbors.length; i++) {
         // find neighbor node in graph corresponding to key
          let key  = neighbors[i]
        //  var neighbor_node = dict[key]; // currently only lat long
          if (!dict.hasOwnProperty(key)) {
            console.log(key)
            console.log("Node not in graph!")
            continue
          }
          var neighbor = dict[key];
          if (neighbor.closed) {
            // Not a valid node to process, skip to next neighbor.
            continue;
          }
          // The escore is the shortest elevation distance from start to current node.
          // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
          // up to currnode+cost between curr and neighbor 
          const best = heuristics.haversine_distance(start, neighbor) * x
          var gScore = currentNode.g + heuristic(currentNode,neighbor);
          var eScore = currentNode.edist + getEdist(currentNode, neighbor, min_max);
          if (gScore > best)
            continue
          var beenVisited = neighbor.visited;
          if (!beenVisited || gScore < neighbor.g) {
            // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
            neighbor.visited = true;
            neighbor.parent = currentNode;
            neighbor.h = neighbor.h || heuristic(neighbor, end);
            neighbor.g = gScore;
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.edist = eScore;
            if (!beenVisited) {
              // Pushing to heap will put it in proper place based on the 'f' value.
              // console.log('pushing node in heap');
              openHeap.push(neighbor);
            } else {
              // Already seen the node, but since it has been rescored we need to reorder it in the heap
              openHeap.rescoreElement(neighbor);
            }
          }
        }
      }
      return [pathTo(currentNode), end.edist];
    }
function getEdist(node1, node2, min_max) {
  
  let edi = node2.elevation - node1.elevation
  if(min_max === 'Maximize') 
    edi = -edi;
  return edi
}

function euclidean(node1, node2) {
  let x0,x1,y0,y1
  x0 = node1.long;
  x1 = node2.long;
  y0 = node1.lat;
  y1 = node2.lat;
  let euc = Math.sqrt((x0-x1)**2 + (y0-y1)**2)
  return euc
}
var heuristics = {    
    manhattan: function(node1 , node2){
        var d1 = Math.abs(node2.lat - node1.lat);
        var d2 = Math.abs(node2.long - node1.long);
        var d3 = Math.abs(node1.elevation - node2.elevation);
        return d1 + d2 + d3;
    },
    haversine_distance: function(node1,node2) {
        var R = 3958.8; // Radius of the Earth in miles
        var lat_1 = node1.lat * (Math.PI/180); // degrees to radians
        var lat_2 = node2.lat * (Math.PI/180); // degrees to radians
        var d_latitude = lat_2-lat_1; // Radian difference (latitudes)
        var d_longitude = (node2.long-node1.long) * (Math.PI/180); // Radian difference (longitudes)
        var d = 2 * R * Math.asin(Math.sqrt(Math.sin(d_latitude/2)*Math.sin(d_latitude/2)+Math.cos(lat_1)*Math.cos(lat_2)*Math.sin(d_longitude/2)*Math.sin(d_longitude/2)));
        // fixing it to 4 decimal values
        // d = d.toFixed(4) // took assumption to 4 decimal places
        // return parseInt(d);
        //maximize elevation
        
        return d;

    }
}



module.exports = {
    processNodes,
    aStarSearch,
    BellmanFord,
    eStar
}