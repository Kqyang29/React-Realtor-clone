import { signOut, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { AiFillHome } from 'react-icons/ai';
import {  useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from 'react-toastify';


function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => { 

    const getUser = async () => {
      const docRef = doc(db, "realtor_users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setUser(docSnap?.data());
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
    }
   
    auth.currentUser&& getUser();
  }, [auth]);


  const handleSubmit = async() => {
    
    try {
     //update current user profile
     if (auth.currentUser.displayName !== name) {
				await updateProfile(auth.currentUser, {
					displayName: name,
				});
      }
      
      // update to firebase
      const docRef = doc(db, "realtor_users", auth.currentUser.uid);

      await updateDoc(docRef, {
        name: name,
      });

      toast.success("user info updated successfully!");
   } catch (error) {
      toast.error("Could not update the profile details");
   }



  }


  return (
		<div className="max-w-6xl mx-auto flex flex-col">
			{/* top */}
			<div className="p-10 space-y-8 flex flex-col items-center">
				<h1 className="text-4xl font-semibold mt-6">My Profile</h1>

				{/* body */}
				<div className="max-w-xl w-full mx-auto">
					<form className="flex flex-col space-y-5">
						<input
							type="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder={user?.name}
							disabled={!edit}
							className={`p-4 rounded-md border border-gray-300 w-full outline-none focus:border-blue-700 transition-all ease-in-out focus:border-2 focus:shadow-md disabled:bg-white placeholder:text-black placeholder:text-2xl text-2xl shadow-sm  ${
								edit && `bg-red-200 focus:bg-red-200`
							}`}
						/>
						<input
							type="email"
							placeholder={user?.email}
							disabled
							className="p-4 rounded-md border border-gray-300 w-full outline-none focus:border-blue-700 transition-all ease-in-out focus:border-2 focus:shadow-md disabled:bg-white placeholder:text-black placeholder:text-2xl text-2xl shadow-sm"
						/>
						{/* <div className="p-3 rounded-md border border-gray-300 w-full shadow-sm bg-white">
							<p className="text-xl pl-2">{user?.email}</p>
						</div> */}

						<div className="flex items-center justify-between text-sm lg:text-lg">
							<span>
								Don't have an account?{" "}
								<span
									onClick={() => {
										setEdit(!edit);
										edit && handleSubmit();
									}}
									className="text-red-500 cursor-pointer">
									{edit ? "Apply Changed" : "Edit"}
								</span>
							</span>

							<span
								onClick={() => {
									signOut(auth).then(() => navigate("/signin"));
								}}
								className="text-blue-600 cursor-pointer">
								Sign out
							</span>
						</div>
						<button
							type="submit"
							className="bg-blue-600 text-white  py-3 hover:bg-blue-500 rounded-md flex items-center justify-center">
							<AiFillHome className="h-7 w-7 bg-white rounded-full text-pink-400 mr-3" />
							SELL OR RENT YOUR HOUSE
						</button>
					</form>
				</div>
			</div>

			{/* bottom */}
			<div className='flex flex-col items-center'>
				<h1 className="text-3xl mt-6">My listings</h1>
			</div>
		</div>
	);
}

export default Profile;
