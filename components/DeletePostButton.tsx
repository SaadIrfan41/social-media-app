import { gql, useMutation } from '@apollo/client'
import React from 'react'
import { toast } from 'react-toastify'
import { Icon } from 'semantic-ui-react'
import { ALL_POSTS } from './Posts'

const DELETE_POST = gql`
  mutation ($id: ID!) {
    deletePost(id: $id)
  }
`
type Props = {
  postId: string
  postUserId: string
  logedInUser: string | null | undefined
}

const DeletePostButton = ({ postId, postUserId, logedInUser }: Props) => {
  const [deletePost, { loading: loadingDeletePost, error: deletePostError }] =
    useMutation(DELETE_POST, {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: ALL_POSTS,
        },
      ],
    })

  const handelDeletePost = async (id: string) => {
    try {
      // deletePost(id)
      const { data } = await deletePost({ variables: { id: id } })
      // console.log(data.deletePost)
      toast.success(data.deletePost)
    } catch (error) {
      console.log(error)
      //@ts-ignore
      toast.error(error?.message)
    }
  }
  return (
    <button
      onClick={() => handelDeletePost(postId)}
      disabled={loadingDeletePost}
      className={` w-full flex justify-end ${
        postUserId !== logedInUser ? 'hidden' : ''
      }  `}
    >
      <Icon
        name='trash'
        className='text-red-600 hover:bg-red-100 !flex !justify-center !items-center rounded-full !h-8 !w-8 hover:cursor-pointer '
      />
    </button>
  )
}

export default DeletePostButton
