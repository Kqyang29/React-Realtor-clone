import React, { useEffect, useState } from 'react'
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';
import { toast } from 'react-toastify';

function Contact({userRef,listing}) {

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const docRef = doc(db, "realtor_users", userRef);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setUser(docSnap.data());
			} else {
				
				toast.error("No such document!");
			}
    }

    getUser();
   }, [userRef]);



  return (
		<div className="w-full space-y-2 ">
			<h1 className="">
				Contact {user?.name} for the {listing?.name}
			</h1>

			<textarea
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				className="w-full p-2 border rounded-lg outline-none focus:border-blue-600 focus:border-2 transition duration-150 ease-in-out"
				placeholder="Message"
			/>

			<a href={`mailto:${user?.email}?Subject=The message from Realtor.com,about your house ${listing?.name}&body=${message}`}>
				<button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md uppercase">
					Send Message
				</button>
			</a>
		</div>
	);
}

export default Contact
