import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuthStatus } from '../hooks/useAuthStatus';

function Header() {
  const navigate = useNavigate();
	const location = useLocation();
	const { loggedIn } = useAuthStatus();
	const [pageState, setPageState] = useState("Sign in");

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setPageState("Profile");
			} else {
				setPageState("Sign in");
			}
		});
	}, [auth]);
	
   const pathMatchRoute = (route) => {
			if (route === location.pathname) {
				return true;
			}
		}
  return (
		<header className="sticky top-0 z-40 shadow-sm border-b bg-white ">
			<div className="flex items-center justify-between max-w-5xl mx-auto px-3 py-2">
				{/* left */}
				<div>
					<img
						onClick={() => navigate("/")}
						src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
						alt="logo"
						className="cursor-pointer h-5"
					/>
				</div>

				{/* right */}
				<div className="space-x-10">
					<button
						onClick={() => navigate("/")}
						className={`HeaderBtn hidden sm:inline  ${
							pathMatchRoute("/") &&
							`underline underline-offset-8 decoration-red-400 decoration-2 text-black`
						}`}>
						Home
					</button>

					<button
						onClick={() => navigate("/offer")}
						className={`HeaderBtn hidden sm:inline ${
							pathMatchRoute("/offer") &&
							`underline underline-offset-8 decoration-red-400 decoration-2 text-black`
						}`}>
						Offers
					</button>
						<button
								onClick={() => {
									if (loggedIn) {
										navigate("/profile");
									} else {
										navigate("/signin");
									}
									
								}}
							className={`HeaderBtn ${
								(pathMatchRoute("/signin") || pathMatchRoute("/profile")) &&
								`underline underline-offset-8 decoration-red-400 decoration-2 text-black`
							}`}>
							{pageState}
						</button>
				</div>
			</div>
		</header>
	);
}

export default Header
