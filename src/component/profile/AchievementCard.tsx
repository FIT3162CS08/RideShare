import React from 'react'

const AchievementCard = ({img_url, title, description}) => {
  return (
    <div className='px-4 py-10 rounded-xl flex flex-col flex-shrink-0 w-2/6 items-center justify-between gap-10 bg-blue-600/15'>
        <img src={img_url} className='w-9/12 aspect-square' />
        <div className='flex flex-col gap-3 items-center text-center'>
            <h1 className='text-xl font-thin'>{title}</h1>
            <h1 className='text-md font-thin text-wrap'>{description}. {description}</h1>
        </div>
    </div>
  )
}

export default AchievementCard
