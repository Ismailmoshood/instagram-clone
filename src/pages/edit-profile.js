import React, { useContext, useEffect, useRef, useState } from "react";
import { getAuth, updatePassword } from "firebase/auth";
import UserContext from "../context/user";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../lib/firebase";
import { updateAvatarUser } from "../services/firebase";
// import ReactLoading from "react-loading";
import { ref, getDownloadURL } from "firebase/storage";
import useUser from "../hooks/use-user";
import { updateUser } from "../services/firebase";
import Header from "../components/header";
// import EditProfileModal from "../components/editProfileModal";

const EditProfile = () => {
  // const [loading, setLoading] = useState(false);
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
//   const [modalOpen, setModalOpen] = useState(false);
  const { user } = useContext(UserContext);
  const { user: currentUser, updateProfile: updateProfileUser } = useUser();
  const imageRef = useRef();
  useEffect(() => {
    if (Object.keys(currentUser).length > 0) {
      setFullname(currentUser.fullName);
      setUsername(currentUser.username);
    }
  }, [currentUser]);
  const openChangeAvatarInput = () => {
    const avatarImageURL = currentUser.avatarSrc;
    if (avatarImageURL === "/images/avatars/default.png") {
      return imageRef.current.click();
    }
   //  setModalOpen(true);
  };

  const updateProfile = async () => {
    // setLoading(true);
    const auth = getAuth();
    if (password.trim()) {
      await updatePassword(auth.currentUser, password);
    }

    await updateUser( username, fullname, currentUser.docId);
    alert("Profile was sucessfully uploaded!");
  };

//   const openInput = () => {
//     setModalOpen((prev) => !prev);
//     imageRef.current.click();
//   };

  const uploadImage = async (e) => {
   //  setLoading(true);
    const avatar = e.target.files[0];
    const avatarId = uuidv4();
    const pathAvatar = `images/avatars/${avatarId}.jpg`;
   //  if (modalOpen) setModalOpen(false);
    const uploadImage = storage.ref(pathAvatar).put(avatar);
    const storageRef = ref(storage, pathAvatar);
    uploadImage.on( 
      "state-changed", 
      (snapshot) => { 
      },
      () => {
        alert("Error");
      //   setLoading(false);
      },
      () => {
          getDownloadURL(storageRef)
          .then(async (url) => {
             await updateAvatarUser(url, user.uid);
            updateProfileUser();
            // setLoading(false);
            alert("Succesfully changed avatar!");
          });
      }
    );

    e.target.value = null;
  };

  return (
    <div>
    <Header />
    <div className="mt-6 flex justify-center">
      <div className="border-[1px] border-black rounded flex flex-col p-3">
        <div className="flex items-center mt-4 mb-4 justify-end">
          <div className="flex-auto flex w-32 cursor-pointer justify-end">
            <div className="w-14 h-14 flex mr-2">
              <img className="rounded-full border-2 border-red-500 p-0.5 w-full h-full flex"
                src={currentUser.avatarSrc} alt=""/>
            </div>
          </div>
          <div className="mb-2 flex-auto w-60 ml-4">
            <div>
              <span className="mb-2 text-xl">{user.displayName}</span>
            </div>
            <div onClick={openChangeAvatarInput} className="mt-4 cursor-pointer">
               <span className="  bg-blue-500  rounded-xl p-2 font-bold">
                Upload image
              </span> 
              <input ref={imageRef} onChange={uploadImage} type="file"/>
            </div>
          </div>
        </div>
        <div className="flex items-center my-3 w-full">
          <div className="border-b-[1px] border-black h-0 w-full"></div>
        </div>
        <span>Full Name</span>
        <div className="flex ">
          <div className="fflex-auto flex">
            <label htmlFor="fullname"></label>
          </div>
          <div className="flex-auto w-full">
            <input value={fullname} onChange={(e) => setFullname(e.target.value)}
              className="h-10 border p-2 rounded w-full" type="text" id="fullname"/>
          </div>
        </div>
        <span className="mt-4">User Name</span>
        <div className="flex">
          <div className="flex-auto flex ">
            <label htmlFor="username"></label>
          </div>
          <div className="flex-auto w-full">
            <input value={username} onChange={(e) => setUsername(e.target.value)}
              className="h-10 border p-2 rounded w-full " type="text" id="username"/>
          </div>
        </div>
        <span className="mt-4">New Password</span>
        <div className="flex  ">
          <div className="flex-auto flex ">
            <label htmlFor="newpassword"></label>
          </div>
          <div className="flex-auto w-full">
            <input value={password} onChange={(e) => setPassword(e.target.value)}
              className="h-10 border p-2 rounded w-full"
              autoComplete="off" type="password" id="newpassword"/>
          </div>
        </div>
        <div className="flex mt-6">
          <div className="flex-auto w-32 flex justify-end pr-6"></div>
          <div className="flex-auto w-60 ...">
              <button
                className="bg-blue-500 font-bold text-sm rounded-xl bor w-20 h-8"
                onClick={updateProfile}>
                Submit
              </button>
           
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default EditProfile;