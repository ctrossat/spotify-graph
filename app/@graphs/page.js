"use client";
import useSWR from 'swr'
import { signOut, useSession } from "next-auth/react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeaderCell, TableRoot, TableRow } from "@/components/tremor/Table"
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/tremor/Select"  
import { Button } from '@/components/tremor/Button';
import { DonutChart } from '@/components/tremor/DonutChart';
import { useState } from 'react';

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
                            {!isLoading && data.items.map(({ id, name, artists }, index) => {
                                //if selectedArtist = null then render all
                                //if selectedArtist has a value render if ANY of the artist matches
                                if (!selectedArtist || artists.some(({name}) => name == selectedArtist)) {
                                    return (
                                        <TableRow key={id}>
                                            <TableCell>{name}</TableCell>
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