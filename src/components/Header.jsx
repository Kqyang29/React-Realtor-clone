import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

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
						className={`HeaderBtn ${
							pathMatchRoute("/") &&
							`underline underline-offset-8 decoration-red-400 decoration-2 text-black`
						}`}>
						Home
					</button>

					<button
						onClick={() => navigate("/offer")}
						className={`HeaderBtn ${
							pathMatchRoute("/offer") &&
							`underline underline-offset-8 decoration-red-400 decoration-2 text-black`
						}`}>
						Offers
					</button>

					{auth.currentUser ? (
						<button
							onClick={() => navigate("/profile")}
							className={`HeaderBtn ${
								pathMatchRoute("/profile") &&
								`underline underline-offset-8 decoration-red-400 decoration-2 text-black`
							}`}>
							Profile
						</button>
					) : (
						<button
							onClick={() => navigate("/signin")}
							className={`HeaderBtn ${
								pathMatchRoute("/signin") &&
								`underline underline-offset-8 decoration-red-400 decoration-2 text-black`
							}`}>
							Sign in
						</button>
					)}
				</div>
			</div>
		</header>
	);
}

export default Header
