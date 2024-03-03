import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFromData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    }
    catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  // console.log(formData);

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          name='username'
          id='username'
          placeholder='Username'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
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
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/sign-in'>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      <div className='mt-5 text-red-500'>{error && <p>{error}</p>}</div>
    </div>
  );
}
