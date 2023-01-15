import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {
	FaShare,
	FaMapMarkerAlt,
	FaBed,
	FaBath,
	FaParking,
	FaChair,
} from "react-icons/fa";
import { toast } from 'react-toastify';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Spinner from '../components/Spinner';
import { MdLocationOn } from 'react-icons/md';
import Contact from '../components/Contact';
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

function CategoryListing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
	const [lat, setLat] = useState("");
	const [lng, setLng] = useState("");

  // console.log(params);

  useEffect(() => {
		setLoading(true);
		const listingRef = doc(db, "realtor_listing", params.id);
		const fetchList = async () => {
			const unsub = await onSnapshot(listingRef, (doc) => {
				if (doc.exists()) {
					setListing(doc.data());
					setLat(doc.data().geoLocation.lat);
					setLng(doc.data().geoLocation.lng);

					setLoading(false);
				} else {
					navigate("/");
					toast.error("Listing does not exist");
				}
			});
			return () => unsub;
		};
		fetchList();
	}, [params.id]);

	// console.log(listing);
	
	// console.log(lat);
	// console.log(lng)

  
  
  if (loading) {
    return <Spinner/>
  }

  
  return (
		<main>
			<Carousel
				autoPlay
				infiniteLoop
				showStatus={false}
				showIndicators={false}
				showThumbs={false}
				interval={5000}>
				{listing?.images.map((image) => (
					<div key={image} className="relative">
						<img
							alt="banner_img"
							src={image}
							className="object-cover w-full h-[300px]"
						/>
					</div>
				))}
			</Carousel>

			<div
				onClick={() => {
					navigator.clipboard.writeText(window.location.href);
					setShareLinkCopied(true);
					setTimeout(() => {
						setShareLinkCopied(false);
					}, 2000);
				}}
				className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-gray-700  cursor-pointer fixed top-12 right-8 hover:shadow-lg bg-white">
				<FaShare className="h-14 w-14  rounded-full p-3  " />
			</div>

			{shareLinkCopied && (
				<p className="fixed top-[24%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2">
					Link Copied
				</p>
			)}

			{/* bottom */}
			<div className="max-w-6xl lg:mx-auto bg-white rounded-lg shadow-lg p-6 flex flex-col lg:flex-row   lg:space-x-5 m-5">
				{/* house*/}
				<div className="w-full space-y-5">
					<p className="mt-4 text-2xl font-bold text-blue-900">
						{listing?.name} - ${" "}
						{listing?.offer
							? listing?.discountPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
							: listing?.regularPrice
									.toString()
									.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
						{listing?.type === "rent" ? " / month" : ""}
					</p>

					<div className="flex items-center w-full -ml-1">
						<div>
							<MdLocationOn className="text-green-600 h-6 w-6" />
						</div>
						<p className="text-gray-500 uppercase font-semibold whitespace-nowrap truncate ml-1">
							{listing?.address.toString()}
						</p>
					</div>

					<div className="space-x-5 w-full flex items-center">
						<div className="w-[40%] md:w-[30%] lg:w-[20%] bg-red-700 py-2 rounded-md">
							<p className="text-center text-lg font-semibold text-white">
								{listing?.type === "rent" ? `For Rent` : `For Sale`}
							</p>
						</div>

						{listing?.discountPrice > 0 && (
							<div className="w-[60%] md:w-[30%] py-2  rounded-md bg-green-800 whitespace-nowrap">
								{listing?.offer && (
									<p className="text-center text-lg font-semibold text-white">
										${+listing?.regularPrice - +listing?.discountPrice} discount
									</p>
								)}
							</div>
						)}
					</div>

					<p>
						<span className="font-semibold">Description -</span>{" "}
						{listing?.description}
					</p>

					<div className="flex items-center gap-3 flex-wrap lg:flex-nowrap lg:gap-5 ">
						<div className="flex items-center space-x-2">
							<FaBed />
							<p>{listing?.beds > 1 ? `${listing?.beds} beds` : `1 Bed`}</p>
						</div>

						<div className="flex items-center space-x-2">
							<FaBath />
							<p>{listing?.baths > 1 ? `${listing?.baths} Baths` : `1 Bath`}</p>
						</div>

						<div className="flex items-center space-x-2">
							<FaParking />
							<p>{listing?.parking ? `Parking` : `No Parking`}</p>
						</div>

						<div className="flex items-center space-x-2">
							<FaChair />
							<p>{listing?.furnished ? `Furnished` : `No Furnished`}</p>
						</div>
					</div>

					{/* listing?.userRef !== auth.currentUser?.uid &&  */}
					{!contactLandlord && (
						<button
							onClick={() => setContactLandlord(true)}
							className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md uppercase">
							Contact LandLord
						</button>
					)}

					{contactLandlord && (
						<Contact userRef={listing?.userRef} listing={listing} />
					)}
				</div>

				<div className="w-full h-[200px] md:h-[600px] z-10  mt-6 md:mt-0 md:ml-2 overflow-x-hidden">
					<MapContainer
						center={[lat, lng]}
						zoom={13}
						scrollWheelZoom={false}
						style={{ height: "400px", width: "100%" }}>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>
						<Marker position={[lat, lng]}>
							<Popup>{listing?.address}</Popup>
						</Marker>
					</MapContainer>
				</div>
			</div>
		</main>
	);
}

export default CategoryListing
