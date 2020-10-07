import { send } from "process";
import React, { useState, useEffect } from 'react'
import MyMap from '../components/map.js'


const Form: React.FunctionComponent = () => {
  const [formData, setFormData] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [payload, setpayload] = useState(0);

    const trySend = (e) => {
      const coords = {
        latitude,
        longitude,
      }
      sendCoords(coords)
        .then(async (res) => {
          const body = await res.text()
  
          try {
            const data = JSON.parse(body)
            console.log(data)
            // router.push(`/profile/${ data.uuid }`)
          } catch {
            console.log("didn't work")
          }
        })
      e.preventDefault()
    }



  
  

  const testEvent = (e) => {
    e.persist();
    console.log(e);
  };
  const updateFormData = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  const { latitude, longitude } = formData;

  return (
    <div>
      
      {typeof window !== "undefined" ? <MyMap></MyMap> : null}
      <form>
      
        <input
          value={latitude}
          onChange={(e) => updateFormData(e)}
          placeholder="Latitude"
          type="text"
          name="latitude"
          required
        />
        <input
          value={longitude}
          onChange={(e) => updateFormData(e)}
          placeholder="Longitude"
          type="text"
          name="longitude"
          required
          />

        <button
          type="submit"
          onClick={(e) => trySend(e)}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;

type Coords = {
  latitude: Number;
  longitude: Number;
}

const sendCoords = (payload: Coords): Promise<Response> => {
  try {
    let response = fetch('http://localhost:5000/api/coords', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      
    })
    return response;
  } catch (e) {
    console.log(e)
  }
}
// const sendCoords = (payload: Coords): Promise<Response> => {
//   try {
//     let response = fetch('http://localhost:5000/api/coords', {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include',
//       body: JSON.stringify(payload),
//     })
//     console.log(response)
//     return response;
//   } catch (e) {
//     console.log(e)
//   }
// }
  