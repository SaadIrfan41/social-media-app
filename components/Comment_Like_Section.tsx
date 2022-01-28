import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { ChatAltIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import Moment from 'react-moment'
import { toast } from 'react-toastify'
import { Icon, Image, Modal, Popup } from 'semantic-ui-react'
import LikeSVG from '../utils/like'
import LikePostButton from './LikePostButton'
import { SINGLE_POST_COMMENTS } from './Posts'
import { Field, Form, Formik } from 'formik'
import * as yup from 'yup'

const DELETE_COMMENT = gql`
  mutation ($postId: ID!, $commentId: String!) {
    deleteComment(postId: $postId, commentId: $commentId)
  }
`
const CREATE_COMMENT = gql`
  mutation ($id: ID!, $text: String!) {
    createComment(id: $id, text: $text)
  }
`
type Props = {
  postImage: string
  postUser: string
  createdAt: number
  postText: string
  // postComments: [Comments]
  postId: string
  logedInUser: string | null | undefined
  userImage: string
  // postCommentId: any
  postCommentLength: number
  // postCommentLoading: any
  postLiked: [Likes]
}
type Comments = {
  _id: string
  text: String
  date: String
  user: User
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
const Comment_Like_Section = ({
  postImage,
  postUser,
  createdAt,
  postText,
  // postComments,
  postId,
  logedInUser,
  userImage,
  // postCommentId,
  postCommentLength,
  // postCommentLoading,
  postLiked,
}: Props) => {
  const [commentsModel, setcommentsModel] = useState(false)
  const [postComment, setpostComment] = useState('')

  const [
    deleteComment,
    { loading: loadingDeleteComment, error: deleteCommentError },
  ] = useMutation(DELETE_COMMENT, {
    awaitRefetchQueries: true,
  })
  const [
    singlePostComments,
    {
      loading: loadingComments,
      error: commentsError,
      data: commentsData,
      refetch,
    },
  ] = useLazyQuery(SINGLE_POST_COMMENTS)
  const [createComment, { loading: loadingComment, error: commentError }] =
    useMutation(CREATE_COMMENT, {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: SINGLE_POST_COMMENTS,
          variables: { id: commentsData?.singlePostComments?._id },
        },
      ],
    })

  const handelDeleteComment = async (postId: string, commentId: string) => {
    try {
      // deletePost(id)
      const { data } = await deleteComment({
        variables: { postId: postId, commentId: commentId },
      })
      const res = await singlePostComments({ variables: { id: postId } })
      // console.log(data.deletePost)
      console.log('REFETCH', res)
      toast.success(data.deleteComment)
    } catch (error) {
      console.log(error)
      //@ts-ignore
      toast.error(error?.message)
    }
  }
  console.log('MODEL COMMENTS', commentsData?.singlePostComments?.comments)
  const handelCommentClick = async (id: string) => {
    try {
      setpostComment(id)
      await singlePostComments({ variables: { id: id } })
    } catch (error) {
      //@ts-ignore
      toast.error(err?.message)
    }
  }

  const validationSchema = yup.object().shape({
    comment: yup.string().required('This Field is required'),
  })
  console.log('POST LIKED COMMEN', postLiked)
  return (
    <>
      <div className='flex justify-evenly p-1 '>
        <div className='flex justify-start w-full pl-10'>
          <Popup
            className='opacity-95'
            on='click'
            content={postLiked?.map((like: any) => {
              return (
                <div
                  key={like?._id}
                  className='flex-shrink-0 flex items-center hover:cursor-pointer hover:underline hover:bg-gray-200 rounded-lg pl-2 pr-2 '
                >
                  <img
                    className='h-10 w-10 rounded-full'
                    src={like?.user?.profilePicUrl}
                    alt=''
                  />
                  <span className='pl-3'>{like?.user?.username}</span>
                </div>
              )
            })}
            trigger={<LikeSVG className='h-6 w-6  hover:cursor-pointer' />}
          />
          <span className='pl-2'> {postLiked.length}</span>
        </div>
        <div className='flex  w-full justify-end text-gray-700 '>
          <button
            onClick={() => handelCommentClick(postId)}
            className='pr-10  hover:underline hover:cursor-pointer'
          >
            {postCommentLength} {postCommentLength > 1 ? 'Comments' : 'Comment'}
          </button>
        </div>
      </div>
      <div className='flex justify-evenly'>
        <LikePostButton
          postId={postId}
          postLiked={postLiked}
          logedInUser={logedInUser}
        />

        <button
          onClick={() => handelCommentClick(postId)}
          className='flex font-bold items-center rounded-lg hover:cursor-pointer text-indigo-500 hover:bg-indigo-100 p-1'
        >
          <ChatAltIcon className='flex-shrink-0 h-10 w-10  ' />
          Comment
        </button>
      </div>
      <hr className='mt-1 mb-1 max-w-xl mx-auto' />
      {postId === postComment && commentsData && postCommentLength > 3 && (
        <Modal
          closeIcon
          dimmer='blurring'
          open={commentsModel}
          onClose={() => setcommentsModel(false)}
          onOpen={() => setcommentsModel(true)}
          trigger={
            <button className='w-full text-right pr-12 font-bold hover:underline text-gray-600'>
              View More Comments
            </button>
          }
        >
          <Modal.Content image scrolling>
            {postImage && (
              <Image size='large' src={postImage} fluid alt='LOADING IMAGE' />
            )}
            <Modal.Description className={`${postImage ? '!w-screen' : ''}`}>
              <div className='flex-1 bg-white p-6 flex flex-col justify-between'>
                <div className=' flex items-center'>
                  <div className='flex-shrink-0'>
                    <a>
                      <span className='sr-only'>{postUser}</span>
                      <img
                        className='h-10 w-10 rounded-full'
                        src={userImage}
                        alt=''
                      />
                    </a>
                  </div>
                  <div className='ml-3'>
                    <p className='text-sm font-medium text-gray-900'>
                      <a className='hover:underline'>{postUser}</a>
                    </p>
                    <div className='flex space-x-1 text-sm text-gray-500'>
                      <span>
                        <Moment
                          format='DD MMM yyyy hh:mm A'
                          date={createdAt / 1}
                        />
                      </span>
                    </div>
                  </div>
                </div>
                <div className='flex-1 mt-3'>
                  <p className='subpixel-antialiased text-gray-700'>
                    {postText}
                  </p>
                </div>
              </div>
              <div className='max-h-80 overflow-auto'>
                {commentsData?.singlePostComments?.comments?.map(
                  (comment: any, index: number) => (
                    <div key={comment._id} className='ui comments  pl-5 pr-5 '>
                      <div className='comment'>
                        <a className='avatar'>
                          <img src={comment.user.profilePicUrl} alt='AVATAR' />
                        </a>
                        <div className='content'>
                          <div className='flex items-center '>
                            <div className='author w-full '>
                              {comment.user.username}
                              <div className='metadata'>
                                <div>
                                  <Moment
                                    format='DD MMM yyyy hh:mm A'
                                    date={comment.date / 1}
                                  />
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handelDeleteComment(postId, comment?._id)
                              }
                              disabled={loadingDeleteComment}
                              className={`  flex justify-end  ${
                                comment.user._id !== logedInUser ? 'hidden' : ''
                              }  `}
                            >
                              <Icon
                                name='erase'
                                className='text-red-600 hover:bg-red-100 !flex !justify-center !items-center rounded-full !h-8 !w-8 hover:cursor-pointer '
                              />
                            </button>
                          </div>

                          <div className='text'>{comment.text}</div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      )}
      {loadingComments
        ? postId === postComment && (
            <div className=' w-full max-w-2xl mx-auto mt-4 flex justify-center'>
              <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500'></div>
            </div>
          )
        : postId === postComment &&
          commentsData?.singlePostComments?.comments.map(
            (comment: any, index: number) =>
              index < 3 && (
                <div key={comment._id} className='ui comments  pl-5 pr-5'>
                  <div className='flex items-center '>
                    <div className='comment w-full'>
                      <a className='avatar'>
                        <img src={comment.user.profilePicUrl} alt='AVATAR' />
                      </a>
                      <div className='content'>
                        <div className='flex items-center '>
                          <div className='author w-full'>
                            {comment.user.username}
                            <div className='metadata'>
                              <div>
                                <Moment
                                  format='DD MMM yyyy hh:mm A'
                                  date={comment.date / 1}
                                />
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handelDeleteComment(postId, comment._id)
                            }
                            disabled={loadingDeleteComment}
                            className={` w-full flex justify-end  ${
                              comment.user._id !== logedInUser ? 'hidden' : ''
                            }  `}
                          >
                            <Icon
                              name='erase'
                              className='text-red-600 hover:bg-red-100 !flex !justify-center !items-center rounded-full !h-8 !w-8 hover:cursor-pointer '
                            />
                          </button>
                        </div>

                        <div className='text'>{comment.text}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
          )}
      {postId === commentsData?.singlePostComments?._id && (
        <div className='pb-5 pr-5 pl-5 flex max-w-2xl mx-auto'>
          <div className='flex-shrink-0'>
            <img
              src={userImage}
              alt='Harsh mangalam`s profile image'
              className='w-10 h-10 rounded-full'
            />
          </div>
          <Formik
            initialValues={{
              comment: '',
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
              console.log(values)

              // createComment
              // console.log();

              try {
                const { data } = await createComment({
                  variables: { id: postId, text: values.comment },
                })
                console.log(data)
                toast.success(data?.createComment)

                resetForm({})
              } catch (error) {
                console.log(error)
                //@ts-ignore
                toast.error(error?.message)
              }
            }}
          >
            {({
              handleChange,

              handleBlur,

              handleSubmit,

              isSubmitting,
              isValid,
            }) => (
              <div className='w-screen max-w-4xl mx-auto '>
                <Form onSubmit={handleSubmit}>
                  <div>
                    <div className='mt-1 relative'>
                      <Field
                        component='textarea'
                        // type='text'
                        placeholder='Add your comment...'
                        className='border-gray-400 border-b outline-none pl-4 w-11/12    resize-none '
                        onChange={handleChange}
                        // value={text}
                        // onChange={(e) => settext(e.target.value)}
                        onBlur={handleBlur}
                        id='comment'
                        name='comment'
                      />
                      <div className=' flex justify-center text-center absolute  inset-y-0 right-0 bg-indigo-100 w-8 h-8 rounded-full'>
                        <button
                          type='submit'
                          disabled={isSubmitting || !isValid}
                          className='text-indigo-500 disabled:text-gray-500  '
                        >
                          <i className='send icon'></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            )}
          </Formik>
        </div>
      )}
    </>
  )
}

export default Comment_Like_Section
