import React, { useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form';

interface InputProps {
  auth: boolean,
  setauth: (arg0: boolean) => void,
  setlogedin: (arg0: boolean) => void,
}
function Form({ auth, setauth, setlogedin }: InputProps) {
  const { register, handleSubmit } = useForm();
  const [signup, setsignup] = useState<boolean>(false)
  // Helper function to decide the API URL
  const [data, setdata] = useState<string[]>(["Email", "Password"])


  // Function to handle form submission
  const onSubmit = async (data: FieldValues) => {
    // Construct URL and options for the fetch request
    let urldata;
    if (auth) {
      urldata = { url: `http://localhost:3000/api/authentication/login?Email=${data.Email}&Password=${data.Password}` }


      if (signup) {


        urldata = {
          url: `http://localhost:3000/api/authentication/signup`,
          options: {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Name: data.Name,
              Email: data.Email,
              Password: data.Password,
            }),
          }
        };
      }
    }
    await fetch(urldata!.url, urldata?.options).then((response) => {
      return response.json();
    }).then((response) => {
      if (response.message == 'Login successful') {
        setlogedin(true);
        setauth(false);
      }
      if (response.message == 'User signed up successfully') {
        setsignup(false);
      }
    }
    ).catch((error) => {
      console.error('Error occurred during form submission', error);
    })



  };
  useEffect(() => {
    if (signup) {
      setdata(prev => (["Name", ...prev]))
    }
    else {
      setdata(["Email", "Password"])
    }
  }, [signup])
  return (
    <div className='fixed inset-0 z-50 bg-opacity-15 backdrop-blur-[2px] flex justify-center items-center text-black bg-white'>
      <form onSubmit={handleSubmit(onSubmit)} className='min-w-[300px] sm:min-w-[400px]  relative border-gray-300 border-[1px]  w-[300px] sm:w-[400px] max-w-[500px] h-[400px] max-h-[450px] rounded-2xl flex flex-col justify-center items-center  p-0 bg-opacity-85 z-50 bg-gray-50'>
        <h1 className=' font-bold antialiased text-xl text-gray-600 mb-4'>  {signup ? 'Signup' : 'Login'}</h1>
        {data!.map((element, index) => <div key={index} className='flex w-full pb-2 px-8 flex-col  justify-center items-start'><label className='text-gray-500 font-semibold pl-2'>{element}</label>
          <input type="text" {...register(element, { required: true })} className='border-2 border-gray-200  outline-none caret-slate-400   shadow-md w-full rounded-lg px-2 p-1 mt-1' placeholder={element} /></div>)}

        <button type='submit' onClick={() => { }} className='bg-[#6b8095] shadow-lg hover:bg-[#5e7285]  text-white px-4 p-1 rounded-lg mt-3' >{auth && signup ? 'Signup' : 'Login'}</button>
        {auth && signup ?
          <> <span className='mt-4'>already have account<button type='button' onClick={() => { setsignup(false) }} className='text-blue-500 hover:text-blue-600 mb-2' >here!</button>  </span> </> : <> <span className='mt-4'>don&apos;t have account, create<button type='button' onClick={() => { setsignup(true) }} className='text-blue-500 hover:text-blue-600' >here!</button>  </span> </>}
        <span className='absolute top-0 right-0 px-4 pt-2 text-gray-500 font-bold text-2xl cursor-pointer' onClick={() => { setauth(false) }}>×</span>
      </form>
    </div>
  )
}

export default Form
