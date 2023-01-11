import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth, db, googleProvider } from '../firebase';

function OAuth() {
	const navigate = useNavigate();

	const handleClick = async () => {
		try {
			await signInWithPopup(auth, googleProvider);

			const user = auth.currentUser;

			// check for the user
			const docRef = doc(db, "realtor_users", user.uid);
			
			const docSnap = await getDoc(docRef);

			// if not exist, create new account
			if (!docSnap.exists()) {
				await setDoc(docRef, {
					name: user.displayName,
					email: user.email,
					timestamp: serverTimestamp(),
				}).then(()=>toast.success("Sign up successfully!"));
			} 
			else {
				toast.success("Sign in successfully!");
			}

			navigate("/");
		} catch (error) {
			toast.error("something wrong with Signing");
		}

	}
  return (
		<button
			onClick={handleClick}
			className='flex items-center justify-center py-2 bg-red-700 rounded-md text-white font-bold hover:bg-red-500'>
			<FcGoogle className='w-7 h-7 mr-2 bg-white rounded-full'/>
      Continue with Google
		</button>
	);
}

export default OAuth
