'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
import {signOut} from "next-auth/react"

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h2>An error occured</h2>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  )
}