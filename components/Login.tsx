import { Formik } from 'formik'
import * as yup from 'yup'
import Router from 'next/router'
import { toast } from 'react-toastify'
import { Input, Message } from 'semantic-ui-react'
import { getSession, signIn, SignInResponse } from 'next-auth/react'
import { useState } from 'react'
const Login = () => {
  const [showpassword, setshowpassword] = useState('password')
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Invalid email address')
      .required('Email is required'),
    password: yup
      .string()
      .min(6, 'Password should be atleast 6 characters')
      .required('Password is required'),
  })
  return (
    <div>
      <Formik
        initialValues={{
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

            action: 'login',
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
              icon='key'
              header='Welcome SignIn Below to Get Started.'
              content='Login with Email and Password'
            />

            <form
              className={`space-y-6  ${
                isSubmitting ? 'ui loading form' : 'ui form'
              }`}
              onSubmit={handleSubmit}
            >
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
                className={`${
                  errors.password && touched.password ? 'error field' : ''
                } `}
              >
                <label className=' text-sm font-medium text-gray-700'>
                  Password
                </label>

                <div className='mt-1 relative'>
                  <div
                    className='absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer'
                    onClick={() =>
                      showpassword === 'text'
                        ? setshowpassword('password')
                        : setshowpassword('text')
                    }
                  >
                    {showpassword === 'text' ? (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z'
                          clipRule='evenodd'
                        />
                        <path d='M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z' />
                      </svg>
                    ) : (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5 '
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                        <path
                          fillRule='evenodd'
                          d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    )}
                  </div>
                  <input
                    className={'w-full !pl-10 sm:text-sm  rounded-md'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    id='password'
                    name='password'
                    type={showpassword}
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

              <div className='text-center'>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-500 ease-in-out '
                >
                  {isSubmitting ? 'Loading...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        )}
      </Formik>
    </div>
  )
}

export default Login
