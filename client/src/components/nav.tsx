import React from 'react'
import Link from 'next/link'
export default function Nav() {
 
  return (
    <header>
        <div className="flex bg-orange-500 flex-row items-center top-0 h-20 w-screen p-3">
      <Link href="/">
        <a>
          <h1 className="text-black text-3xl font-bold">Elena</h1>
        </a>
      </Link>
      <div className="flex-grow" />
      

      </div>
    </header>
  )
}

