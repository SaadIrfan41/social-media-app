/* eslint-disable @next/next/no-img-element */
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Field, Form, Formik } from 'formik'
import * as yup from 'yup'
import TextareaAutosize from 'react-textarea-autosize'
import {
  PhotographIcon,
  VideoCameraIcon,
  EmojiHappyIcon,
  ThumbUpIcon,
  ChatAltIcon,
} from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import Moment from 'react-moment'
import { toast } from 'react-toastify'
import { Button, Icon, Modal, Image, Popup, Loader } from 'semantic-ui-react'
// import Image from 'next/image'
import LikeSVG from '../utils/like'
const ALL_POSTS = gql`
  query {
    allPosts {
      _id
      picUrl
      createdAt
      comments {
        _id
      }
      likes {
        _id
        user {
          _id
          username
          profilePicUrl
        }
      }
      text
      user {
        username
        profilePicUrl
        email
        _id
      }
    }
  }
`
const LIKE_DISLIKE_POST = gql`
  mutation ($PostId: ID!) {
    like_dislike_Post(id: $PostId)
  }
`
const CREATE_COMMENT = gql`
  mutation ($id: ID!, $text: String!) {
    createComment(id: $id, text: $text)
  }
`
const CREATE_POST = gql`
  mutation ($text: String!, $picUrl: String) {
    createPost(text: $text, picUrl: $picUrl)
  }
`
const DELETE_POST = gql`
  mutation ($id: ID!) {
    deletePost(id: $id)
  }
`

const SINGLE_POST_COMMENTS = gql`
  query ($id: ID!) {
    singlePostComments(id: $id) {
      _id
      comments {
        _id
        date
        text
        user {
          username
          profilePicUrl
        }
      }
    }
  }
`
type pageProps = {
  logedInUser: string | undefined | null
  image: string
  username: string
}

