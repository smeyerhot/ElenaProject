import {Map, TileLayer} from "react-leaflet"

export default function MyMap() {

      return (
        <Map center={[0, 0]} zoom={4} style = {{height: 600, width: '100%'}} >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
        </Map>
      );
}

