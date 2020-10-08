import {Map, TileLayer} from "react-leaflet"

export default function MyMap() {

      return (
        <Map center={[42.3868 , -72.5301]} zoom={14} style = {{height: '100vh', width: '100%'}} >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
        </Map>
      );
}

