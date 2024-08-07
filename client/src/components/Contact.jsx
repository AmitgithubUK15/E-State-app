import  { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CustomFetch from '../utils/CustomFetch';

export default function Contact({listing}) {
  const [landlord,setLandlord] =useState(null);
  const [message,setMessage] = useState('')

  const onChangefunction = (e)=>{
    setMessage(e.target.value);
  }
  useEffect(()=>{
    const fetchLandlord = async ()=>{
      try {
        const res = await CustomFetch(`${import.meta.env.VITE_SERVER_URL}/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchLandlord();
  },[listing.userRef])
  return (
    <>
     {landlord && (
      <div className='flex flex-col gap-2'>
        <p>Contact <span className='font-semibold'>{landlord.username} </span> for 
        <span  className='font-semibold'> {listing.name}</span></p>
       <textarea name="message" id="message" rows="2"
       value={message} onChange={onChangefunction}
       placeholder='enter you message here..'
       className='w-full border p-3 rounded-lg'></textarea>
       <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
       className='bg-slate-700 text-white text-center p-3 uppercase
        hover:opacity-95'>
       SendMessage
       </Link>
      </div>
     )}
    </>
  )
}

Contact.propTypes = {
  listing: PropTypes.object.isRequired,
};