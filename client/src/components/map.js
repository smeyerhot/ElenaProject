import {Map, TileLayer, Marker, Popup, Polyline} from "react-leaflet"
import {useState, useEffect} from 'react'

export default function MyMap (props) {

    const [nodeCount, setNodeCount] = useState(0);
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [position, setPosition] = useState([42.3868 , -72.5301]);
    const [path, setPath] = useState([]);
    const [markers, setMarkers] = useState([]);
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
            props.onStateChange({
              'start': markers[0],
              'end': '',
              'minMax':'', 
              'percent': '', 
              'done': false
            })
        }
        if(nodeCount === 2){
            setEnd(markers[1]);
            props.onStateChange({
              'start': markers[0],
              'end': markers[1],
              'minMax':'', 
              'percent': '', 
              'done': false
            })
        }
    }, [markers, nodeCount]);

    useEffect(() => {
        if(props.state.done === true && path.length === 0){
            let minMax = props.state.minMax;
            let percent = props.state.percent;
            async function getPath(){
              alert("Processing, please wait!");
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
                      },
                      minMax,
                      percent
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
                    
                    setPath(path => [...path, start]);
                    for (let data of body.grid){    
                      let pos = {lat: data.lat, lng: data.long};
                      // console.log(pos);
                      setPath(path => [...path, pos]);
                      // setGrid(grid => [...grid, pos]);
                      
                    }
                    
                    setPath(path => [...path, end]);
                  })
            }
            getPath();
        }
        
    });
  
    function handleClick(e){
        if(nodeCount <2){

            setMarkers(markers => [...markers, e.latlng]);
            
            setNodeCount(nodeCount +1);
        }
        else{
            setMarkers([]);
            setPath([]);
            setNodeCount(0);
            props.onStateChange({
              'start': '',
              'end': '',
              'minMax':'', 
              'percent': '', 
              'done': false
            })
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
                return <Polyline key = {idx} color = "red" positions = {line}></Polyline>
            }
        })}

      </Map>
    );
    }

    
