import { addDoc, arrayUnion, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { auth, db, storage } from '../firebase';

function CreateList() {
  // infomation
  const [offer, setOffer] = useState(false);
  const [type, setType] = useState("rent");
  const [parking, setParking] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [beds, setBeds] = useState(1);
  const [baths, setBaths] = useState(1);
  const [regularPrice, setRegularPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [selectedImg, setSelectedImg] = useState([]);

  // map
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(true);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const selectedImgOnChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) { 
      const newImg = e.target.files[i];
      setSelectedImg((pre) => [...pre, newImg]);
    }

     
  };
 
  
  const handleSubmit = async(e) => {
		e.preventDefault();
		setLoading(true);

		// +discountPrice == convert string to number just in case
		if (+discountPrice >= +regularPrice) {
			setLoading(false);
			toast.error("Discounted price needs to be less than regular price");
			return;
		}

		if (selectedImg.length > 6) {
			setLoading(false);
			toast.error("maximum 6 images are allowed");
			return;
		}

		//store lat and lng
		let geoLocation = {};

		//get from the google api
		let location;

		if (geoLocationEnabled) {
			const res = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API}`
			);

			const data = await res.json();

			console.log(data);

			// store lat and lng in  let geoLocation = {};
			geoLocation.lat = data.results[0]?.geometry.location.lat ?? 0;
			geoLocation.lng = data.results[0]?.geometry.location.lng ?? 0;

			// if cannot find address set location == undefined
			location = data.status === "ZERO_RESULTS" && undefined;

			if (location === undefined) {
				setLoading(false);
				toast.error("please enter a correct address");
				return;
			}
		} else {
			geoLocation.lat = lat;
			geoLocation.lng = lng;
		}

		const docRef = await addDoc(collection(db, "realtor_listing"), {
			name,
			offer,
			parking,
			geoLocation: {
				lat: geoLocation.lat,
				lng: geoLocation.lng,
			},
			furnished,
			type,
			description,
			regularPrice,
			discountPrice,
			address,
			beds,
			baths,
			timestamp: serverTimestamp(),
			userRef: auth.currentUser.uid,
		});

		//multiple images upload to storage and firestore
		selectedImg.map((image) => {
			const imageRef = ref(
				storage,
				`realtor_listing/${docRef?.id}/${image.name}`
			);

			uploadBytes(imageRef, image, "data_url").then(async () => {
				const downloadURL = await getDownloadURL(imageRef);
				await updateDoc(doc(db, "realtor_listing", docRef.id), {
					images: arrayUnion(downloadURL),
				});
			});
		});

		setLoading(false);
		toast.success("Listing created");
		navigate(`/category/${type}/${docRef.id}`);
	}

  if (loading) {
    return <Spinner/>
  }

  return (
		<div className="max-w-6xl mx-auto h-screen ">
			<div className="max-w-xl flex flex-col mx-auto p-5">
				<h1 className="text-3xl text-center font-semibold mb-8">
					Create a List
				</h1>

				<form
					onSubmit={handleSubmit}
					encType="multipart/form-data"
					className="flex flex-col w-full  mx-auto space-y-10 mb-24">
					{/* sell and rent */}
					<div className="space-y-1">
						<h3 className="font-bold text-xl">Sell / Rent</h3>

						<div className="flex justify-between items-center space-x-5">
							<button
								type="button"
								className={`CreateListBtn  ${
									type === "rent"
										? "bg-white text-black"
										: "bg-slate-600 text-white"
								}`}
								value="sell"
								onClick={(e) => setType("sell")}>
								sell
							</button>

							<button
								type="button"
								className={`CreateListBtn  ${
									type === "sell"
										? "bg-white text-black"
										: "bg-slate-600 text-white"
								}`}
								value="rent"
								onClick={(e) => setType("rent")}>
								rent
							</button>
						</div>
					</div>

					{/* Name */}
					<div className="space-y-1">
						<h3 className="font-bold text-xl">Name</h3>

						<div className="w-full bg-white ">
							<input
								required
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Name"
								className="pl-5 bg-transparent w-full py-3 rounded-md border-[1.5px] border-gray-200 focus:border-blue-700 transition ease-in-out placeholder:text-lg text-lg outline-none"
							/>
						</div>
					</div>

					{/* bed and bath */}
					<div className="flex items-center w-full space-x-5">
						<div className="w-1/3">
							<h3 className="font-bold text-xl">Beds</h3>
							<input
								value={beds}
								onChange={(e) => setBeds(e.target.value)}
								min="1"
								max="50"
								type="number"
								className="w-full rounded-md h-14 border-[1.5px] border-gray-200 outline-none focus:border-blue-700 transition ease-in-out text-center text-xl p-3"
							/>
						</div>

						<div className="w-1/3">
							<h3 className="font-bold text-xl">Baths</h3>
							<input
								value={baths}
								onChange={(e) => setBaths(e.target.value)}
								min="1"
								max="50"
								type="number"
								className="w-full p-3 rounded-md h-14 outline-none border-[1.5px] border-gray-200 focus:border-blue-700 transition ease-in-out text-center text-xl"
							/>
						</div>
					</div>

					{/* parking spot */}
					<div className="space-y-1">
						<h3 className="font-bold text-xl">Parking spot </h3>

						<div className="flex justify-between items-center space-x-5">
							<button
								type="button"
								className={`CreateListBtn ${
									!parking ? "bg-white text-black" : "bg-slate-600 text-white"
								}`}
								value={true}
								onClick={(e) => setParking(true)}>
								YES
							</button>

							<button
								type="button"
								className={`CreateListBtn ${
									parking ? "bg-white text-black" : "bg-slate-600 text-white"
								}`}
								value={false}
								onClick={(e) => setParking(false)}>
								NO
							</button>
						</div>
					</div>

					{/* Furnished */}
					<div className="space-y-1">
						<h3 className="font-bold text-xl">Furnished</h3>

						<div className="flex justify-between items-center space-x-5">
							<button
								type="button"
								className={`CreateListBtn ${
									!furnished ? "bg-white text-black" : "bg-slate-600 text-white"
								}`}
								value={true}
								onClick={(e) => setFurnished(true)}>
								YES
							</button>

							<button
								type="button"
								className={`CreateListBtn ${
									furnished ? "bg-white text-black" : "bg-slate-600 text-white"
								}`}
								value={false}
								onClick={(e) => setFurnished(false)}>
								NO
							</button>
						</div>
					</div>

					{/* address */}
					<div className="space-y-1">
						<h3 className="font-bold text-xl">Address</h3>

						<textarea
							value={address}
							placeholder="Address"
							onChange={(e) => setAddress(e.target.value)}
							className="w-full h-20 rounded-md outline-none border-[1.5px] border-gray-200 focus:border-blue-700 transition ease-in-out p-2 text-lg pl-5"
						/>
					</div>

					{/* map */}
					{!geoLocationEnabled && (
						<div className="w-full flex items-center  space-x-5">
							<div className="space-y-1 w-1/3">
								<h3 className="font-bold text-xl">Latitude</h3>

								<input
									required
									type="number"
									value={lat}
									min="-90"
									max="90"
									onChange={(e) => setLat(e.target.value)}
									className=" w-full p-3 rounded-md border-[1.5px] border-gray-200 focus:border-blue-700 transition ease-in-out placeholder:text-lg text-lg outline-none text-center"
								/>
							</div>

							<div className="space-y-1 w-1/3">
								<h3 className="font-bold text-xl">Longtitude</h3>

								<input
									required
									min="-180"
									max="180"
									type="number"
									value={lng}
									onChange={(e) => setLng(e.target.value)}
									className=" w-full p-3 rounded-md border-[1.5px] border-gray-200 focus:border-blue-700 transition ease-in-out placeholder:text-lg text-lg outline-none text-center"
								/>
							</div>
						</div>
					)}

					{/* Description */}
					<div className="space-y-1">
						<h3 className="font-bold text-xl">Description</h3>

						<textarea
							placeholder="Description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full h-20 rounded-md outline-none border-[1.5px] border-gray-200 focus:border-blue-700 transition ease-in-out p-2 text-lg pl-5"
						/>
					</div>

					{/* Offer */}
					<div className="space-y-1">
						<h3 className="font-bold text-xl">Offer</h3>

						<div className="flex justify-between items-center space-x-5">
							<button
								type="button"
								value={true}
								onClick={(e) => setOffer(true)}
								className={`CreateListBtn ${
									!offer ? "bg-white text-black" : "bg-slate-600 text-white"
								}`}>
								YES
							</button>

							<button
								type="button"
								value={false}
								onClick={(e) => setOffer(false)}
								className={`CreateListBtn ${
									offer ? "bg-white text-black" : "bg-slate-600 text-white"
								}`}>
								NO
							</button>
						</div>
					</div>

					{/* Regular Price */}
					<div className="flex items-center space-x-10 ">
						<div className="w-full">
							<h3 className="font-bold text-xl">Regular Price</h3>
							<div className="w-1/2 flex items-center  relative">
								<input
									value={regularPrice}
									onChange={(e) => setRegularPrice(e.target.value)}
									type="number"
									min="50"
									required
									max="400000000"
									className="w-[67%] rounded-md h-14 border-[1.5px] border-gray-200 outline-none focus:border-blue-700 transition ease-in-out text-center text-xl p-3"
								/>

								{type === "rent" && (
									<span className="text-lg w-full whitespace-nowrap pl-3 absolute left-[65%] top-3">
										$ / Month
									</span>
								)}
							</div>
						</div>
					</div>

					{/* Discounted Price */}
					{offer && (
						<div className="flex items-center space-x-10">
							<div className="w-full">
								<h3 className="font-bold text-xl">Discounted Price</h3>
								<div className="w-1/3 flex items-center">
									<input
										value={discountPrice}
										onChange={(e) => setDiscountPrice(e.target.value)}
										type="number"
										min="50"
										required
										max="400000000"
										className="w-full rounded-md h-14 border-[1.5px] border-gray-200 outline-none focus:border-blue-700 transition ease-in-out text-center text-xl p-3 "
									/>
								</div>
							</div>
						</div>
					)}

					{/* image */}
					<div className="space-y-1">
						<h3 className="font-bold text-xl">Image</h3>

						<div className="w-full bg-white ">
							<input
								required
								accept=".jpg,.png,.jpeg"
								onChange={selectedImgOnChange}
								multiple
								type="file"
								className="pl-5 bg-transparent w-full py-2.5 rounded-md border-[1.5px] border-gray-200 focus:border-blue-700 transition ease-in-out placeholder:text-lg text-lg outline-none"
							/>
						</div>
					</div>

					<button
						type="submit"
						className="uppercase bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 shadow-md">
						create listing
					</button>
				</form>
			</div>
		</div>
	);
}

export default CreateList
