import { gql, useMutation } from '@apollo/client'
import { ThumbUpIcon } from '@heroicons/react/outline'
import React from 'react'
import { toast } from 'react-toastify'
import { ALL_POSTS } from './Posts'
const LIKE_DISLIKE_POST = gql`
  mutation ($PostId: ID!) {
    like_dislike_Post(id: $PostId)
  }
`
type Props = {
  postId: string
  postLiked: [Likes]
  logedInUser: string | null | undefined
}
type Likes = {
  _id: string
  user: User
}

type User = {
  _id: string
  username: String
  email: String
  profilePicUrl: String
  name: String
  role: String
  password: String
  createdAt: String
  updatedAt: String
}

const LikePostButton = ({ postId, postLiked, logedInUser }: Props) => {
  const [like_dislike_Post, { loading: likesLoading, error: likeserror }] =
    useMutation(LIKE_DISLIKE_POST, {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: ALL_POSTS,
        },
      ],
    })

  const handellike_dislike = async (PostId: any) => {
    try {
      const { data } = await like_dislike_Post({
        variables: { PostId },
      })
      console.log(data)

      toast.success(data.like_dislike_Post)
    } catch (err) {
      //@ts-ignore
      toast.error(err?.message)
    }
  }
  console.log('POST LIKED', postLiked)
  return (
    <button
      disabled={likesLoading}
      onClick={() => handellike_dislike(postId)}
      className='flex items-center     hover:cursor-pointer '
    >
      {postLiked?.find((like: any) => like.user._id === logedInUser) ? (
        <div className='flex items-center  hover:bg-blue-100 rounded-lg p-1'>
          <ThumbUpIcon
            className='flex-shrink-0 h-10 w-10 text-blue-200  '
            fill={'#3b8cf6'}
          />
          <span className='text-blue-500 font-bold'>UnLike</span>
        </div>
      ) : (
        <div className='text-gray-500 flex items-center font-bold hover:bg-gray-100 rounded-lg p-1'>
          <ThumbUpIcon
            className='flex-shrink-0 h-10 w-10   '
            fill={'#ffffff'}
          />
          <span className='text-blue-500 font-bold'>Like</span>
        </div>
      )}
    </button>
  )
}

export default LikePostButton
