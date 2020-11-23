import {useState, useEffect} from 'react'
export default function PathSummary (props) {

    const [path1, setPath1] = useState([]);
    const [path2, setPath2] = useState([]);
    const [nodeCount1, setNodeCount1] = useState(0);
    const [nodeCount2, setNodeCount2] = useState(0);
    const [path1Length, setPath1Length] = useState(0);
    const [path2Length, setPath2Length] = useState(0);
    const [path1NetElev, setPath1NetElev] = useState(0);
    const [path2NetElev, setPath2NetElev] = useState(0);
    const [path1Shortest, setPath1Shortest] = useState(0);
    const [path2Shortest, setPath2Shortest] = useState(0);
    useEffect(() => {
        setPath1(props.paths.path1);
        setPath2(props.paths.path2);
    }, [props]);

    useEffect(() => {
        setNodeCount1(path1.length);
        setPath1Length(props.paths.path1Length);
        setPath1NetElev(props.paths.path1NetElev);
        setNodeCount2(path2.length);
        setPath2Length(props.paths.path2Length);
        setPath2NetElev(props.paths.path2NetElev);
        setPath1Shortest(props.paths.path1Shortest);
        setPath2Shortest(props.paths.path2Shortest);
    }, [path1,path2])
    return(
        <div className = 'summary-containter'>
            <br></br>
            <h2 className = 'summary-sub-title1'>Red Path:</h2>
            <p className = 'summary-text'><small >This path was generated using an A* algorithm using a heuristic of elevation difference.</small></p>
            <p className = 'summary-text'>Node Count: {nodeCount1}</p>
            <p className = 'summary-text'>Length (mi): {path1Length}</p>
            <p className = 'summary-text'>Elevation Change (m): {path1NetElev}</p>
            <p className = 'summary-text'>% distance of shortest path: {parseFloat(((path1Length/path1Shortest) *100).toFixed(3))}</p>
            <br></br>

            <h2 className = 'summary-sub-title2'>Purple Path:</h2>
            <p className = 'summary-text'><small >This path was generated using a hybrid algorithm using a heuristic combining path length and elevation difference.</small></p>
            <p className = 'summary-text'>Node Count: {nodeCount2}</p>
            <p className = 'summary-text'>Length (mi): {path2Length}</p>
            <p className = 'summary-text'>Elevation Change (m): {path2NetElev}</p>
            <p className = 'summary-text'>% distance of shortest path: {parseFloat(((path2Length/path2Shortest) *100).toFixed(3))}</p>
        </div>
    );
}