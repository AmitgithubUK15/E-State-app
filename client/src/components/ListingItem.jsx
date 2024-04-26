import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {MdLocationOn} from 'react-icons/md'

export default function ListingItem({list}) {
    console.log(list);
  return (
     <div 
className='bg-white shadow-md hover:shadow-lg 
transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
        <Link to={`/listing/${ list  &&list._id}`}>
           <img src={list  && list.imageUrls[0]} alt="listing cover"
           className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300' />
       
       <div className='p-3 flex flex-col gap-2 w-full'>
        <p className='text-lg font-semibold  text-slate-700 truncate'
        >{ list  && list.name}</p>
        <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-green-700'/>
            <p className='text-sm text-gray-600 truncate w-full'>{list  && list.address}</p>
            
        </div>
        <p className='text-sm text-gray-600 line-clamp-2'>{ list  && list.description}</p>
       
       <p className='text-slate-500 mt-2 font-semibold'>
       $
       {list  && list.offer ? list.discountPrice.toLocaleString('en-US') 
       : list&& list.regularPrice.toLocaleString('en-US')}

       { list  && list.type === 'rent' && ' / month'}
       </p>
      <div className='text-slate-700 flex gap-4'>
        <div className='font-bold text-sm '>
            { list&& list.bedrooms >1 ? `${list&& list.bedrooms} beds ` 
            :  `${ list&& list.bedrooms} beds`}
        </div>

        <div className='font-bold text-sm '>
            {list&& list.bathroom >1 ? `${list&& list.bathroom} Bathrooms` 
            :  `${1} Bathroom`}
        </div>
      </div>
       </div>
        </Link>
     </div>
  )
}


ListingItem.propTypes = {
    list: PropTypes.object,
};