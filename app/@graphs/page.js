"use client";
import useSWR from 'swr'
import { signOut, useSession } from "next-auth/react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeaderCell, TableRoot, TableRow } from "@/components/tremor/Table"
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/tremor/Select"  
import { Button } from '@/components/tremor/Button';
import { DonutChart } from '@/components/tremor/DonutChart';
import { useState } from 'react';
import Link from 'next/link';

export default function Graph() {

    const { data: session } = useSession();

    console.log(session);

    const [term, setTerm] = useState('short_term')
    const [selectedArtist, setSelectedArtist] = useState(null)
    console.log(selectedArtist);
    

    //fetch wrapper for SWR use
    const fetcher = (...args) => fetch(...args).then(res => res.json())

    const { data, error, isLoading } = useSWR(`/api/user/top/tracks?time_range=${term}&limit=50`, fetcher)

    //collect data and turn it into an Array usable by DonutChart component
    const donutData = (data) => {
        let parsedData = {}
        //for each song in the data
        data.items.forEach(({ artists }) => {
            //for each artists of a song
            artists.forEach(({ name }) => {
                if (parsedData[name]) {
                    parsedData[name]++
                } else {
                    parsedData[name] = 1
                }
            })
        });
        
        //reformat new obtained data in an object usable by the DonutChart object
        let returnData = []
        // Artist that only appear once in the top 50 are put in here, unused currently in the display but is calculated anyway cuz why not
        let otherArtists = 0
        Object.entries(parsedData).forEach((key) => (key[1] > 1 ? returnData.push({ name: key[0], amount: key[1] }) : otherArtists++))
        return [...returnData];
    }

    return (
        <div className='flex flex-col items-center px-10'>
            <span className=' flex sm:items-center justify-between w-full mb-4 mt-2'>
                <h2 className='font-geistSans font-medium my-4 sm:py-0'>Connected as {isLoading ? '....' : session.user.name}</h2>
                <span className='flex items-end sm:items-center flex-col-reverse sm:flex-row'>
                    <Select defaultValue="short_term" onValueChange={setTerm}>
                        <SelectTrigger className="mx-auto h-fit">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={'short_term'}>
                                Short term (4 weeks)
                            </SelectItem>
                            <SelectItem value={'medium_term'}>
                                Medium term (6 months)
                            </SelectItem>
                            <SelectItem value={'long_term'}>
                                Long term (1 year)
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant='ghost'
                        onClick={() => signOut()}
                        className='my-2 w-fit'
                    >Log out</Button>
                </span>
            </span>

            {!isLoading 
            ?
                <DonutChart
                    data={donutData(data).sort((a,b) => a != false && b.amount - a.amount)}
                    className='mb-6'
                    category="name"
                    variant = {'pie'}
                    value="amount"
                    onValueChange={(v) => v ? setSelectedArtist(v.categoryClicked) : setSelectedArtist(null)}
                    colors={['violet', 'fuchsia', 'emerald', 'blue']}
                />
            : 
                <DonutChart
                    data={[{ name: 'loading', amount: 1 }]}
                    className='mb-6'
                    category="name"
                    variant = {'pie'}
                    value="amount"
                    showTooltip = {false}
                    colors={['gray']}
                />

            }

            <p className='font-geistSans text-center mb-10'>
                <span> {!isLoading ? 'Artists in your top 50 songs' : 'Retrieving data from Spotify API'} </span>
                <br/> 
                <span className='font-geistMono text-sm tracking-tight'>{!isLoading ? 'only those with multiple songs are displayed' : 'Please wait'}</span>
            </p> 
            <div className='grid max-w-full overflow-x-scroll'>
                <TableRoot>
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
                            {!isLoading && data.items.map(({ id, name, artists, uri }, index) => {
                                //if selectedArtist = null then render all
                                //if selectedArtist has a value render if ANY of the artist matches
                                if (!selectedArtist || artists.some(({name}) => name == selectedArtist)) {
                                    return (
                                        <TableRow key={id}>
                                            <TableCell>
                                                <Link href={uri} className='flex felx-row'>
                                                    <div className='w-5 mr-2'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12.001 2C17.551 2 22.001 6.5 22.001 12C22.001 17.5 17.501 22 12.001 22C6.50098 22 2.00098 17.5 2.00098 12C2.00098 6.5 6.50098 2 12.001 2ZM12.001 4C7.60555 4 4.00098 7.60457 4.00098 12C4.00098 16.3954 7.60555 20 12.001 20C16.3964 20 20.001 16.3954 20.001 12C20.001 7.58572 16.4276 4 12.001 4ZM15.751 16.65C13.401 15.2 10.451 14.8992 6.95014 15.6992C6.60181 15.8008 6.30098 15.55 6.20098 15.25C6.10098 14.8992 6.35098 14.6 6.65098 14.5C10.451 13.6492 13.751 14 16.351 15.6C16.701 15.75 16.7501 16.1492 16.6018 16.45C16.4018 16.7492 16.0518 16.85 15.751 16.65ZM16.7501 13.95C14.051 12.3 9.95098 11.8 6.80098 12.8C6.40181 12.9 5.95098 12.7 5.85098 12.3C5.75098 11.9 5.95098 11.4492 6.35098 11.3492C10.001 10.25 14.501 10.8008 17.601 12.7C17.9018 12.8508 18.051 13.35 17.8018 13.7C17.551 14.05 17.101 14.2 16.7501 13.95ZM6.30098 9.75083C5.80098 9.9 5.30098 9.6 5.15098 9.15C5.00098 8.64917 5.30098 8.15 5.75098 7.99917C9.30098 6.94917 15.151 7.14917 18.8518 9.35C19.301 9.6 19.451 10.2 19.201 10.65C18.9518 11.0008 18.351 11.1492 17.9018 10.9C14.701 9 9.35098 8.8 6.30098 9.75083Z"></path>
                                                        </svg>
                                                    </div>
                                                    {name}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{artists.map(({ name }) => name).join(' / ')}</TableCell>
                                            <TableCell>{index + 1}</TableCell>
                                        </TableRow>
                                    )
                                }
                            })}
                        </TableBody>
                    </Table>
                </TableRoot>
            </div>
        </div>
    )
}