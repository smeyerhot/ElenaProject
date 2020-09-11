type Credentials = {
    username: string;
    password: string;
  }
  
  // Removed async so that we can do error handling in component
const API_URL = 'http://localhost:5000/'
// why are we using single ampersand here?
const signup = (credentials: Credentials & { email: string }): Promise<Response> => {

  try {
    let response = fetch('http://localhost:5000/api/users/signup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    })
    return response;
  } catch (e) {
    console.log(e)
  }
}
  
const signin = (credentials: Credentials): Promise<Response> => {
  try {
    let response = fetch('http://localhost:5000/auth/signin', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    })
    return response;
  } catch (e) {
    console.log(e)
  }
}
  
  
  const signout = (): Promise<Response> => {
    return fetch(API_URL + 'auth/signout', {
      method: 'DELETE',
      credentials: 'include',
    })
  }
  
export { signup, signin, signout }
  
// const create = async (user) => {
//   try {
//       let response = await fetch('http://localhost:5000/api/users/signup', {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(user)
//       })
//     return await response.json()
//   } catch(err) {
//     console.log(err)
//   }
// }

// const list = async (signal) => {
//   try {
//     let response = await fetch('/api/users/', {
//       method: 'GET',
//       signal: signal,
//     })
//     return await response.json()
//   } catch(err) {
//     console.log(err)
//   }
// }

// const read = async (params, credentials, signal) => {
//   try {
//     let response = await fetch('/api/users/' + params.userId, {
//       method: 'GET',
//       signal: signal,
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + credentials.t
//       }
//     })
//     return await response.json()
//   } catch(err) {
//     console.log(err)
//   }
// }

// const update = async (params, credentials, user) => {
//   try {
//     let response = await fetch('/api/users/' + params.userId, {
//       method: 'PUT',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + credentials.t
//       },
//       body: JSON.stringify(user)
//     })
//     return await response.json()
//   } catch(err) {
//     console.log(err)
//   }
// }

// const remove = async (params, credentials) => {
//   try {
//     let response = await fetch('/api/users/' + params.userId, {
//       method: 'DELETE',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + credentials.t
//       }
//     })
//     return await response.json()
//   } catch(err) {
//     console.log(err)
//   }
// }

// export {
//   create,
//   list,
//   read,
//   update,
//   remove
// }
  