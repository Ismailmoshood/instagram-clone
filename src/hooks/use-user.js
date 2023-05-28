import { useState, useContext, useEffect } from "react";
import { getUserByUserId } from "../services/firebase";
import UserContext from "../context/user";

export default function useUser() {
    const [ activeUser, setActiveUser ] = useState({});
    const { user } = useContext(UserContext);
    // console.log(activeUser)
    async function getUserObjByUserId() {
      // console.log(user.uid)
        const [response] = await getUserByUserId(user.uid);
        setActiveUser(response);
    }

    const updateProfile = () => {
        getUserObjByUserId();
    }

    useEffect(() => {
        if(user?.uid) {
            getUserObjByUserId();
        }
    }, [user])

    return { user: activeUser, updateProfile };
}