import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';
import {updateUserStart,updateUserSuccess,updateUserFailure} from '../redux/user/userSlice'


export default function Profile() {
  const { currentUser,loading,error } = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePrec, setFilePrec] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false);
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
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>

      <p className='text-red-500 mt-5'>
        {error ? error : ""}
      </p>
      <p className='text-green-500 mt-5'>
        {updateSuccess ? "Profile update Successfully":""}
      </p>
    </div>
  )
}
