// added start and end node as part of the grid

function BinaryHeap(scoreFunction) {
    this.content = [];
    this.scoreFunction = scoreFunction;
  }
  BinaryHeap.prototype = {
    push: function(element) {
      // Add the new element to the end of the array.
      this.content.push(element);
  
      // Allow it to sink down.
      this.sinkDown(this.content.length - 1);
    },
    pop: function() {
      // Store the first element so we can return it later.
      var result = this.content[0];
      // Get the element at the end of the array.
      var end = this.content.pop();
      // If there are any elements left, put the end element at the
      // start, and let it bubble up.
      if (this.content.length > 0) {
        this.content[0] = end;
        this.bubbleUp(0);
      }
      return result;
    },
    remove: function(node) {
      var i = this.content.indexOf(node);
      // When it is found, the process seen in 'pop' is repeated
      // to fill up the hole.
      var end = this.content.pop();
  
      if (i !== this.content.length - 1) {
        this.content[i] = end;
  
        if (this.scoreFunction(end) < this.scoreFunction(node)) {
          this.sinkDown(i);
        } else {
          this.bubbleUp(i);
        }
      }
    },
    size: function() {
      return this.content.length;
    },
    rescoreElement: function(node) {
      this.sinkDown(this.content.indexOf(node));
    },
  
    sinkDown: function(n) {
      // Fetch the element that has to be sunk.
      var element = this.content[n];
  
      // When at 0, an element can not sink any further.
      while (n > 0) {
  
        // Compute the parent element's index, and fetch it.
        var parentN = ((n + 1) >> 1) - 1;
        var parent = this.content[parentN];
        // Swap the elements if the parent is greater.
        if (this.scoreFunction(element) < this.scoreFunction(parent)) {
          this.content[parentN] = element;
          this.content[n] = parent;
          // Update 'n' to continue at the new position.
          n = parentN;
        }
        // Found a parent that is less, no need to sink any further.
        else {
          break;
        }
      }
    },
    bubbleUp: function(n) {
      // Look up the target element and its score.
      var length = this.content.length;
      var element = this.content[n];
      var elemScore = this.scoreFunction(element);
  
      while (true) {
        // Compute the indices of the child elements.
        var child2N = (n + 1) << 1;
        var child1N = child2N - 1;
        // This is used to store the new position of the element, if any.
        var swap = null;
        var child1Score;
        // If the first child exists (is inside the array)...
        if (child1N < length) {
          // Look it up and compute its score.
          var child1 = this.content[child1N];
          child1Score = this.scoreFunction(child1);
  
          // If the score is less than our element's, we need to swap.
          if (child1Score < elemScore) {
            swap = child1N;
          }
        }
  
        // Do the same checks for the other child.
        if (child2N < length) {
          var child2 = this.content[child2N];
          var child2Score = this.scoreFunction(child2);
          if (child2Score < (swap === null ? elemScore : child1Score)) {
            swap = child2N;
          }
        }
  
        // If the element needs to be moved, swap it, and continue.
        if (swap !== null) {
          this.content[n] = this.content[swap];
          this.content[swap] = element;
          n = swap;
        }
        // Otherwise, we are done.
        else {
          break;
        }
      }
    }
  }
/**
 * 
 * @param {*} grid - grid2DGen
 * returns the graph from the grid
 */
function processNodes(grid, dict)
{
    console.log('Processing nodes');

    var graph = [];
    console.log('processNodes grid length'+grid.length);
    for(gridNode of grid)
    {
        // console.log('grid_node'+JSON.stringify(gridNode, null, 4));
        var node = new nodeValue(gridNode.lat,gridNode.long,gridNode.neighbors,0,0,0,false,false,null);
        graph.push(node);
        let key = [node.lat.toString(),node.long.toString()].join(",")
        dict[key]=node;
        // console.log('dict: '+key);
    }
    return graph;

}

