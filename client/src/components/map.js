import {Map, TileLayer} from "react-leaflet"

 function MyMap() {

  
    const position = [0, 0];

    if(typeof window !== 'undefined'){
      return (
        <Map center={position} zoom={4} style = {{height: 300, width: '100%'}} >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
        </Map>
      );
    }
    else return (<div></div>)
}

export default MyMap;