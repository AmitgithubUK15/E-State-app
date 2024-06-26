import { FaSearch } from 'react-icons/fa'
import {Link, useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux'
import { useEffect, useState } from 'react';

export default function Headers() {

  const {currentUser} = useSelector(state =>state.user);
  const [searchTerm , setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handlesubmit = (e)=>{
    e.preventDefault();

    const urlparams = new URLSearchParams(window.location.search);
    urlparams.set('searchTerm',searchTerm);
    const searchQuery = urlparams.toString();
    navigate(`/search?${searchQuery}`)
  }

  useEffect(()=>{
    const urlparams = new URLSearchParams(window.location.search);
    const searchTermfromUrl = urlparams.get('searchTerm');
    if(searchTermfromUrl){
      setSearchTerm(searchTermfromUrl);
    }
  },[location.search])
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
         <Link to='/'>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
          <span className='text-slate-500'>Find</span>
          <span className='text-slate-700'>Estate</span>
        </h1>
         </Link>
        <form onSubmit={handlesubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
          <input
            type="text"
            placeholder='search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64 '
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
          />
         <button >
         <FaSearch className='text-slate-600 ' /> 
         </button>
        </form>
        <ul className='flex gap-4 '>
            <Link to="/">
            <li className='xl:block md:block sm:block  text-slate-700 text-sm hover:underline'>
              Home
              </li>
            </Link>

            <Link to='/about'>
            <li className='xl:block md:block sm:block  text-slate-700 text-sm hover:underline'>
              About
              </li>
            </Link>

            <Link to='/profile'>
              {currentUser ? (
               <img className='rounded-full h-7 w-7 object-cover ' src={currentUser.avatar} alt='profile' />
              ):
            (
              <li className='xl:block md:block sm:block  text-slate-700 text-sm hover:underline'>
              Signin
              </li>
            )
              }
              </Link>
           
          </ul>
      </div>
    </header>
  )
}
