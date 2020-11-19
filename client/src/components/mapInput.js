import {Map, TileLayer, Marker, Popup, Polyline} from "react-leaflet"
import {useState, useEffect} from 'react'
import Link from 'next/link'
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
        
      <div class = " flex  inset-x-0 top-0 text-center bg-orange-500 p-3">
          <Link href="/">
          <a>
            <h1 className="text-black text-3xl font-bold mt-6">Elena</h1>
          </a>
          </Link>
          <div class = "flex-1 mx-32  text-center rounded-lg">
            <label for = "startPoint" className = "ml-1 font-bold"> Start: </label>
            <input id = "startPoint" type = "text" className = "input-small inline-block text-center " placeholder = "Start Point: [lat, lng]" value = {props.state.start} onChange = {(e) => setState({start: e.target.value, end: state.end, minMax: state.minMax, percent: state.percent})}></input>
            <label for = "endPoint" className = "font-bold"> End: </label>
            <input id = "endPoint" type = "text" className = "input-small inline-block text-center" placeholder = "End Point: [lat, lng]" value = {props.state.end} onChange = {(e) => setState({start: state.start, end: e.target.value, minMax: state.minMax, percent: state.percent})}></input>
            <label for = "minMax" className = "font-bold"> Elevation Gain: </label>
            <select id = "minMax" class="inline-block  text-center bg-white border border-gray-400 hover:border-gray-500 px-2 py-2 pr-1 rounded shadow leading-tight focus:outline-none focus:shadow-outline" onChange = {(e) => setState({start: state.start, end: state.end, minMax: e.target.value, percent: state.percent})}>
                <option>Minimize</option>
                <option>Maximize</option>
            </select>
            <label for = "%" className = "ml-5 font-bold"> Path length (%): </label>
            <span><input id = "%" type="number" className = "input-small inline-block text-center" placeholder = "1-200" min = '1' max = '200'onChange = {(e) => setState({start: state.start, end: state.end, minMax: state.minMax, percent: e.target.value})}/></span>
            <button class = "button bg-black text-white border-black btn" onClick = {sendData}>Calculate Path </button>
            <br/>
            <small class = "block inset-x-0 top-0 text-center font-bold">Click a start and an end point on the map, select to minimize or maximize elevation gain, input the maximum percentage of shortest path, then click "Calculate Path" to render your path.</small>
            <small class = "block inset-x-0 top-0 text-center font-bold">Click the map again to begin calculating a new path.</small>
            
          </div>
          <div>
          
          </div>
          
        
      </div>
    )

}