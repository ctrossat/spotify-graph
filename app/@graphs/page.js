"use client";
import useSWR from 'swr'
import {signOut, useSession} from "next-auth/react"
import {Table, TableBody, TableCaption, TableCell, TableHead,TableHeaderCell,TableRoot,TableRow } from "@/components/tremor/Table"
import { Button } from '@/components/tremor/Button';

export default function Graph () {

    const {data: session} = useSession();

    console.log(session);
    

    //fetch wrapper for SWR use
    const fetcher = (...args) => fetch(...args).then(res => res.json())

    const { data, error, isLoading } = useSWR('/api/user/top/tracks?time_range=medium_term&limit=50', fetcher)

    return (
        <div className='flex flex-col items-center px-10'>
            <span className='flex items-center justify-between w-full mb-4'>
                <h2 className='font-geistSans font-medium'>Connected as {isLoading ? '....' : session.user.name}</h2>
                <Button 
                    variant='ghost' 
                    onClick={() => signOut()}
                    className='my-2 w-fit'
                    >Log out</Button>
            </span>

            <TableRoot className='w-fit'>
                <Table>
                    <TableCaption>Your top 50 songs</TableCaption>
                    <TableHead>
                    <TableRow>
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell>Artists</TableHeaderCell>
                        <TableHeaderCell>Number</TableHeaderCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {!isLoading && data.items.map(({id, name, artists}, index) => (
                        <TableRow key={id}>
                            <TableCell>{name}</TableCell>
                            <TableCell>{artists.map(({name}) => name).join(' / ')}</TableCell>
                            <TableCell>{index+1}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableRoot>
        </div>
    )
}