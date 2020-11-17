import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import axios from 'axios'
const DynamicMap = dynamic(() => import('../components/map'), {ssr: false});
const MapInput = dynamic(()=> import('../components/mapInput'), {ssr: false})


export default function Home(){
  const[state, setState] = useState({'start': '', 'end': '', 'minMax':'', 'percent': '', 'done': false})
  const[path, setPath] = useState([]);


  return (
    <div>
      <MapInput state = {state} onStateChange = {setState}></MapInput>
      <DynamicMap state = {state} onStateChange = {setState}/>
    </div>
    
      )
}
