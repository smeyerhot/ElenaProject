import {useState, useEffect} from 'react'
import Link from 'next/link'
export default function MapInput (props) {
    const [state, setState] = useState({
      'start': null,
      'end': null,
      'minMax': '',
      'percent': 100
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
    useEffect(()=> {
      setState(
        {
          start: props.state.start,
          end: props.state.end,
          minMax: props.state.minMax,
          percent: props.state.percent,
          done: props.state.done
        }
      )
    }, [props])
    
    function toggleSummaryPanel(){
      props.setViewSummary(!props.viewSummary);
    }

    return (
        
      <div className = " flex  inset-x-0 top-0 text-center bg-orange-500 p-3">
          <Link href="/">
          <a>
            <h1 className="text-black text-3xl font-bold mt-6">Elena</h1>
          </a>
          </Link>
          <div className = "flex-1 mx-32  text-center rounded-lg">
            <label for = "startPoint" className = "ml-1 font-bold"> Start: </label>
            <input id = "startPoint" type = "text" className = "input-large inline-block text-center" placeholder = "Start Point: [lat, lng]" value = {state.start ? state.start : ''} onChange = {(e) => setState({start: e.target.value, end: state.end, minMax: state.minMax, percent: state.percent})}></input>
            <label for = "endPoint" className = "font-bold"> End: </label>
            <input id = "endPoint" type = "text" className = "input-large inline-block text-center" placeholder = "End Point: [lat, lng]" value = {state.end ? state.end : ''} onChange = {(e) => setState({start: state.start, end: e.target.value, minMax: state.minMax, percent: state.percent})}></input>
            <label for = "minMax" className = "font-bold"> Elevation Gain: </label>
            <select id = "minMax" className="inline-block  text-center bg-white border border-gray-400 hover:border-gray-500 px-2 py-2 pr-1 rounded shadow leading-tight focus:outline-none focus:shadow-outline" onChange = {(e) => setState({start: state.start, end: state.end, minMax: e.target.value, percent: state.percent})}>
                <option value = 'Minimize' selected>Minimize</option>
                <option value = 'Maximize'>Maximize</option>
            </select>
            <label htmlFor = "%" className = "ml-5 font-bold" > Path length (%): </label>
            <span><input id = "%" type="number" className = "input-small inline-block text-center" value = {state.percent ? state.percent : null} placeholder = "100-400" min = '100' max = '400'onChange = {(e) => setState({start: state.start, end: state.end, minMax: state.minMax, percent: e.target.value})}/></span>
            <button className = "button bg-black text-white border-black btn" onClick = {sendData}>Calculate Path </button>
            <button className = "button bg-black text-white border-black btn" onClick = {toggleSummaryPanel}>View Path Summaries</button>
            <br/>
            <small className = "block inset-x-0 top-0 text-center font-bold">Click a start and an end point on the map, select to minimize or maximize elevation gain, input the maximum percentage of shortest path, then click "Calculate Path" to render your path.</small>
            <small className = "block inset-x-0 top-0 text-center font-bold">Click the map again to begin calculating a new path.</small>
            
          </div>
          <div>
          
          </div>
          
        
      </div>
    )

}