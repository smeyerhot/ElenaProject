import {Map, TileLayer, Marker, Popup, Polyline} from "react-leaflet"
import {useState, useEffect} from 'react'
export default function MapInput (props) {

    const [state, setState] = useState({
      'start': '',
      'end': '',
      'minMax': '',
      'percent': ''
    });
    function sendData(){
      let values = {
        start: props.state.start,
        end: props.state.end,
        minMax: state.minMax,
        percent: state.percent,
        done: true
      }
      props.onStateChange(values);
    }
  

    return (
        
      <div class = " flex bg-white-500 inset-x-0 top-0 text-center bg-orange-500 pb-1">
          <div class = "flex-1 bg-gray-300 mx-64 text-center rounded-lg">
            <label for = "startPoint" class = "ml-1"> Start Point: </label>
            <input id = "startPoint" type = "text" class = "input-small inline-block text-center" placeholder = "Start Point: [lat, lng]" value = {props.state.start} onChange = {(e) => setState({start: e.target.value, end: state.end, minMax: state.minMax, percent: state.percent})}></input>
            <label for = "endPoint" > End Point: </label>
            <input id = "endPoint" type = "text" class = "input-small inline-block text-center" placeholder = "End Point: [lat, lng]" value = {props.state.end} onChange = {(e) => setState({start: state.start, end: e.target.value, minMax: state.minMax, percent: state.percent})}></input>
            <label for = "minMax"> Min or Max: </label>
            <select id = "minMax" class="inline-block  text-center bg-white border border-gray-400 hover:border-gray-500 px-2 py-2 pr-1 rounded shadow leading-tight focus:outline-none focus:shadow-outline" onChange = {(e) => setState({start: state.start, end: state.end, minMax: e.target.value, percent: state.percent})}>
                <option>Minimize</option>
                <option>Maximize</option>
            </select>
            <label for = "%" class = "ml-5"> x% of Path: </label>
            <input id = "%" type="text" class = "input-small inline-block text-center" placeholder = "10%" onChange = {(e) => setState({start: state.start, end: state.end, minMax: state.minMax, percent: e.target.value})}/>
            <button class = "button bg-black text-white border-black btn" onClick = {sendData}>Submit </button>
            <br/>
            <small class = "block inset-x-0 top-0 text-center">Or can also click two points on the map</small>
            
          </div>
          <div>
          
          </div>
          
        
      </div>
    )

}