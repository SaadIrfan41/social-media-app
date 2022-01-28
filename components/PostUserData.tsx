import Link from 'next/link'
import React from 'react'
import Moment from 'react-moment'
type Props = {
  username: string
  userImage: string
  createdAt: number
  userId: string | string[] | undefined
}

const PostUserData = ({ username, userImage, createdAt, userId }: Props) => {
  return (
    <div className=' flex items-center w-full'>
      <div className='flex-shrink-0'>
        <Link href={`/profile/${userId}`}>
          <a className=' cursor-pointer'>
            <span className='sr-only'>{username}</span>
            <img className='h-10 w-10 rounded-full' src={userImage} alt='' />
          </a>
        </Link>
      </div>
      <div className='ml-3'>
        <p className='text-sm font-medium text-gray-900'>
          <Link href={`/profile/${userId}`}>
            <a className='hover:underline cursor-pointer'>{username}</a>
          </Link>
        </p>
        <div className='flex space-x-1 text-sm text-gray-500'>
          <span>
            <Moment format='DD MMM yyyy hh:mm A' date={createdAt / 1} />
          </span>
        </div>
      </div>
    </div>
  )
}

export default PostUserData
