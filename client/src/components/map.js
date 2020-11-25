import {Map, TileLayer, Marker, Popup, Polyline} from "react-leaflet"
import {useState, useEffect} from 'react'

export default function MyMap (props) {

    const [nodeCount, setNodeCount] = useState(0);
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [position, setPosition] = useState([42.3868 , -72.5301]);
    const [path1, setPath1] = useState([]);
    const [path2, setPath2] = useState([]);
    const [path3, setPath3] = useState([]);
    const [markers, setMarkers] = useState([]);


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
        if(props.state.done === true && path1.length === 0 && path2.length==0){
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
                    })
                })
              
                let data = await response.json()
                console.log(data)
                setPath(data)
                

            }
            getPath();


        }
        
    });

    function setPath(body) {
      if (body.grid1 != null) {
        setPath1(path1 => [...path1, start]);
        
          for (let data of body.grid1){    
            let pos = {lat: data.lat, lng: data.long};
            // console.log(pos);
            setPath1(path1 => [...path1, pos]);
            // setGrid(grid => [...grid, pos]);
            
          }     
          setPath1(path1 => [...path1, end]);  
      }
      if (body.grid2 != null) {     
      setPath2(path2 => [...path2, start]);
        for (let data of body.grid2){    
              let pos = {lat: data.lat, lng: data.long};
              setPath2(path2 => [...path2, pos]);
            }
            
        setPath2(path2 => [...path2, end]);

          }
      if (body.grid3 != null) {     
      setPath3(path3=> [...path3, start]);
        for (let data of body.grid3){    
              let pos = {lat: data.lat, lng: data.long};
              setPath3(path3 => [...path3, pos]);
            }
            
        setPath3(path3 => [...path3, end]);

          }
          
        }
    
    function handleClick(e){
        if(nodeCount <2){

            setMarkers(markers => [...markers, e.latlng]);
            
            setNodeCount(nodeCount +1);
        }
        else{
            setMarkers([]);
            setPath1([]);
            setPath2([]);
            setPath3([]);
            setNodeCount(0);
            props.onStateChange({
              'start': null,
              'end': null,
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
        {makePath(path1,"purple")}
        {makePath(path2,"red")}
        {makePath(path3,"blue")}

      </Map>
    );
    }

    
function makePath(path,color) {
  return path.map((position, idx) => {
              if(idx < path.length-1){
                  let line = [[position.lat, position.lng], [path[idx+1].lat, path[idx+1].lng]];
                  return <Polyline key = {idx} color = {color} positions = {line}></Polyline>
              }
          })
        } 
