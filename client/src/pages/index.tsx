
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
const DynamicMap = dynamic(() => import('../components/map'), {ssr: false});
const MapInput = dynamic(()=> import('../components/mapInput'), {ssr: false})


export default function Home(){
  const [state, setState] = useState({'start': '', 'end': '', 'minMax':'', 'percent': '', 'done': false})
  const [viewSummary, setViewSummary] = useState(false);
  
  return (
    <div>
      
      <MapInput state = {state} onStateChange = {setState} viewSummary = {viewSummary} setViewSummary = {setViewSummary} className="flex bg-orange-500 flex-row items-center top-0 h-20 w-screen p-3"></MapInput>
      <DynamicMap state = {state} onStateChange = {setState} viewSummary = {viewSummary} setViewSummary = {setViewSummary}/>
    </div>
    
      )
}
