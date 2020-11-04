import {Map, TileLayer, Marker, Popup, Polyline} from "react-leaflet"

export default class MyMap extends React.Component {
  constructor() {
    super();
    this.state = {
      position: [42.3868 , -72.5301],
      markers: [],
      path: [],
      grid: []
    };
  }
  componentDidMount(){
    this.getGrid();
    this.setState({state: this.state})
  }
  //testing for if we want to implement users current location
  // componentDidMount(){

  //   navigator.geolocation.getCurrentPosition((position) => {
  //     this.setPos(position.coords);
  //   });
  // }
  async getGrid(){
    let response = await fetch('http://localhost:5000/api/coords', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        "start": {
          "lat": 42.3868,
          "long": -72.5301
        },
        "end": {
            "lat": 42.4007,
            "long": -72.5162
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
      let {markers, path} = this.state;
      let node = {
        from_lat: null,
        from_long:null,
        to_lat: null,
        to_long: null
      }
      let i =0
      for (let data of body.grid){
        if(i%3 === 0){
          let pos = [data.lat, data.long];
          markers.push(pos);
          
        }
        ++i;
      }
      this.setState({markers});
    })
  }
  

  addMarker = (e) => {
    let {markers, path} = this.state;
    if(markers.length === 2){
      markers = [];
      path = []
    }
    markers.push(e.latlng);
    console.log(e.latlng);
    let node;
    if(path.length == 0){
      node = {
        from_lat: e.latlng.lat,
        from_long: e.latlng.lng,
        id: path.length,
        to_lat: '',
        to_long: ''
      }
      path.push(node);
    }
    else{
      node = path[0];
      node.to_lat = e.latlng.lat;
      node.to_long = e.latlng.lng;
    } 
    this.setState({markers, path});
  }

  
  // function to set a new center of map position
  // setPos(pos){
  //   let {position} = this.state;
  //   position = [pos.latitude, pos.longitude];
  //   this.setState({position})
  // }

  render() {
    return (
      <Map 
        center={this.state.position} 
        onClick={this.addMarker}
        zoom={14} 
        style = {{height: '84vh', width: '100%'}}
        >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        {this.state.markers.map((position, idx) => 
          <Marker key={`marker-${idx}`} position={position}>
              <Popup>
              <span>This is your node {idx} </span>
              </Popup>
          
        </Marker>
        
        )}
        {this.state.path.map(({id, from_lat, from_long, to_lat, to_long }) => {
          if(to_lat.length !== 0){
            let line = [[from_lat, from_long], [to_lat, to_long]];
            return <Polyline key = {id} color = "purple" positions = {line}></Polyline>
          }
          
        })}

        
      </Map>
    );
  }
}