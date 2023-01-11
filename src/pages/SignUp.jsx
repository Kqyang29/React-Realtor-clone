import React, { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from '../firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';


function SignUp() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async(e) => {
		e.preventDefault();

		try {
			await createUserWithEmailAndPassword(auth, email, password);

			const user = auth.currentUser;

			await updateProfile(user, {
				displayName: name,
			});

			await setDoc(doc(db, 'realtor_users', user.uid), {
				name: name,
				email: email,
				timestamp: serverTimestamp()
			});

			toast.success("Sign up successfully!");
			navigate('/');

		} catch (error) {
			toast.error("something wrong with registration");
		}

		
		
	};



  return (
		<section className="max-w-6xl mx-auto p-10">
			<h1 className="text-3xl text-center font-semibold mt-6">Sign Up</h1>

			{/* body */}
			<div className="flex flex-col items-center lg:flex-row">
				{/* img */}
				<div className=" md:w-[67%] lg:w-[50%] mb-12 md:mb-6 mt-10">
					<img
						src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1373&q=80"
						alt="key"
						className="w-full rounded-2xl"
					/>
				</div>

				{/* bottom */}
				<div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20 ">
					<form onSubmit={handleSubmit} className="flex flex-col space-y-5">
						<input
							type="name"
							placeholder="Full Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="p-2 rounded-md border border-gray-300 w-full outline-none focus:border-blue-700 transition-all ease-in-out focus:border-2 focus:shadow-md"
						/>

						<input
							type="email"
							placeholder="Email address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="p-2 rounded-md border border-gray-300 w-full outline-none focus:border-blue-700 transition-all ease-in-out focus:border-2 focus:shadow-md"
						/>

						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="p-2 rounded-md border border-gray-300 w-full outline-none focus:border-blue-700 transition-all ease-in-out focus:border-2 focus:shadow-md"
							/>

							{showPassword ? (
								<AiFillEyeInvisible
									className="absolute right-3.5 top-3 text-xl cursor-pointer"
									onClick={() => setShowPassword(!showPassword)}
								/>
							) : (
								<AiFillEye
									className="absolute right-3.5 top-3 text-xl cursor-pointer"
									onClick={() => setShowPassword(!showPassword)}
								/>
							)}
						</div>

						<div className="flex items-center justify-between text-xs sm:text:lg ">
							<span>
								Don't have an account?{" "}
								<span className="text-red-500 cursor-pointer">
									<Link to="/signin">Sign In</Link>
								</span>
							</span>

							<span className="text-blue-600 cursor-pointer">
								<Link to="/forgotpassword">Forgot Password?</Link>
							</span>
						</div>

						<button
							type="submit"
							className="bg-blue-600 text-white font-bold py-2 hover:bg-blue-500 rounded-md">
							Sign Up
						</button>

						<div className="flex items-center before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300">
							<p className="text-center text-sm font-semibold text-gray-500 mx-4 ">
								OR
							</p>
						</div>

						<OAuth />
					</form>
				</div>
			</div>
		</section>
	);
}

export default SignUp
