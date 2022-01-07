import {
  HomeIcon,
  UsersIcon,
  ChatAlt2Icon,
  BellIcon,
  LogoutIcon,
} from '@heroicons/react/outline'
const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon, current: true },
  { name: 'Messages', href: '#', icon: ChatAlt2Icon, current: false },
  { name: 'Notifications', href: '#', icon: BellIcon, current: false },
  { name: 'Account', href: '#', icon: UsersIcon, current: false },
  { name: 'Logout', href: '#', icon: LogoutIcon, current: false },
]
const Sidebar = () => {
  return (
    <div className='hidden md:flex md:flex-shrink-0'>
      <div className='flex flex-col w-64'>
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
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`
                          ${
                            item.current
                              ? '!text-indigo-500 !border-indigo-700 !border !bg-indigo-100'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-900 hover:border hover:border-indigo-500'
                          }
                        group flex items-center px-2 py-3 text-lg font-medium rounded-md
                      `}
                >
                  <item.icon
                    className={`
                          ${
                            item.current
                              ? '!text-indigo-500 '
                              : 'text-gray-400 group-hover:text-indigo-500'
                          }
                          mr-3 flex-shrink-0 h-6 w-6 
                        `}
                    aria-hidden='true'
                  />
                  {item.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
