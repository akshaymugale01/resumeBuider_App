
import React from 'react'
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getTemplateDetails, saveToCollections, saveToFavourites } from '../api';


import { MainSpinner, TemplateDesignPin } from '../components';
import { Link } from 'react-router-dom';
import { FaHouse } from "react-icons/fa6";
import { BiFolderPlus, BiHeart, BiSolidFolderPlus, BiSolidHeart } from 'react-icons/bi';
import useUser from '../hooks/useUser';
import useTemplates from '../hooks/useTemplates';
import { AnimatePresence } from 'framer-motion';


const TempleteDesignPinDetails = () => {
  const { templateID } = useParams();

  const { data, isError, isLoading, refetch } = useQuery(
    ["template", templateID],
    () => getTemplateDetails(templateID)
  );
  const { data: user, refetch: userRefetch } = useUser();

  const { data: templates, refetch: temp_refetch, isLoading: temp_isLoading } = useTemplates();

  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollections(user, data);
    userRefetch();
  };

  const addToFavourites = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    temp_refetch();
    refetch();

  };

  if (isLoading) return <MainSpinner />

  if (isError) {
    return (
      <div className='w-full h-[60vh] flex flex-col items-center justify-center'>
        <p className='text-lg text-gray-500 font-semibold'>
          Error While Fetching data .... Plz Try Again
        </p>
      </div>
    )
  }

  return (
    <div className='w-full flex items-center justify-start flex-col px-4 py-12'>

      {/* bread crump */}
      <div className='w-full flex items-center pb-8 gap-2'>
        <Link
          to={"/"}
          className="flex items-center justify-center gap-2 text-gray-500"
        >
          <FaHouse /> Home
        </Link>
        <p>/</p>
        <p>{data?.name}</p>
      </div>
      {/* design Section layer 2 */}
      <div className='w-full grid grid-cols-1 lg:grid-cols-12'>
        {/* Left section */}
        <div className='col-span-1 lg:col-span-8 flex flex-col items-start justify-start gap-4'>
          {/* Load template img */}
          <img className='object-contain max-w-80 max-h-80 rounded-md'
            src={data?.imageURL} alt="" />

          {/* title and other options */}
          <div className='w-full flex flex-col items-start justify-start gap-2'>
            {/* title section */}
            <div className='w-full flex items-center justify-between'>
              {/* title */}
              <p className='text-base text-gray-500 font-semibold'>{data?.title}
              </p>

              {/* likes count */}

              {data?.favourites?.length > 0 && (
                <div className='flex items-center justify-center gap-1'>
                  <BiHeart className='text-base text-red-500' />
                  <p className=' text-base text-gray-400 font-semibold'>
                    {data?.favourites?.length} Likes
                  </p>
                </div>
              )}
            </div>

            {/* collection and fav option */}
            {user && (
              <div
                className='flex items-center justify-center gap-3'>
                {user?.collections?.includes(data?._id) ? (
                  <React.Fragment>
                    <div onClick={addToCollection}
                      className='flex items-center justify-center px-4 py-2 rounded-md border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer'
                    >
                      <BiSolidFolderPlus className='text-base text-gray-500' />
                      <p className='text-sm text-gray-500 whitespace-nowrap'>Remove from Collection</p>
                    </div>
                  </React.Fragment>

                ) : (

                  <React.Fragment>
                    <div
                      onClick={addToCollection}
                      className='flex items-center justify-center px-4 py-2 rounded-md border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer'
                    >
                      <BiFolderPlus className='text-base text-gray-500' />
                      <p className='text-sm text-gray-500 whitespace-nowrap'>Add to Collections</p>
                    </div>
                  </React.Fragment>
                )}
                {data?.favourites?.includes(user?.uid) ? (
                  <React.Fragment>
                    <div onClick={addToFavourites}
                      className='flex items-center justify-center px-4 py-2 rounded-md border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer'
                    >
                      <BiSolidHeart className='text-base text-gray-500' />
                      <p className='text-sm text-gray-500 whitespace-nowrap'>Remove from Favorite</p>
                    </div>
                  </React.Fragment>

                ) : (

                  <React.Fragment>
                    <div
                      onClick={addToFavourites}
                      className='flex items-center justify-center px-4 py-2 rounded-md border-gray-300 gap-2 hover:bg-gray-200 cursor-pointer'
                    >
                      <BiFolderPlus className='text-base text-gray-500' />
                      <p className='text-sm text-gray-500 whitespace-nowrap'>Add to Favorites</p>
                    </div>
                  </React.Fragment>
                )}
              </div>
            )}
          </div>
        </div>

        {/* right section */}
        <div className='col-span-1 lg:col-span-4 w-full flex-col items-center justify-start px-3 gap-6'>

          {/* discover more */}

          <div className='w-full h-72 bg-blue-200 rounded-md overflow-hidden relative'
            style={{
              background:
                "url(https://as1.ftcdn.net/v2/jpg/00/46/44/02/1000_F_46440268_HxTMxCec1EntidRNV0mrw1wMDtMcYk8g.jpg)",
              backgroundPosition: "center",
              backgroundSize: "cover"
            }}
          >
            <div className='absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] hover:bg-[rgba(0,0,0,0.1)]'>
              <Link
                to={"/"}
              >
                Discover MORE!
              </Link>
            </div>
          </div>

          {/* edit the templates*/}
          {user && (
            <Link className='w-full px-4 py-3 rounded-md flex items-center justify-center bg-emerald-500 cursor-pointer'
              to={`/resume/${data?.name}?templateID=${templateID}`}>
              <p className='text-white font-semibold text-lg'>Edit these template</p>
            </Link>
          )}

          {/* tags */}

          <div className='w-full flex items-center justify-center flex-wrap gap-2'>
            {data?.tags?.map((tag, index) => (
              <p className='text-xs border border-gray-300 px-2 py-1 rounded-md whitespace-nowrap' kay={index}>{tag}</p>
            ))}
          </div>
        </div>
      </div>
      {/* similar templates */}
      {templates?.filter((temp) => temp._id !== data?._id)?.length > 0 && (
        <div className='w-full py8 flex flex-col items-center justify-start gap-4'>
          <p className='text-lg font-semibold text-gray-800'>You Might also Likes</p>
          <div className='w-full grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 2xl:grid-cols-4 gap-2'>
            <React.Fragment>
              <AnimatePresence>
                {templates
                ?.filter((temp) => temp._id !== data?._id).map((template, index) => (
                  <TemplateDesignPin
                    key={template?._id}
                    data={template}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </React.Fragment>
          </div>
        </div>
      )}
    </div>
  )
}

export default TempleteDesignPinDetails
