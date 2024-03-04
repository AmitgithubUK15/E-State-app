import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signInStart, signInSuccess,signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFromData] = useState({});
  const {loading,error} = useSelector((state)=>state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const handleChange = (e) => {
    setFromData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // create method
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
     
      if (data.success === false) {
        dispatch(signInFailure(data.message))
        return;
      }
      dispatch(signInSuccess(data))
      navigate('/');
    }
    catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  // console.log(formData);

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='email'
          name='email'
          id='email'
          placeholder='Enter Email'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='password'
          name='password'
          id='password'
          placeholder='Enter Password'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <button 
        disabled={loading}
         className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth />
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      <div className='mt-5 text-red-500'>{error && <p>{error}</p>}</div>
    </div>
  );
}
