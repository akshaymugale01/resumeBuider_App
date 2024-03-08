import React, { useEffect, useState } from 'react'
import { FaTrash, FaUpload } from 'react-icons/fa';
import { PuffLoader } from 'react-spinners';

import { toast } from "react-toastify"
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from '../config/firebaseConfig';
import { adminIds, initialTags } from '../utils/helper';
import { deleteDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import useTemplates from '../hooks/useTemplates';
import { db } from '../config/firebaseConfig';
import { doc } from 'firebase/firestore';
import useUser from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';


const CreateTemplate = () => {
  const [formData, setFromData] = useState({
    title: "",
    imageURL: null,
  });

  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    uri: null,
    progress: 0
  })

  const [selectedTags, setSelectedTags] = useState([])

  const {
    data: templates,
    isError: templatesIsError,
    isLoading: templatesIsLoading,
    refetch: templatesRefetch,
  } = useTemplates();

  const {data : user,isLoading} = useUser();

  const navigate = useNavigate();
  //handeling the input field change
  const handelInputChange = (e) => {
    const { name, value } = e.target;
    console.log(value)
    setFromData((prevRec) => ({ ...prevRec, [name]: value }));
  };


  //Handle File Selection
  const handleFileSelect = async (e) => {
    setImageAsset((preAsset) => ({ ...preAsset, isImageLoading: true }));
    const file = e.target.files[0];

    if (file && isAllowed(file)) {
      //
      const storageRef = ref(storage, `Templetes/${Date.now()}-${file.name}`);

      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on("state_changed",
        (snapshot) => {
          setImageAsset((preAsset) => ({ ...preAsset, progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 }));
        },
        (error) => {
          if (error.message.includes("storage/unautharised")) {
            toast.error(`Error : Autharised Revoked`)
          } else {
            toast.error(`Error : ${error.message}`)
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(donwloadURL => {
            setImageAsset((preAsset) => ({ ...preAsset, uri: donwloadURL }));
          });

          toast.success("Image uploaded");
          setInterval(() => {
            setImageAsset((preAsset) => ({
              ...preAsset,
              isImageLoading: false
            }))
          }, 2000)
        }
      ); // <-- Closing parenthesis was missing here
    } else {
      toast.info("Invalid File Format");
    }
  };

  const deleteAnImageObject = async () => {
    setInterval(() => {
      setImageAsset((preAsset) => ({
        ...preAsset,
        progress: 0,
        uri: null,
        isImageLoading: true,
      }));
    }, 2000);
    setImageAsset((preAsset) => ({ ...preAsset, isImageLoading: true }))
    const deleteRef = ref(storage, imageAsset.uri);
    deleteObject(deleteRef).then(() => {
      toast.success("Image Deleted!");

    })
  }

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
    return allowedTypes.includes(file.type)
  }

  const handelSelectedTags = (tag) => {
    // check if tag is selected or not
    if (selectedTags.includes(tag)) {
      // if selected then remove it
      setSelectedTags(selectedTags.filter(selected => selected !== tag));
    } else {
      // if not selected then add it
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const pushToCloud = async () => {
    const timestamp = serverTimestamp()
    const id = `${Date.now()}`
    const _doc = {
      _id: id,
      title: formData.title,
      imageURL: imageAsset.uri,
      tags: selectedTags,
      name:
        templates && templates.length > 0
          ? `Template ${templates.length + 1}`
          : "Template1",
      timestamp: timestamp,
    };

    await setDoc(doc(db, "templates", id), _doc).then(() => {
      setFromData((prevData) => ({ ...prevData, title: "", imageURL: "" }));
      setImageAsset((preAsset) => ({ ...preAsset, uri: null }));
      setSelectedTags([]);
      templatesRefetch()
      toast.success("Data pushed to cloud");
    }).catch(error => {
      console.log(`Error: ${error.message}`);
    })
  }

  // remove data from cloud
  const removeTemplate = async (template) => {
    const deleteRef = ref(storage, template?.imageURL)
    await deleteObject(deleteRef).then(async () => {
      await deleteDoc(doc(db, "templates", template?._id ))
      .then(()=> {
        toast.success("template delted Sucessfully from cloud")
        templatesRefetch();
      }).catch((err)=> {
        toast.error(`Error: ${err.message}`);
      });
    });
  }

  useEffect(() => {
  if(!isLoading && !adminIds.includes(user?.uid)){
    navigate("/", {replace : true })
  }
  }, [user, isLoading])


  return (
    <div className='w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12 h-screen flex-col overflow-scroll'>
      {/* Left Container */}
      <div className='col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex-1 flex items-center justify-start flex-col gap-4 px-2'>
        <div className='w-full '>
          <p className='text-lg text-gray-600 '>Create New Template</p>
        </div>

        {/* Templete ID Section */}

        <div className='w-full flex items-center justify-end'>
          <p className='text-base text-gray-400 uppercase font-semibold'>
            TempID :{"  "}
          </p>
          <p className='text-sm text-gray-900 capitalize font-bold'>
            {templates && templates.length > 0
              ? `Template${templates.length + 1}`
              : "Template1"}
          </p>
        </div>

        {/* Templete title section */}
        <input
          className='w-full px-4 py-3 rounded-md bg-transparent border border-gray-500 text-lg text-gray-300 focus:text-gray-900'
          type="text"
          name='title'
          placeholder='Template title'
          value={formData.title}
          onChange ={handelInputChange}
        />


        {/* FIle Uploader Section */}
        <div className='w-full bg-gray-100 backdrop-blur-md h-[420px] lg:h-[620px] 2xl:h-[740px] rounded-md border-2 border-dottted border-gray-300 cursor-pointer flex items-center justify-center'>
          {imageAsset.isImageLoading ? (
            <React.Fragment>
              <div className='flex flex-col items-center justify-center gap-4'>
                <PuffLoader color='#498FCD' size={40} />
                <p>{imageAsset?.progress.toFixed(2)}%</p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {!imageAsset?.uri ? (
                //File Uploaded
                <React.Fragment>
                  <label className='w-full cursor-pointer h-full' >
                    <div className='flex flex-col items-center justify-center h-full w-full'>
                      <div className='flex items-center justify-center cursor-pointer flex-col gap-4'>
                        <FaUpload className='text-2xl' />
                        <p className='text-lg text-gray-400'>CLick to Upload</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      className='w-0 h-0'
                      accept='.jpeg,.jpg,.png'
                      onChange={handleFileSelect}
                    />
                  </label>
                </React.Fragment>
              ) : (
                //Preview Uploaded Image
                <React.Fragment>
                  <div className='relative w-full h-full overflow-hidden rounded-md'>
                    <img
                      src={imageAsset?.uri}
                      className='w-full h-full object-cover'
                      loading='lazy'
                      alt=""
                    />

                    {/* Delete action */}

                    <div className='absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-600 cursor-pointer'
                      onClick={deleteAnImageObject}
                    >
                      <FaTrash className='text-sm text-white' />
                    </div>

                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>
        {/* Tags */}
        <div className='w-full flex items-center flex-wrap gap-2'>
          {initialTags.map((tag, i) => (
            <div
              key={i}
              className={`border border-gray-300 px-2 py-1 rounded-md cursor-pointer 
        ${selectedTags.includes(tag) ? "bg-blue-500 text-white" : ""}`}
              onClick={() => handelSelectedTags(tag)}
            >
              <p>{tag}</p>
            </div>
          ))}
          <p className='text-orange-500 text-xl cursor-help font-bold px-8 py-3 rounded-md border border-gray-800 shadow-xl  gap-4'>:Tags</p>
        </div>

        <button
          type='button'
          className='w-full bg-blue-700 text-white rounded-md py-3'
          onClick={pushToCloud}
        >
          Save it
        </button>
      </div>

      {/* Righr Corner Container */}
      <div className='col-span-12 lg:col-span-8 2xl:col-span-9 px-2 w-full
      flex-1 py-4'>
        {templatesIsLoading ? (
          <React.Fragment>
            <div className='W-full h-full flex items-center justify-center'>
              <PuffLoader color='#498FCD' size={40} />
            </div>
          </React.Fragment>
      ): (
        <React.Fragment>
          {templates && templates.length > 0 ? (
            <React.Fragment>
              <div className='w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4'>
              {templates?.map(template => (
                <div key={template._id} className='w-full h-[500px] rounded-md overflow-hidden relative'>
                  <img src={template?.imageURL} 
                  alt=""
                  className='w-full h-full object-cover' />

                     {/* Delete action */}

                     <div className='absolute top-4 right-4 w-8 h-8 rounded-md flex items-center justify-center bg-red-600 cursor-pointer'
                      onClick={() => removeTemplate(template)}
                    >
                      <FaTrash className='text-sm text-white' />
                    </div>

                </div>
              ))}
              </div>
              </ React.Fragment>
          ): (
            <React.Fragment>
              <div className='W-full h-full flex items-center justify-center'>
              <PuffLoader color='#498FCD' size={40} />
            
            <p className='text-xl tracking-wider capitalize text-gray-500'>No Data
            </p>
            </div>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
      </div>
    </div>
  )
}

export default CreateTemplate;
