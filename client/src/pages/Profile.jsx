import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';
import {updateUserStart,updateUserSuccess,updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutUserStart, signoutUserFailure, signoutUserSuccess} from '../redux/user/userSlice'
import {Link} from 'react-router-dom'

export default function Profile() {
  const { currentUser,loading,error } = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePrec, setFilePrec] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError,setShowListingError] = useState(false);
  const [userListing,setUserlisting] = useState([])
  const dispatch = useDispatch();
  
  

  console.log(formData);
  // firebase storage
  // allow read;
  // allow write : if
  // request.resource.size < 2* 1024 *1024 && 
  // request.resource.contentType.matches('image/.*')


  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + '_' + file.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePrec(Math.round(progress));
      },

      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => setFormData({ ...formData, avatar: downloadURL }));

      }
    );
  }


  const handleChange =  (e) =>{
    setFormData({...formData, [e.target.id]:e.target.value});
  }

  const handleSubmit = async (e)=>{
    
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
      })

      const data = await res.json();
      if(data.success === false){
        dispatch(updateUserFailure(data.message))
        return;
      }

      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
      
    }
  }

  async function handleDeleteUser(){
    try {
       dispatch(deleteUserStart());

       const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:"DELETE",
       });

       const data = await res.json();

       if(data.success === false){
        dispatch(deleteUserFailure(error.message))
       }

       dispatch(deleteUserSuccess(data));
       localStorage.clear();
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }


  async function handleSignout(){
    try {
      dispatch(signoutUserStart())
      const res = await fetch("/api/auth/signout")
      const data = await res.json();

      if(data.success === false){
        dispatch(signoutUserFailure(error.message))
        return;
      }

      dispatch(signoutUserSuccess(data))
      localStorage.clear();
    } catch (error) {
      dispatch(signoutUserFailure(error.message))
    }
  }

  async function handleshowListing(){
   try {
     const res = await fetch(`/api/user/listing/${currentUser._id}`)
     const data = await res.json();
     if(data.success === false){
      setShowListingError(true);
      return
     }
     setUserlisting(data);
     setShowListingError(false);
   } catch (error) {
    setShowListingError(true);
   }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center m-5'>Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>

        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />

        <img
          onClick={() => fileRef.current.click()}
          src={formData?.avatar || currentUser.avatar} alt="profile"
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center '
        />

        <p className='text-sm self-center'>
          {fileUploadError ?
            (<span className='text-red-700'>Error Image upload
              (image must be less then 2 mb)
            </span>)
            : filePrec > 0 && filePrec < 100 ? (
              <span className='text-slate-700'>
                {`Uploading ${filePrec}%`}</span>)
              :
              filePrec === 100 ? (
                <span className='text-green-500'>
                  Image Successfully uploaded
                </span>)
                : ""
          }
        </p>

        <input type="text" placeholder='username'
          id='username'
          defaultValue={currentUser.username}
          className='border p-3 rounded-lg '
          onChange={handleChange}
        />
        <input type="email" placeholder='email'
          defaultValue={currentUser.email}
          id='email'
          className='border p-3 rounded-lg '
          onChange={handleChange}
        />
        <input type="text" placeholder='password'
          id='password'
          className='border p-3 rounded-lg '
          onChange={handleChange}
        />

        <button disabled={loading}
          className='bg-slate-700 text-white
       rounded-lg p-3 uppercase hover:opacity-95
      disabled:opacity-80'
        >
          {loading ? "Update...": "Update" }
        </button>

        <Link 
        className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
        to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete account</span>
        <span onClick={handleSignout} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>

      <p className='text-red-500 mt-5'>
        {error ? error : ""}
      </p>
      <p className='text-green-500 mt-5'>
        {updateSuccess ? "Profile update Successfully":""}
      </p>
      <button onClick={handleshowListing} 
      className='text-green-700 w-full'
      >Show Listing</button>
     <p> { userListing && userListing.length >0 &&
        <div className='flex flex-col gap-4' >
          <h1 className='text-center my-7 text-2xl font-semibold'>Your Listings</h1>
          {userListing.map((listing)=>(
          <div key={listing._id} className='border rounded-lg p-3 flex justify-between item-center gap-4'>
           <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt=""
            className='h-16 w-18 object-contain '
            />
           </Link>
          <Link to={`/listing/${listing._id}`}
          className='text-slate-700 font-semibold  hover:underline truncate'
          >
            <p >{listing.name}</p>
          </Link>

          <div className='flex flex-col item-center' >
            <button className='text-red-700'>Delete</button>
            <button className='text-green-700'>Add</button>
          </div>

          </div>
        ))}
        </div>
     } </p>
    </div>

  )
}
