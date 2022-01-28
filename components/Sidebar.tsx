import {
  HomeIcon,
  UsersIcon,
  ChatAlt2Icon,
  BellIcon,
  LogoutIcon,
} from '@heroicons/react/outline'
import { getSession, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Sidebar = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  // console.log(session)

  //@ts-ignore
  // console.log(session?.user?.username)
  // console.log(router)
  return (
    <div className={'hidden md:flex md:flex-shrink-0  '}>
      <div className='flex flex-col w-64 fixed h-full top-0 '>
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className='flex flex-col h-0 flex-1 border-r border-gray-200 bg-white'>
          <div className='flex-1 flex flex-col pt-5 pb-4 overflow-y-auto'>
            {/* <div className='flex items-center flex-shrink-0 px-4'>
                  <img
                    className='h-8 w-auto'
                    src='https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg'
                    alt='Workflow'
                  />
                </div> */}
            <nav className='mt-5 flex-1 px-2 bg-white space-y-1'>
              <Link href='/'>
                <a
                  className={`
                          ${
                            router.pathname === '/'
                              ? '!text-indigo-500 !border-indigo-700 !border !bg-indigo-100'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-900 hover:border hover:border-indigo-500'
                          }
                        group flex items-center px-2 py-3 text-lg font-medium rounded-md
                      `}
                >
                  <HomeIcon
                    className={`
                          ${
                            router.pathname === '/'
                              ? '!text-indigo-500 '
                              : 'text-gray-400 group-hover:text-indigo-500'
                          }
                          mr-3 flex-shrink-0 h-6 w-6 
                        `}
                    aria-hidden='true'
                  />
                  Home
                </a>
              </Link>
              <Link href='#'>
                <a
                  className={`
                          ${
                            router.pathname === '/messages'
                              ? '!text-indigo-500 !border-indigo-700 !border !bg-indigo-100'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-900 hover:border hover:border-indigo-500'
                          }
                        group flex items-center px-2 py-3 text-lg font-medium rounded-md
                      `}
                >
                  <ChatAlt2Icon
                    className={`
                          ${
                            router.pathname === '/messages'
                              ? '!text-indigo-500 '
                              : 'text-gray-400 group-hover:text-indigo-500'
                          }
                          mr-3 flex-shrink-0 h-6 w-6 
                        `}
                    aria-hidden='true'
                  />
                  Messages
                </a>
              </Link>
              <Link href='#'>
                <a
                  className={`
                          ${
                            router.pathname === '/notifications'
                              ? '!text-indigo-500 !border-indigo-700 !border !bg-indigo-100'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-900 hover:border hover:border-indigo-500'
                          }
                        group flex items-center px-2 py-3 text-lg font-medium rounded-md
                      `}
                >
                  <BellIcon
                    className={`
                          ${
                            router.pathname === '/notifications'
                              ? '!text-indigo-500 '
                              : 'text-gray-400 group-hover:text-indigo-500'
                          }
                          mr-3 flex-shrink-0 h-6 w-6 
                        `}
                    aria-hidden='true'
                  />
                  Notifications
                </a>
              </Link>
              {}

              <Link
                href={
                  //@ts-ignore
                  `/profile/${session?.user?.id}`
                }
              >
                <a
                  className={`
                          ${
                            router.pathname === '/profile/[id]'
                              ? '!text-indigo-500 !border-indigo-700 !border !bg-indigo-100'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-900 hover:border hover:border-indigo-500'
                          }
                        group flex items-center px-2 py-3 text-lg font-medium rounded-md
                      `}
                >
                  <UsersIcon
                    className={`
                          ${
                            router.pathname === '/profile/[id]'
                              ? '!text-indigo-500 '
                              : 'text-gray-400 group-hover:text-indigo-500'
                          }
                          mr-3 flex-shrink-0 h-6 w-6 
                        `}
                    aria-hidden='true'
                  />
                  Account
                </a>
              </Link>
              <Link href='/'>
                <a
                  className={`
                          ${
                            router.pathname === '/logout'
                              ? '!text-indigo-500 !border-indigo-700 !border !bg-indigo-100'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-900 hover:border hover:border-indigo-500'
                          }
                        group flex items-center px-2 py-3 text-lg font-medium rounded-md
                      `}
                >
                  <LogoutIcon
                    className={`
                          ${
                            router.pathname === '/logout'
                              ? '!text-indigo-500 '
                              : 'text-gray-400 group-hover:text-indigo-500'
                          }
                          mr-3 flex-shrink-0 h-6 w-6 
                        `}
                    aria-hidden='true'
                  />
                  Logout
                </a>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
