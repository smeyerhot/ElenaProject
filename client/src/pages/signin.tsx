import React, { useState, useEffect, useRef } from 'react'

import Head from 'next/head'
import PasswordInput from '../components/passwordInput'

import { useRouter } from 'next/router'
import { signin, signout } from '../auth/api-auth'

import { UserData } from '@/types';

const Signin: React.FunctionComponent = () => {
  const router = useRouter()
    
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')


  const tryLogin = () => {
    const credentials = {
      username,
      password,
    }
    signin(credentials)
      .then(async (res) => {
        const body = await res.text()
        try {
          const data: UserData = JSON.parse(body)
          auth.authenticate(data, () => {
            console.log("finished")
          })
          router.push('/')
        } catch {
          setErrorMessage(body)
        }
      })
  }
  

  return (
    <div className="main flex flex-col items-center w-4/5 md:w-2/5 mx-auto">
      <Head>
        <title>Login - Elena</title>
      </Head>
      <div className="flex-grow-2"/>
      <h1 className="text-4xl font-bold leading-none">Elena</h1>
      <h3 className="text-sm mb-3">The UMass Elevation Tracker</h3>
      <div className="w-full">
        <label className="w-full pl-1" htmlFor="email-username-input">
          Username
        </label>
        <input
          className="input w-full mb-3"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          id="email-username-input"
        />
      </div>
      <label className="w-full pl-1" htmlFor="password-input">
        Password
      </label>
      <PasswordInput
        containerProps={{ className: 'mb-3' }}
        inputProps={{
          value: password,
          onChange: (e) => setPassword(e.target.value),
          onKeyPress: (e) => e.key === 'Enter' ? tryLogin : null,
          id: 'password-input',
        }}
      />
      <div className="flex flex-row items-center w-full">
        <button className="btn btn-orange self-start mr-4" onClick={tryLogin}>
          Login
        </button>
        <span className="text-red-500 capitalize">
          { errorMessage ? `Error: ${ errorMessage }` : '' }
        </span>
      </div>
      <div className="flex-grow-3" />
    </div>
  )
}

export default Signin


const auth = {
  isAuthenticated() {
    if (typeof window == "undefined")
      return false

    if (sessionStorage.getItem('jwt'))
      return JSON.parse(sessionStorage.getItem('jwt'))
    else
      return false
  },
  authenticate(jwt, cb) {
    if (typeof window !== "undefined")
      sessionStorage.setItem('jwt', JSON.stringify(jwt))
    cb()
  },
  clearJWT(cb) {
    if (typeof window !== "undefined")
      sessionStorage.removeItem('jwt')
    cb()
    //optional
    signout().then((data) => {
      document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    })
  }
}

