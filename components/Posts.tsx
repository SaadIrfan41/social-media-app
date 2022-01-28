/* eslint-disable @next/next/no-img-element */
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import TextareaAutosize from 'react-textarea-autosize'
import {
  PhotographIcon,
  VideoCameraIcon,
  EmojiHappyIcon,
} from '@heroicons/react/outline'

import { useEffect, useState } from 'react'

import { toast } from 'react-toastify'
import { Icon, Modal, Image } from 'semantic-ui-react'

import InfiniteScroll from 'react-infinite-scroll-component'
import PostUserData from './PostUserData'
import DeletePostButton from './DeletePostButton'
import Comment_Like_Section from './Comment_Like_Section'
import EventEmitter from 'events'

export const ALL_POSTS = gql`
  query ($page: Int, $limit: Int) {
    allPaginatedPosts(page: $page, limit: $limit) {
      paginator {
        totalPages
        totalPosts
        hasNextPage
        hasPrevPage
        next
        perPage
        prev
      }
      posts {
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
  }
`

const CREATE_POST = gql`
  mutation ($text: String!, $picUrl: String) {
    createPost(text: $text, picUrl: $picUrl)
  }
`

export const SINGLE_POST_COMMENTS = gql`
  query ($id: ID!) {
    singlePostComments(id: $id) {
      _id
      comments {
        _id
        date
        text
        user {
          _id
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
  // const { inView, entry, ref } = useInView()
  // const [pageNumber, setpageNumber] = useState(1)
  console.log('User', logedInUser)
  const [postModel, setpostModel] = useState(false)
  const [commentsModel, setcommentsModel] = useState(false)
  // const [postComment, setpostComment] = useState('')
  const [file, setfile] = useState(null)

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

  const { data, loading, error, fetchMore, refetch } = useQuery(ALL_POSTS, {
    // notifyOnNetworkStatusChange: true,
  })
  useEffect(() => {
    refetch()
  }, [refetch])
  if (loading)
    return (
      <div className=' w-full max-w-2xl mx-auto mt-4 flex justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500'></div>
      </div>
    )
  if (error) return <h1>Error</h1>
  console.log('ALL POSTS', data)

  const emitter = new EventEmitter()
  emitter.setMaxListeners(100)
  // or 0 to turn off the limit
  // emitter.setMaxListeners(0)

  const validationPostSchema = yup.object().shape({
    text: yup.string().required('Text Field is Empty'),
  })

  const fileHandler = (event: any) => {
    const reader = new FileReader()
    reader.onload = (onLoadEvent) => {
      //@ts-ignore
      setfile(onLoadEvent?.target?.result)
    }
    reader.readAsDataURL(event?.target?.files[0])
  }

  const renderPosts = async () => {
    try {
      await fetchMore({
        variables: { page: data?.allPaginatedPosts?.paginator?.next },
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='w-full max-w-2xl mx-auto  mt-4'>
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
        <InfiniteScroll
          dataLength={data?.allPaginatedPosts?.posts?.length}
          next={renderPosts}
          hasMore={data?.allPaginatedPosts?.paginator?.hasNextPage}
          loader={<h3> Loading...</h3>}
          endMessage={<h4>Nothing more to show</h4>}
        >
          {data?.allPaginatedPosts?.posts?.map((post: any) => (
            <div
              key={post._id}
              className='flex flex-col rounded-lg shadow-md  mt-5'
            >
              <div className='flex-1 bg-white p-6 flex flex-col justify-between'>
                <div className='flex items-center w-full'>
                  <PostUserData
                    username={post.user.username}
                    userImage={post.user.profilePicUrl}
                    createdAt={post.createdAt}
                    userId={post.user._id}
                  />
                  <DeletePostButton
                    postId={post?._id}
                    postUserId={post.user._id}
                    logedInUser={logedInUser}
                  />
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
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default Posts
