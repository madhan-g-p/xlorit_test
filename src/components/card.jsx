import React from 'react'

const NewsCard = ({card}) => {

    return (
  
    <div className='max-w-[18.75rem] max-h-[25rem] bg-white col-span-1 border-[2px] border-gray-300 rounded-md mx-1'>
        <img src={card.url} alt="news" loading='lazy'
        className='max-w-full max-h-[20rem]  rounded-md' />
        <div className='grid grid-cols-2 m-2 gap-1'>
            <div className='col-span-1 font-semibold relative text-ellipsis truncate group cursor-pointer'>
                {card.title}
                <div className=' fixed hidden group-hover:block bg-gray-900 text-white rounded-lg text-wrap p-2'>
                    {card.title}
                </div>
            </div>
            <div className='col-span-1 text-right'>
                    Date
            </div>
            <div className='col-span-2 text-left'>
                    Subsection Name
            </div>
        </div>
    </div>
  )
}

export default NewsCard