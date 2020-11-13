import {Map, TileLayer, Marker, Popup, Polyline} from "react-leaflet"
import {regIcon, startIcon, endIcon} from "./icons.js"
import {useState, useEffect} from 'react'

export default function MyMap () {
    const [nodeCount, setNodeCount] = useState(0);
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [position, setPosition] = useState([42.3868 , -72.5301]);
    const [path, setPath] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [grid, setGrid] = useState([]);
  
  //testing for if we want to implement users current location
  // useEffect(() =>{
  //  navigator.geolocation.getCurrentPosition((position) => {
  //     setPosition(position.coords);
  //   });
  //})

  //   
  // }
    

    useEffect(()=> {
        if(nodeCount === 1){
            setStart(markers[0]);
        }
        if(nodeCount === 2){
            setEnd(markers[1]);
        }
    }, [markers, nodeCount]);

    useEffect(() => {

        if(grid.length === 0 && nodeCount === 2 && end){
          
            async function getGrid(){
                let response = await fetch('http://localhost:5000/api/coords', {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                      "start": {
                        "lat": start.lat,
                        "long": start.lng
                      },
                      "end": {
                          "lat": end.lat,
                          "long": end.lng
                      }
                    }),
                  }).then(async data =>  {
                    let body = await data.json();
                    // body.then(points => {
                    //   let {grid} = this.state.grid;
              
                    //   console.log(points);
                    //   grid = points;
                    //   this.setState({grid});
                    // }
                    // )})
                    let grid = []
                    let i = 0;
                    for (let data of body.grid){
                      if(i%3 === 0){
                          
                        let pos = {lat: data.lat, lng: data.long};
                        // console.log(pos);
                        setGrid(grid => [...grid, pos]);
                      }
                      ++i;
                    }
                  })
            }
            getGrid();
        }
        
    }, [nodeCount, start, end]);
  
    function handleClick(e){
        if(nodeCount <2){
            setMarkers(markers => [...markers, e.latlng]);
            setPath(path => [...path, e.latlng]);
            setNodeCount(nodeCount +1);
        }
        else{
            setMarkers([]);
            setPath([]);
            setNodeCount(0);
        }
        
           
    }

    
    return (
        
      <Map 
        center={position} 
        onClick={(e) => { 
            handleClick(e);
        }}
        zoom={14} 
        style = {{height: '84vh', width: '100%'}}
        >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />

        {markers.map((position, idx) => {
          return <Marker key={`marker-${idx}`} position={position}>
                  <Popup>
                  <span>This is your node {idx} </span>
                  </Popup>
              
            </Marker>
        })}
        {path.map((position, idx) => {
            if(idx < path.length-1){
                let line = [[position.lat, position.lng], [path[idx+1].lat, path[idx+1].lng]];
                return <Polyline key = {idx} color = "purple" positions = {line}></Polyline>
            }
        })}
        {grid.map((position, idx) => {
            //console.log(position);
          return <Marker key={`marker-${idx}`} position={position}>
                  <Popup>
                  <span>This is your node {idx} </span>
                  </Popup>
              
            </Marker>
        })}

      </Map>
    );
    }

    
