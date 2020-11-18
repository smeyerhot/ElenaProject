import React from 'react'
import {signout} from '../auth/api-auth'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Nav() {
  const router = useRouter()
  function sign() {
    signout()
    router.push('/')
  }
  return (
    <header>
        <div className="flex bg-orange-500 flex-row items-center top-0 h-20 w-screen p-3">
      <Link href="/">
        <a>
          <h1 className="text-black text-3xl font-bold">Elena</h1>
        </a>
      </Link>
      <div className="flex-grow" />
      <Link href="/signup">
        <a>
          <button className="btn btn-orange btn-outlined mr-3">Sign Up</button>
        </a>
      </Link>
        <Link href="/signin">
        <a>
          <button className="btn btn-orange btn-outlined">Sign In</button>
        </a>
        </Link>
        
        <button className="btn btn-orange btn-outlined" onClick={sign} > Sign Out </button>

        {/* <Link href="/chat">
        <a>
          <button className="btn btn-orange btn-outlined">Chat</button>
        </a>
        </Link>
         */}

      </div>
    </header>
  )
}

