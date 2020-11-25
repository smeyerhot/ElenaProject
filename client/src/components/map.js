import {Map, TileLayer, Marker, Popup, Polyline} from "react-leaflet";
import {useState, useEffect} from 'react';
import dynamic from 'next/dynamic';
const PathSummary = dynamic(()=> import('./pathsummary'), {ssr: false});
export default function MyMap (props) {

    //nodeCount represents the number of markers on the map
    const [nodeCount, setNodeCount] = useState(0);
    //start is the start point of the path
    const [start, setStart] = useState(null);
    //end is the end point of the path
    const [end, setEnd] = useState(null);
    //position is the position at which the map originally renders, currently being set to UMass Campus
    const [position, setPosition] = useState([42.3868 , -72.5301]);
    //path1 is where are purple path is stored, and each value below it represents the path length, net elevation change of that path, and the shortest path between the start and the end 
    const [path1, setPath1] = useState([]);
    const [path1Length, setPath1Length] = useState(0);
    const [path1NetElev, setPath1NetElev] = useState(0);
    const [path1Shortest, setPath1Shortest] = useState(0);
    //path2 is where are red path is stored, and each value below it represents the path length, net elevation change of that path, and the shortest path between the start and the end
    const [path2, setPath2] = useState([]);
    const [path2Length, setPath2Length] = useState(0);
    const [path2NetElev, setPath2NetElev] = useState(0);
    const [path2Shortest, setPath2Shortest] = useState(0);
    //path3 is where the blue path is stored, however it is often not used as this is for our 
    //Bellman Ford algorithm that generally takes too long to run and only returns if a path is found within a few seconds
    const [path3, setPath3] = useState([]);
    //markers is an array of the marker points that we display on the map
    const [markers, setMarkers] = useState([]);
    //viewSummary is the state of showing or not showing the summary panel
    const [viewSummary, setViewSummary] = useState(false);
    //mapWidth sets the map size of the map, which is defaulted to 100% screen width.
    const [mapWidth, setMapWidth] = useState('100%');
    
    //This hook sets the start and end state values and updates the props we are sending for our input component
    useEffect(()=> {
        if(nodeCount === 1){
            setStart(markers[0]);
            props.onStateChange({
              'start': markers[0],
              'end': '',
              'minMax':'', 
              'percent': null, 
              'done': false
            })
        }
        if(nodeCount === 2){
            setEnd(markers[1]);
            props.onStateChange({
              'start': markers[0],
              'end': markers[1],
              'minMax':'', 
              'percent': null, 
              'done': false
            })
        }
    }, [markers, nodeCount]);
    
    //this hook updates the summary panel state value when the input button is clicked
    useEffect(() => {
      setViewSummary(props.viewSummary);
    }, [props.viewSummary])
    
    //this hook updates the width of the map when the view Summary button is clicked
    useEffect(()=>{
      let width = viewSummary ?'85%': '100%';
      setMapWidth(width);
    }, [viewSummary])
    
    //this hook is where we fetch our paths once we have all of the needed information from the user
    useEffect(() => {
        if(props.state.done === true && path1.length === 0 && path2.length==0){
          if(start && end && props.state.percent){
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
                setPath(data)
                
            }
            console.log("Getting Path");
            getPath();
          }
          
          else{
            alert("Please select your start and end points, and choose your maximum path length!");
            props.state.done = false;
          }


        }
        
    });

    //this function sets our path values with the values that are returned from the fetch request above, as well as the necessary information of the path
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
          setPath1Length(body.grid1Length);
          setPath1NetElev(body.grid1ElevNet);
          setPath1Shortest(body.grid1Shortest);
      }
      if (body.grid2 != null) {     
      setPath2(path2 => [...path2, start]);
        for (let data of body.grid2){    
              let pos = {lat: data.lat, lng: data.long};
              setPath2(path2 => [...path2, pos]);
            }
            
        setPath2(path2 => [...path2, end]);
        setPath2Length(body.grid2Length);
        setPath2NetElev(body.grid2ElevNet);
        setPath2Shortest(body.grid2Shortest);
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

    //this function handles the user clicking on the map
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
              'start': '',
              'end': '',
              'minMax':'', 
              'percent': '', 
              'done': false
            })
        }
        
           
    }

    return (
      <div className = 'map-box'>
        <Map 
      center={position} 
      onClick={(e) => { 
          handleClick(e);
      }}
      zoom={14} 
      style = {{height: '84vh', width: mapWidth, display: 'inline-block', position: 'relative'}}
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

        {markers.map((position, idx) => {
          return <Marker key={`marker-${idx}`} position={position}>
                  <Popup>
                  <span>This is your node {idx} </span>
                  </Popup>
              
            </Marker>
        })}
        
      </Map>
        <div className = 'summary-container'>
        <h1 className = 'summary-title'>Path Summaries</h1>
        {path1.length !== 0 ?  <PathSummary  paths = {{path1, path1Length, path1NetElev, path1Shortest, path2, path2Length, path2NetElev, path2Shortest}}></PathSummary>: <p className = 'summary-text'>No Paths Computed Yet. <br></br>Compute a path!</p>}
        </div>
      
    </div>
      
    );
    }

  //this function is called to render the path lines on the map
  function makePath(path,color) {
    return path.map((position, idx) => {
      if(idx < path.length-1){
        let line = [[position.lat, position.lng], [path[idx+1].lat, path[idx+1].lng]];
        return <Polyline key = {idx} color = {color} positions = {line}></Polyline>
      }
    })
  } 
