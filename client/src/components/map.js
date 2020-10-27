import {Map, TileLayer, Marker, Popup} from "react-leaflet"

export default class MyMap extends React.Component {
  constructor() {
    super();
    this.state = {
      position: [42.3868 , -72.5301],
      markers: []
    };
  }

  addMarker = (e) => {
    let {markers} = this.state
    if(markers.length === 2){
      markers = [];
    }
    markers.push(e.latlng)
    this.setState({markers})
  }

  render() {
    return (
      <Map 
        center={this.state.position} 
        onClick={this.addMarker}
        zoom={13} 
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