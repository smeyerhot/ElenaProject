import React from 'react'

export default function statisticsPanel(props){
    return(
        <div>
            <div x-data={{show:false}}>
            <p class="flex">
                <button onClick={{show:!show}}>Dijkstra</button>
            </p>
            <div x-show="show">
                <p>Short description of Dijkstra</p>
                <p>Elevation change: </p>
                <p>Distance: </p>
            </div>
            </div>
            <div x-data={{show:false}}>
            <p class="flex">
            <button onClick={{show:!show}}>Bellman-Ford</button>
            </p>
            <div x-show="show">
                <p>Short description of Bellman-Ford</p>
                <p>Elevation change: </p>
                <p>Distance: </p>
            </div>
        </div>
        <div x-data={{show:false}}>
            <p class="flex">
            <button onClick={{show:!show}}>A-Star</button>
            </p>
            <div x-show="show">
                <p>Short description of A-Star</p>
                <p>Elevation change: </p>
                <p>Distance: </p>
            </div>
        </div>
        </div>
        
        
    )
}