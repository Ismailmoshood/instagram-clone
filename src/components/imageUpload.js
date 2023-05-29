import React, { useState, useContext } from "react";
// import { db, storage } from '../firebase';
import { v4 as uuidv4 } from "uuid";
import FirebaseContext from '../context/firebase';
import useUser from "../hooks/use-user";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, collection } from "firebase/firestore";


export function ImageUpload(){
   const { firebase } = useContext(FirebaseContext);
   const db = firebase.firestore();
   const storage = firebase.storage()
   const [caption, setCaption] = useState('')
   const [image, setImage] = useState('')
   const [progress, setPogress] = useState(0)
   const { user } = useUser();
   const userId = user.userId
   const photoId = uuidv4();

   function handleChange(e){
      if(e.target.files[0]){
         setImage(e.target.files[0])
      }
   }
   function handleUpload(){
     const storageRef = ref(storage,`images/posts/${image.name}`);
     const uploadTask = uploadBytesResumable(storageRef, image);
     uploadTask.on(
      "state_changed",
      (snapshot) => {
         const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
         );
         setPogress(progress)
      },
      (error) => {
         console.log(error);
         alert(error.message);
      },
      () => {
            console.log("upload done")
            getDownloadURL(storageRef)
            .then((downloadURL) => {
             setDoc(doc(collection(db, "photos")), {
                  caption: caption,
                  imageSrc: downloadURL,
                  userId: userId,
                  photoId: photoId,
                  likes: [],
                  comments: [],
                  dateCreated: Date.now()
             })
             alert("New Post Created");
             setCaption('')
             setImage(null)
             setPogress(0)
            })
         }

     )}
     
   return (
    <div className="flex flex-col justify-evenly mt-10 h-100px w-40% m-auto mb-20 border py-4 ">
      <progress style={{'width': 100 + '%'}} value={progress} max="100"/>
      <input className="mb-2" type="text" placeholder="Enter a caption here..." onChange={event => setCaption(event.target.value)} value={caption}  />
      <input type="file" onChange={handleChange} />
      <button className="bg-blue-medium font-bold py-1 px-4 w-20 mt-4 m-auto rounded text-white" onClick={handleUpload}>
         Upload
      </button>
   </div>
  )
}