const Posts = ({ logedInUser, image, username }: pageProps) => {
  console.log('User', logedInUser)
  const [postModel, setpostModel] = useState(false)
  const [commentsModel, setcommentsModel] = useState(false)
  const [postComment, setpostComment] = useState('')
  const [file, setfile] = useState(null)

  const [
    singlePostComments,
    { loading: loadingComments, error: commentsError, data: commentsData },
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
  const [createPost, { loading: loadingPost, error: postError }] = useMutation(
    CREATE_POST,
    {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: ALL_POSTS,
        },
      ],
    }
  )
  const [deletePost, { loading: loadingDeletePost, error: deletePostError }] =
    useMutation(DELETE_POST, {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: ALL_POSTS,
        },
      ],
    })

  const [like_dislike_Post, { loading: likesLoading, error: likeserror }] =
    useMutation(LIKE_DISLIKE_POST, {
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: ALL_POSTS,
          // variables: { getDiaryId: data?.getEntry?.diaryid?.id },
        },
      ],
    })

  const { data, loading, error } = useQuery(ALL_POSTS)
  if (loading)
    return (
      <div className=' w-full max-w-2xl mx-auto mt-4 flex justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500'></div>
      </div>
    )
  if (error) return <h1>Error</h1>
  console.log(data)
  console.log('Comments', commentsData)

  const handellike_dislike = async (PostId: any) => {
    try {
      const { data } = await like_dislike_Post({
        variables: { PostId },
      })
      console.log(data)

      toast.success(data.like_dislike_Post)
      //  router.push(`/diary/${rtkdata?.getEntry?.diaryid?.id}`)
    } catch (err) {
      // console.log(err)
      //@ts-ignore
      toast.error(err?.message)
    }
  }
  const validationSchema = yup.object().shape({
    comment: yup.string().required('Email is required'),
  })
  const validationPostSchema = yup.object().shape({
    text: yup.string().required('Text Field is Empty'),
  })
  const handelCommentClick = async (id: string) => {
    try {
      setpostComment(id)
      await singlePostComments({ variables: { id: id } })
    } catch (error) {
      //@ts-ignore
      toast.error(err?.message)
    }
  }
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

  const fileHandler = (event: any) => {
    const reader = new FileReader()
    reader.onload = (onLoadEvent) => {
      //@ts-ignore
      setfile(onLoadEvent?.target?.result)
    }
    reader.readAsDataURL(event?.target?.files[0])
  }
  return (
    <div className='w-full max-w-2xl mx-auto mt-4'>
      <div className='p-4 md:p-6 shadow-md bg-white rounded-lg'>
        <div className='flex items-center space-x-4'>
          <div className='flex-shrink-0'>
            <img
              src={image}
              alt='profile image'
              className='w-10 h-10 rounded-full'
            />
          </div>
          <div
            className='w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer'
            // onClick={() => setIsOpen(true)}
          >
            <Modal
              // className='!relative !z-0'
              closeIcon
              // dimmer='blurring'
              open={postModel}
              onClose={() => setpostModel(false)}
              onOpen={() => setpostModel(true)}
              trigger={
                <h3 className='md:text-lg text-gray-500'>
                  Whats on your mind, {username} ?
                </h3>
              }
            >
              <Modal.Header>Create post</Modal.Header>
              <Modal.Content>
                {/* <Image size='large' src={post?.picUrl} fluid /> */}

                <Modal.Description className=''>
                  <div className='flex-shrink-0 flex'>
                    <img
                      className='h-10 w-10 rounded-full '
                      src={image}
                      alt=''
                    />
                    <span className='pl-3 font-semibold capitalize'>
                      {username}
                    </span>
                  </div>
                  <Formik
                    initialValues={{
                      text: '',
                    }}
                    validationSchema={validationPostSchema}
                    onSubmit={async (values, { resetForm }) => {
                      console.log(values)

                      // createComment
                      // console.log();

                      try {
                        const { data } = await createPost({
                          variables: {
                            text: values.text,
                            picUrl: file,
                          },
                        })
                        console.log(data)
                        toast.success(data?.createPost)
                        setpostModel(false)
                        setfile(null)

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
                              <TextareaAutosize
                                // component='textarea'
                                // type='text'
                                placeholder={` Whats on your mind, ${username} ?`}
                                className='border-gray-400 border-b outline-none pl-4 w-11/12    resize-none '
                                onChange={handleChange}
                                // value={text}
                                // onChange={(e) => settext(e.target.value)}
                                onBlur={handleBlur}
                                id='text'
                                name='text'
                              />
                            </div>
                            {file && (
                              <div className='mt-4'>
                                <div className=' relative max-w-fit mx-auto'>
                                  <Image
                                    src={file}
                                    alt='Uploaded Image'
                                    size='medium'
                                    rounded
                                    className=' !object-contain'
                                  />
                                  <i
                                    className='close icon absolute top-0 right-0 text-gray-200 bg-gray-500 !flex !justify-center !items-center rounded-full !h-8 !w-8 hover:cursor-pointer '
                                    onClick={() => setfile(null)}
                                  />
                                </div>
                              </div>
                            )}
                            {!file && (
                              <div className='flex w-full items-center justify-center mt-4'>
                                <label className='w-64 flex flex-col items-center px-4 py-6 tracking-wide uppercase border-2 !text-indigo-500 !border-indigo-700 border-dashed  !bg-indigo-100 rounded-lg cursor-pointer  '>
                                  <svg
                                    className='w-8 h-8'
                                    fill='currentColor'
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 20 20'
                                  >
                                    <path d='M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z' />
                                  </svg>
                                  <span className='mt-2 text-base text-center leading-normal'>
                                    Add Image for your Post
                                  </span>
                                  <input
                                    type='file'
                                    accept='image/*'
                                    className='hidden'
                                    onChange={fileHandler}
                                  />
                                </label>
                              </div>
                            )}
                            <hr className='mt-3 mb-3 w-full' />
                            <div className=' !text-center'>
                              <button
                                type='submit'
                                disabled={isSubmitting || !isValid}
                                className='text-indigo-500 disabled:text-gray-500 disabled:cursor-not-allowed border-indigo-500 border p-3 rounded-lg '
                              >
                                {/* <div className='ui loader bg-black' /> */}
                                {isSubmitting ? (
                                  <div className='ui loader' />
                                ) : (
                                  <>
                                    Create Post <Icon name='chevron right' />
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </Form>
                      </div>
                    )}
                  </Formik>
                </Modal.Description>
              </Modal.Content>
            </Modal>
          </div>
        </div>
        <hr className='mt-3 mb-3' />
        <div className='flex justify-evenly'>
          <div>
            <VideoCameraIcon className='flex-shrink-0 h-10 w-10 rounded-full text-red-500 hover:bg-red-100 p-1 ' />
          </div>
          <PhotographIcon className='flex-shrink-0 h-10 w-10 rounded-full text-green-500 hover:bg-green-100 p-1' />
          <EmojiHappyIcon className='flex-shrink-0 h-10 w-10 rounded-full text-yellow-500 hover:bg-yellow-100 p-1' />
        </div>
      </div>
      <div className='mt-5 mb-5'>
        {data?.allPosts?.map((post: any) => (
          <div
            key={post._id}
            className='flex flex-col rounded-lg shadow-xl  mt-5'
          >
            <div className='flex-1 bg-white p-6 flex flex-col justify-between'>
              <div className='flex items-center w-full'>
                <div className=' flex items-center w-full'>
                  <div className='flex-shrink-0'>
                    <a>
                      <span className='sr-only'>{post.user.username}</span>
                      <img
                        className='h-10 w-10 rounded-full'
                        src={post.user.profilePicUrl}
                        alt=''
                      />
                    </a>
                  </div>
                  <div className='ml-3'>
                    <p className='text-sm font-medium text-gray-900'>
                      <a className='hover:underline'>{post.user.username}</a>
                    </p>
                    <div className='flex space-x-1 text-sm text-gray-500'>
                      <span>
                        <Moment
                          format='DD MMM yyyy hh:mm A'
                          date={post.createdAt / 1}
                        />

                        {/* {console.log(
                        new Date(post.createdAt / 1).toLocaleDateString('en-US')
                      )} */}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handelDeletePost(post?._id)}
                  disabled={loadingDeletePost}
                  className={` w-full flex justify-end ${
                    post.user._id !== logedInUser ? 'hidden' : ''
                  }  `}
                >
                  <Icon
                    name='trash'
                    className='text-red-600 hover:bg-red-100 !flex !justify-center !items-center rounded-full !h-8 !w-8 hover:cursor-pointer '
                  />
                </button>
              </div>
              <div className='flex-1 mt-3'>
                <p className='subpixel-antialiased text-gray-700'>
                  {post.text}
                </p>
              </div>
            </div>
            <div className='flex-shrink-0'>
              <img
                className='h-full w-11/12 object-cover mx-auto'
                src={post.picUrl}
                alt=''
              />
            </div>
            <div className='mb-1'>
              <div className='flex justify-evenly p-1 '>
                <div className='flex justify-start w-full pl-10'>
                  <Popup
                    className='opacity-95'
                    on='click'
                    content={post?.likes?.map((like: any) => {
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
                    trigger={
                      <LikeSVG className='h-6 w-6  hover:cursor-pointer' />
                    }
                  />
                  <span className='pl-2'> {post.likes.length}</span>
                  {/* {post.likes.length > 1
                    ? `${post.likes.length} Likes`
                    : `${post.likes.length} Like`} */}
                </div>
                <div className='flex  w-full justify-end text-gray-700 '>
                  <button
                    onClick={() => handelCommentClick(post?._id)}
                    className='pr-10  hover:underline hover:cursor-pointer'
                  >
                    {post.comments.length}{' '}
                    {post.comments.length > 1 ? 'Comments' : 'Comment'}
                  </button>
                </div>
              </div>
              <hr className='mt-1 mb-1 max-w-xl mx-auto' />

              <div className='flex justify-evenly'>
                <button
                  disabled={likesLoading}
                  onClick={() => handellike_dislike(post?._id)}
                  className='flex items-center     hover:cursor-pointer '
                >
                  {post?.likes?.find(
                    (like: any) => like.user._id === logedInUser
                  ) ? (
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

                      {/* {post.likes.length > 1
                        ? `${post.likes.length} Likes`
                        : `${post.likes.length} Like`} */}
                    </div>
                  )}
                </button>
                <button
                  // id={post?._id}
                  // disabled={commentsData}
                  onClick={() => handelCommentClick(post?._id)}
                  className='flex font-bold items-center rounded-lg hover:cursor-pointer text-indigo-500 hover:bg-indigo-100 p-1'
                >
                  <ChatAltIcon className='flex-shrink-0 h-10 w-10  ' />
                  Comment
                </button>
              </div>
              <hr className='mt-1 mb-1 max-w-xl mx-auto' />
              {post?._id === postComment &&
              commentsData &&
              post?.comments?.length > 3 ? (
                <>
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
                    {/* <Modal.Header>Profile Picture</Modal.Header> */}
                    <Modal.Content image scrolling>
                      <Image size='large' src={post?.picUrl} fluid />

                      <Modal.Description className='!w-screen'>
                        <div className='flex-1 bg-white p-6 flex flex-col justify-between'>
                          <div className=' flex items-center'>
                            <div className='flex-shrink-0'>
                              <a>
                                <span className='sr-only'>
                                  {post.user.username}
                                </span>
                                <img
                                  className='h-10 w-10 rounded-full'
                                  src={post.user.profilePicUrl}
                                  alt=''
                                />
                              </a>
                            </div>
                            <div className='ml-3'>
                              <p className='text-sm font-medium text-gray-900'>
                                <a className='hover:underline'>
                                  {post.user.username}
                                </a>
                              </p>
                              <div className='flex space-x-1 text-sm text-gray-500'>
                                <span>
                                  <Moment
                                    format='DD MMM yyyy hh:mm A'
                                    date={post.createdAt / 1}
                                  />
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className='flex-1 mt-3'>
                            <p className='subpixel-antialiased text-gray-700'>
                              {post.text}
                            </p>
                          </div>
                        </div>
                        <div className='max-h-80 overflow-auto'>
                          {commentsData?.singlePostComments?.comments?.map(
                            (comment: any, index: number) => (
                              <div
                                key={comment._id}
                                className='ui comments  pl-5 pr-5 '
                              >
                                <div className='comment'>
                                  <a className='avatar'>
                                    <img
                                      src={comment.user.profilePicUrl}
                                      alt='AVATAR'
                                    />
                                  </a>
                                  <div className='content'>
                                    <div className='author'>
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

                                    <div className='text'>{comment.text}</div>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </Modal.Description>
                    </Modal.Content>
                    {/* <Modal.Actions>
                      <Button onClick={() => setcommentsModel(false)} primary>
                        Proceed <Icon name='chevron right' />
                      </Button>
                    </Modal.Actions> */}
                  </Modal>
                </>
              ) : (
                ''
              )}
              {loadingComments
                ? post?._id === postComment && (
                    <div className=' w-full max-w-2xl mx-auto mt-4 flex justify-center'>
                      <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500'></div>
                    </div>
                  )
                : post?._id === postComment &&
                  commentsData?.singlePostComments?.comments?.map(
                    (comment: any, index: number) =>
                      index < 3 && (
                        <div
                          key={comment._id}
                          className='ui comments  pl-5 pr-5'
                        >
                          <div className='comment'>
                            <a className='avatar'>
                              <img
                                src={comment.user.profilePicUrl}
                                alt='AVATAR'
                              />
                            </a>
                            <div className='content'>
                              <div className='author'>
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

                              <div className='text'>{comment.text}</div>
                            </div>
                          </div>
                        </div>
                      )
                  )}
              {/* </>
              )} */}
              {post?._id === commentsData?.singlePostComments?._id && (
                <div className='pb-5 pr-5 pl-5 flex max-w-2xl mx-auto'>
                  <div className='flex-shrink-0'>
                    <img
                      src={image}
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
                          variables: { id: post?._id, text: values.comment },
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
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Posts
