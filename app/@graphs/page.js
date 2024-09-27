"use client";
import useSWR from 'swr'
import {signOut, useSession} from "next-auth/react"

export default function Graph () {

    const {data: session} = useSession();

    //fetch wrapper for SWR use
    const fetcher = (...args) => fetch(...args).then(res => res.json())

    const { data, error, isLoading } = useSWR('/api/user/top/tracks', fetcher)

    return (
        <div>
            <h1 className="font-geistMono">Hi</h1>
            {!isLoading && (
                <p>{data.items[10].name}</p>
            )}
            <button onClick={() => signOut()}>Log out</button>
        </div>
    )
}