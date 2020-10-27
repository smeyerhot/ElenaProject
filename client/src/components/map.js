import {Map, TileLayer, Marker, Popup, Polyline} from "react-leaflet"

export default class MyMap extends React.Component {
  constructor() {
    super();
    this.state = {
      position: [42.3868 , -72.5301],
      markers: [],
      path: []
    };
  }

  //testing for if we want to implement users current location
  // componentDidMount(){

  //   navigator.geolocation.getCurrentPosition((position) => {
  //     this.setPos(position.coords);
  //   });
  // }
  addMarker = (e) => {
    let {markers, path} = this.state
    if(markers.length === 2){
      markers = [];
      path = []
    }
    markers.push(e.latlng);
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
  renderLine(){
    let {path, update} = this.state
    update = true;
    this.setState({update});
    if(path.length > 0){
      return <Polyline color = "purple" positions = {path}></Polyline>
    }
    
  }
  render() {
    
    return (
      <Map 
        center={this.state.position} 
        onClick={this.addMarker}
        zoom={14} 
        style = {{height: '100vh', width: '100%'}}
        >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        {this.state.markers.map((position, idx) => 
          <Marker key={`marker-${idx}`} position={position}>
              <Popup>
              <span>This is your {idx == 0 ? 'start' : 'end'} point. </span>
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