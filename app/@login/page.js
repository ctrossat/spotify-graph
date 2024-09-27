"use client";
import {signIn} from "next-auth/react"

export default function Login () {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="font-geistMono">Connect to spotify</h1>
            <button onClick={() => signIn('spotify')}>Click here</button>
        </div>
    )
}