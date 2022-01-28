import { Formik } from 'formik'
import * as yup from 'yup'
import Router from 'next/router'
import { toast } from 'react-toastify'
import { Input, Message } from 'semantic-ui-react'
import { getSession, signIn, SignInResponse } from 'next-auth/react'
import { useState } from 'react'
import Image from 'next/image'
const Register = () => {
  const [file, setfile] = useState('')

  const fileHandler = (event: any) => {
    const reader = new FileReader()
    reader.onload = (onLoadEvent) => {
      //@ts-ignore
      setfile(onLoadEvent?.target?.result)
    }
    reader.readAsDataURL(event?.target?.files[0])
  }
  console.log(file)
  const validationSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    name: yup.string().required('Name is required'),
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
    password: yup
      .string()
      .min(6, 'Password should be atleast 6 characters')
      .required('Password is required'),
  })

  //
  return (
    <div>
      <Formik
        initialValues={{
          name: '',
          username: '',
          email: '',
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          console.log(values)
          const res: SignInResponse | undefined = await signIn('credentials', {
            redirect: false,
            email: values.email,
            password: values.password,
            username: values.username,
            name: values.name,
            profilePicUrl: file,
            action: 'register',
          })
          console.log('RESPONCE', res)
          //@ts-ignore
          if (res?.error) {
            //@ts-ignore
            return toast.error(res.error)
          }

          const session = await getSession()

          if (session) {
            return Router.push('/')
          }
        }}
      >
        {({
          errors,

          touched,

          handleChange,

          handleBlur,

          handleSubmit,

          isSubmitting,
        }) => (
          <div className='w-screen max-w-4xl mx-auto pt-8'>
            <Message
              className='!text-indigo-500 !border-indigo-700 !border !bg-indigo-100'
              icon='signup'
              header='Welcome Register Below to Get Started.'
              content='Create New Account.'
            />
            {file && (
              <>
                <div className='text-center'>
                  <Image
                    src={file}
                    alt='Uploaded Image'
                    width='500'
                    height='250'
                    // layout='fill'
                    className=' object-contain'
                  />
                </div>
                <div className='flex w-full  items-center justify-center'>
                  <button
                    onClick={() => setfile('')}
                    className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-500 ease-in-out'
                  >
                    Clear
                  </button>
                </div>
              </>
            )}
            {!file && (
              <div className='flex w-full items-center justify-center mt-4'>
                <label className='w-64 flex flex-col items-center px-4 py-6 tracking-wide uppercase border !text-indigo-500 !border-indigo-700  !bg-indigo-100 rounded-lg cursor-pointer  '>
                  <svg
                    className='w-8 h-8'
                    fill='currentColor'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 20 20'
                  >
                    <path d='M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z' />
                  </svg>
                  <span className='mt-2 text-base leading-normal'>
                    Upload Profile Picture
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

            <form
              className={`space-y-6  ${
                isSubmitting ? 'ui loading form' : 'ui form'
              }`}
              onSubmit={handleSubmit}
            >
              <div className={errors.name && touched.name ? 'error field' : ''}>
                <label className=' text-sm font-medium text-gray-700'>
                  Name
                </label>

                <div className='mt-1'>
                  <input
                    className={
                      'shadow-sm focus:!ring-indigo-500 h-10 p-5 focus:border-indigo-500 border-gray-700  border  w-full sm:text-sm rounded-md'
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    id='name'
                    name='name'
                    type='text'
                    placeholder='Enter your Name'
                  />
                </div>

                {errors.name && touched.username && (
                  <div
                    className='ui pointing above prompt label'
                    role='alert'
                    aria-atomic='true'
                  >
                    {errors.name}
                  </div>
                )}
              </div>
              <div
                className={errors.email && touched.email ? 'error field' : ''}
              >
                <label className=' text-sm font-medium text-gray-700'>
                  Email
                </label>
                <div className='mt-1'>
                  <input
                    className={
                      'shadow-sm focus:ring-indigo-500 h-10 p-5 focus:border-indigo-500 border-gray-700  border  w-full sm:text-sm rounded-md'
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    id='email'
                    name='email'
                    type='email'
                    placeholder='Enter your Email'
                  />
                </div>
                {errors.email && touched.email && (
                  <div
                    className='ui pointing above prompt label'
                    role='alert'
                    aria-atomic='true'
                  >
                    {errors.email}
                  </div>
                )}
              </div>
              <div
                className={
                  errors.password && touched.password ? 'error field' : ''
                }
              >
                <label className=' text-sm font-medium text-gray-700'>
                  Password
                </label>
                <div className='mt-1'>
                  <input
                    className={
                      'shadow-sm focus:ring-indigo-500 h-10 p-5 focus:border-indigo-500 border-gray-700  border  w-full sm:text-sm rounded-md'
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    id='password'
                    name='password'
                    type='password'
                    placeholder='Enter your Password'
                  />
                </div>
                {errors.password && touched.password && (
                  <div
                    className='ui pointing above prompt label'
                    role='alert'
                    aria-atomic='true'
                  >
                    {errors.password}
                  </div>
                )}
              </div>
              <div
                className={
                  errors.username && touched.username ? 'error field' : ''
                }
              >
                <label className=' text-sm font-medium text-gray-700'>
                  UserName
                </label>
                <div className='mt-1'>
                  <input
                    className={
                      'shadow-sm focus:ring-indigo-500 h-10 p-5 focus:border-indigo-500 border-gray-700  border  w-full sm:text-sm rounded-md'
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                    id='username'
                    name='username'
                    type='text'
                    placeholder='Enter your UserName'
                  />
                </div>
                {errors.username && touched.username && (
                  <div
                    className='ui pointing above prompt label'
                    role='alert'
                    aria-atomic='true'
                  >
                    {errors.username}
                  </div>
                )}
              </div>
              <div className='text-center pb-5'>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-500 ease-in-out'
                >
                  {isSubmitting ? 'Loading...' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        )}
      </Formik>
    </div>
  )
}

export default Register

{
  /* <div
        className='ui pointing below prompt label !text-red-400 !bg-red-100 !border-2 !border-red-400'
        id='form-input-control-error-email-error-message'
        role='alert'
        aria-atomic='true'
      >
        Please enter a valid email address
      </div> */
}
