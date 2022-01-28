import Navbar from './Navbar'
import Sidebar from './Sidebar'
const Layout = ({ children }: any) => {
  return (
    <>
      <Navbar />

      <div className='h-screen flex '>
        {/* SIDE BAR */}
        <div className='w-64'>
          <Sidebar />
        </div>
        {/* Post AREA */}
        <main className='w-full'>{children}</main>
        {/* Friends List */}
        <div className='w-3/12'>FRIENDS LIST</div>
      </div>
    </>
  )
}

export default Layout