// not taking into account elevation currently
// try changing it to more better approach
function nodeValue(lat, long,neighbors,f,g,h,closed,visited,parent) {
    this.lat = lat;
    this.long = long;
    this.neighbors = neighbors;
    this.f = f;
    this.g = g;
    this.h = h;
    this.visited = visited;
    this.closed = closed;
    this.parent =  parent;
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

// graph and start and end node of the grid
function aStarSearch(startkey, endkey, options,dict) {
      let start = dict[startkey];
      let end =  dict[endkey];
      // console.log('aStarSearch start '+JSON.stringify(start, null, 4));
      // console.log('aStarSearch  end '+JSON.stringify(start, null, 4));
      var heuristic =  heuristics.manhattan;
      var closest = options.closest || false;
      var openHeap = getHeap(); 
      openHeap.push(start);
      var closestNode = start; // set the start node to be the closest if required
      start.h = heuristic(start, end); 
      // console.log('original heuristic:'+start.h);

      while (openHeap.size() > 0) {
        // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
        var currentNode = openHeap.pop();
        // End case -- result has been found, return the traced path.
        if (currentNode == end) {
            // console.log('path found:'+pathTo(currentNode))
            return pathTo(end);
        }     
        // Normal case -- move currentNode from open to closed, process each of its neighbors.
        currentNode.closed = true; 
        // console.log('*****************************************');
        // console.log('currentNode: '+JSON.stringify(currentNode, null, 4));
        // console.log('*****************************************');
        // Find all neighbors for the current node.
        var neighbors = currentNode["neighbors"];
        // console.log('neighbors: '+neighbors.length); // obtain neighbors
        // console.log('neighbors: '+neighbors[0].lat); // obtain neighbors
        //iterate through neighbors
        for (var i = 0; i < neighbors.length; i++) {
         // find neighbor node in graph corresponding to key
        //  let key  = [neighbors[i].lat.toString(),neighbors[i].long.toString()].join(",");
          let key  = neighbors[i]
        //  var neighbor_node = dict[key]; // currently only lat long
          // console.log('----------key----------'+key);
          if (!dict.hasOwnProperty(key)) {
            console.log(key)
            console.log("Node not in graph!")
            continue
          }
          var neighbor = dict[key];
          // console.log('neighbor: '+JSON.stringify(neighbor, null, 4));
          if (neighbor.closed) {
            // Not a valid node to process, skip to next neighbor.
            // console.log('closed: '+neighbor.idx);
            continue;
          }
          // The g score is the shortest distance from start to current node.
          // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
          // upto currnode+cost between curr and neighbor
          var gScore = currentNode.g + heuristic(currentNode,neighbor);
          var beenVisited = neighbor.visited;
          // console.log('beenVisited initial: '+beenVisited);
          if (!beenVisited || gScore < neighbor.g) {
            // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
            neighbor.visited = true;
            // console.log('beenVisited set now: '+ neighbor.visited);
            neighbor.parent = currentNode;
            neighbor.h = neighbor.h || heuristic(neighbor, end);
            // console.log('h score '+neighbor.h);
            neighbor.g = gScore;
            neighbor.f = neighbor.g + neighbor.h;
            // console.log('f score '+neighbor.f);
            if (closest) {
              // If the neighbour is closer than the current closestNode or if it's equally close but has
              // a cheaper path than the current closest node then it becomes the closest node
              if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
                closestNode = neighbor;
              }
            }
            if (!beenVisited) {
              // Pushing to heap will put it in proper place based on the 'f' value.
              // console.log('pushing node in heap');
              openHeap.push(neighbor);
            } else {
              // Already seen the node, but since it has been rescored we need to reorder it in the heap
              openHeap.rescoreElement(neighbor);
            }
            // console.log('updated node'+JSON.stringify(neighbor, null, 4));
          }
        }
      }
      //Specifies whether to return the path to the closest node if the target is unreachable.
      if (closest) {
        return pathTo(closestNode);
      }
  
    //   // No result was found - empty array signifies failure to find path.
      return pathTo(currentNode);
    }

var heuristics = {    
    manhattan: function(node1 , node2){
        var d1 = Math.abs(node2.lat - node1.lat);
        var d2 = Math.abs(node2.long - node1.long);
        var d3 = Math.abs(node1.elevation - node2.elevation);
        return d1 + d2;
    },
    haversine_distance: function(node1,node2) {
        var R = 3958.8; // Radius of the Earth in miles
        var lat_1 = node1.lat * (Math.PI/180); // degrees to radians
        var lat_2 = node2.lat * (Math.PI/180); // degrees to radians
        var d_latitude = lat_2-lat_1; // Radian difference (latitudes)
        var d_longitude = (node2.long-node1.long) * (Math.PI/180); // Radian difference (longitudes)
        var d = 2 * R * Math.asin(Math.sqrt(Math.sin(lat_1/2)*Math.sin(d_latitude/2)+Math.cos(lat_1)*Math.cos(lat_2)*Math.sin(d_longitude/2)*Math.sin(d_longitude/2)));
        // fixing it to 4 decimal values
        d = d.toFixed(4) // took assumption to 4 decimal places
        return parseInt(d);
    }
}



module.exports = {
    processNodes,
    aStarSearch
}