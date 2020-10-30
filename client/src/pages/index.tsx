import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import axios from 'axios'

const DynamicMap = dynamic(() => import('../components/map'), {ssr: false});

let incIdx = (idx, length, setIdx) => {
  let counter = (idx + 1) % length
  setIdx(counter);
}
export default function Home(){
  const [customers, setCustomers] = useState({})
  let [idx, setIdx] = useState(0)
  const api = 'http://localhost:5000/api/users';

  useEffect(() => {

    const loadChar = async () => {
      const result = await axios(api);
      setCustomers(result.data);

      incIdx(idx, result.data.length, setIdx);
    };

    loadChar();
    
  }, [api]);

  const mapped = []
  for (let key in customers) {
    // if (!customers.hasOwnProperty(key)) {
    //   continue;
    // }
    let val = customers[key];

    mapped.push(val);
  }

  const listItems = mapped.map((d,idx) => <li key={idx}>{[d.username]}</li>);

  return (
    <DynamicMap />
      )
}

function NameList(props) {
  return props.mapped.map((d,idx) => {
    let props = {
      idx:idx,
      d:d 
    }
    return <ListItem {...props}/>
  });
}
  

function ListItem(props) {
  // console.log(`props${props}`)
  const d = props.d;
  const idx = props.idx;
  // console.log(idx)
  return (
  <li key={idx}>{[d.customerName +
    "\n" + "---", d.phone, 
    "\n" + d.addressLine1,
    "\n" + d.city, 
    "\n" + d.state, 
    "\n" + d.postalCode, 
    "\n" + d.country, 
    "\n" + d.creditLimit]}
  </li> )

}

function global() {
  return "hello"
}