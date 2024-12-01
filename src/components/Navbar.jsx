import React from 'react'
import { SearhcIcon } from './sidebarIcons'

const Navbar = ({search,setSearch}) => {
  return (
        <div className='grid grid-cols-2 w-full bg-gray-200 m-2 rounded-lg px-[20%] py-3 '>
            <div className='col-span-1 font-bold m-2'>
                NY TIMES
            </div>
            <div className='col-span-1 place-self-end'>

            <input type="search" 
                placeholder='search title'
                value={search}
                onChange={(e)=>{
                    setSearch(e.target.value || "")
                }}
                className='border-[2px] w-fit rounded-lg right-0 outline-none border-gray-300 px-4 py-2 relative mx-auto inline'/>
            <SearhcIcon className={`w-[20px] h-[16px] inline-block relative z-20 right-8 ${search && " hidden right-0"}`}/>
            </div>
        </div>
  )
}

export default Navbar