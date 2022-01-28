import { gql, useQuery } from '@apollo/client'
import React from 'react'
import Comment_Like_Section from './Comment_Like_Section'
import DeletePostButton from './DeletePostButton'
import PostUserData from './PostUserData'
const SINGLE_USER_POSTS = gql`
  query ($id: ID!) {
    userPost(id: $id) {
      _id
      text
      createdAt
      picUrl
      user {
        username
        name
        profilePicUrl
      }
      comments {
        _id
        text
        user {
          name
        }
      }
      likes {
        _id
        user {
          _id
          username
          profilePicUrl
        }
      }
    }
  }
`
type Props = {
  logedInUser: string
  userProfileId: string | string[] | undefined
}
const UserProfile = ({ logedInUser, userProfileId }: Props) => {
  const {
    data: posts,
    loading: postLoading,
    error: posterror,
  } = useQuery(SINGLE_USER_POSTS, {
    variables: { id: userProfileId },
  })
  if (postLoading)
    return (
      <div className=' w-full max-w-2xl mx-auto mt-4 flex justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500'></div>
      </div>
    )
  if (posterror) return <h1>Error</h1>
  console.log('ALL POSTS', posts)
  return (
    <div className='mt-5 mb-5 max-w-2xl mx-auto'>
      {/* {console.log(userPost)} */}
      {posts?.userPost?.map((post: any) => (
        <div
          key={post?._id}
          className='flex flex-col rounded-lg shadow-md  mt-5'
        >
          <div className='flex-1 bg-white p-6 flex flex-col justify-between'>
            <div className='flex items-center w-full'>
              <PostUserData
                username={post?.user?.username}
                userImage={post?.user?.profilePicUrl}
                createdAt={post?.createdAt}
                userId={userProfileId}
              />
              <DeletePostButton
                postId={post?._id}
                postUserId={post?.user?._id}
                logedInUser={logedInUser}
              />
            </div>
            <div className='flex-1 mt-3'>
              <p className='subpixel-antialiased text-gray-700'>{post?.text}</p>
            </div>
          </div>
          <div className='flex-shrink-0'>
            <img
              className='h-full w-11/12 object-cover mx-auto'
              src={post?.picUrl}
              alt=''
            />
          </div>
          <div className='mb-1'>
            <hr className='mt-1 mb-1 max-w-xl mx-auto' />

            <>
              <Comment_Like_Section
                postImage={post?.picUrl}
                postUser={post?.user?.username}
                createdAt={post?.createdAt}
                postText={post?.text}
                postId={post?._id}
                logedInUser={logedInUser}
                userImage={post.user.profilePicUrl}
                postCommentLength={post?.comments?.length}
                postLiked={post?.likes}
              />
            </>
          </div>
        </div>
      ))}
    </div>
  )
}

export default UserProfile
