import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';
import { auth } from '../firebase';

function ForgotPassword() {
	const [email, setEmail] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await sendPasswordResetEmail(auth, email);

			toast.success("Password reset email sent!");
		} catch (error) {
			toast.error("Something Wrong!");
		}
	};

  return (
		<section className="max-w-6xl mx-auto p-10">
			<h1 className="text-3xl text-center font-semibold">
				Forgot Password
			</h1>

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
							type="email"
							placeholder="Email address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="p-3 rounded-md border border-gray-300 w-full outline-none focus:border-blue-700 transition-all ease-in-out focus:border-2 focus:shadow-md"
						/>

						<div className="flex items-center justify-between text-xs sm:text:lg ">
							<span>
								Don't have an account?{" "}
								<span className="text-red-500 cursor-pointer">
									<Link to="/signup">Register</Link>
								</span>
							</span>

							<span className="text-blue-600 cursor-pointer">
								<Link to="/signin">Sign in instead</Link>
							</span>
						</div>

						<button
							type="submit"
							className="bg-blue-600 text-white font-bold py-2 hover:bg-blue-500 rounded-md">
							SEND RESET EMAIL
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

export default ForgotPassword
