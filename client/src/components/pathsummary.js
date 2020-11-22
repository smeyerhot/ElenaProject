import {useState, useEffect} from 'react'
export default function PathSummary (props) {

    const [path1, setPath1] = useState([]);
    const [path2, setPath2] = useState([]);
    const [nodeCount1, setNodeCount1] = useState(0);
    const [nodeCount2, setNodeCount2] = useState(0);

    useEffect(() => {
        console.log(props.paths);
        setPath1(props.paths.path1);
        setPath2(props.paths.path2);
    }, [props]);

    useEffect(() => {
        setNodeCount1(path1.length);
        setNodeCount2(path2.length);
    }, [path1,path2])
    return(
        <div className = 'summary-containter'>
            <br></br>
            <h2 className = 'summary-sub-title1'>Red Path:</h2>
            <p className = 'summary-text'>Red Path Node Count: {nodeCount1}</p>
            
            <br></br>

            <h2 className = 'summary-sub-title2'>Purple Path:</h2>
            <p className = 'summary-text'>Purple Path Node Count: {nodeCount2}</p>

        </div>
    );
}