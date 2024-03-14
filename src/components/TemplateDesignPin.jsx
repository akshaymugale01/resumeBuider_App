import React, { useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { BiFolderPlus, BiHeart, BiSolidFolderPlus, BiSolidHeart } from "react-icons/bi";
import useUser from '../hooks/useUser';
import { saveToCollections, saveToFavourites } from "../api"
import useTemplates from '../hooks/useTemplates';
import { useNavigate } from 'react-router-dom';

const TemplateDesignPin = ({ data, index }) => {

  const { data: user, refetch: userRefetch } = useUser();
  const { refetch: temp_refetch } = useTemplates();

  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate()

  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollections(user, data);
    userRefetch();
  };

  const addToFavourites = async (e) => {
    e.stopPropagation();
    await saveToFavourites(user, data);
    temp_refetch();
  };

  const handleRouteNavigate = () => {
    navigate(`/resumeDetail/${data?._id}` , { replace : true })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ delay: index * 0.3, ease: "easeInOut" }}
    >
      <div className='w-full h-[500px] 2xl:h-[720px] rounded-md bg-gray-200 overflow-hidden relative'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={data?.imageURL}
          className='w-full h-full object-cover'
          alt=""
        />

        <AnimatePresence>
          {isHovered && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}

            onClick={handleRouteNavigate}

            className='absolute inset-0 bg-[rgba(0,0,0,0.4)] flex flex-col items-center justify-start px-4 py-3 z-50 cursor-pointer'
          >
            <div className='flex flex-col items-end justify-start w-full gap-8'>
              <InnerBoxCard
                label={user?.collections?.includes(data?._id)
                  ? "Added"
                  : "Add"
                }
                Icon={user?.collections?.includes(data?._id)
                  ? BiSolidFolderPlus
                  : BiFolderPlus
                }
                onHandle={addToCollection}
              />

              <InnerBoxCard
                label={data?.favourites?.includes(user?.uid)
                ? "Added To Favourites"
                : "Add to Favourites"
                }
                Icon={data?.favourites?.includes(user?.uid)
                ? BiSolidHeart
                : BiHeart
              }
                onHandle={addToFavourites}
              />
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const InnerBoxCard = ({ label, Icon, onHandle }) => {

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onHandle}
      className='w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:shadow-md relative'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon className="text-gray-700 text-base" />

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, x: -48 }} // Move to the left by 48 units
            animate={{ opacity: 1, scale: 1, x: -48 }} // Move to the left by 48 units
            exit={{ opacity: 0, scale: 0.6, x: -48 }} // Move to the left by 48 units
            className='px-3 py-2 rounded-md bg-gray-200 absolute -right-0 after:w-2 after:h-2 after:bg-gray-200 after:absolute
                      after:-right-1 after:top-[14px] after:rotate-45'
          >
            <p className='text-sm text-gray-500 whitespace-nowrap'>{label}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateDesignPin;
