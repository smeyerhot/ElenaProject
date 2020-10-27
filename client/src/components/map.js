import {Map, TileLayer, Marker, Popup} from "react-leaflet"

export default class MyMap extends React.Component {
  constructor() {
    super();
    this.state = {
      position: [42.3868 , -72.5301],
      markers: []
    };
  }

  //testing for if we want to implement users current location
  // componentDidMount(){

  //   navigator.geolocation.getCurrentPosition((position) => {
  //     this.setPos(position.coords);
  //   });
  // }
  addMarker = (e) => {
    let {markers} = this.state
    if(markers.length === 2){
      markers = [];
    }
    markers.push(e.latlng)
    this.setState({markers})
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
        style = {{height: '100vh', width: '100%'}}
        >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        {this.state.markers.map((position, idx) => 
          <Marker key={`marker-${idx}`} position={position}>
            {console.log(idx)}
              <Popup>
              <span>This is your {idx == 0 ? 'start' : 'end'} point. </span>
              </Popup>
          
        </Marker>
        )}
      </Map>
    );
  }
}