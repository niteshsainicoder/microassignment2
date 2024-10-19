import React from 'react'

function Nav({logedin,setauth,setlogedin}:{logedin:boolean,setauth:(arg0:boolean)=>void,setlogedin:(arg0:boolean)=>void}) {
const handleauth=()=>{
  if(logedin){
    setauth(false)
    setlogedin(false)
  }else{
    setauth(true)
  }
}

  return (
  <div className="bg-gray-300 caret-transparent  border-[1px] shadow-xl border-gray-400 rounded-3xl p-2 flex justify-between items-center px-7 sm:px-14  w-10/12 sm:w-7/12 sticky top-7">
   <span className='text-gray-600 font-semibold text-lg sm:text-3xl antialiased '>
   Analytics
   </span>
   <div>
    <span onClick={()=>handleauth()} className=' text-gray-400 hover:text-gray-500 hover:scale-110 font-semibold cursor-pointer text-xl'> {!logedin  ?'login':'Logout'}</span>
  </div>
  </div>
  )
}

export default Nav
