import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import HomeSlider from '../components/HomeSlider'
import ListingItem from '../components/ListingItem';
import Spinner from '../components/Spinner';
import { db } from '../firebase';

function Home() {
	const [offerListings, setOfferListings] = useState(null);
	const [rentListings, setRentListings] = useState(null);
	const [saleListings, setSaleListings] = useState(null);

	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	// fetch offer listing
	useEffect(() => {
		const fetchListing = async () => {
			setLoading(true);

			const listingRef = collection(db, "realtor_listing");

			const q = query(
				listingRef,
				where("offer", "==", true),
				orderBy("timestamp", "desc"),
				limit(4)
			);

			const querySnapshot = await getDocs(q);
			let listings = [];
			querySnapshot.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});
			setOfferListings(listings);
			setLoading(false);
		};
		fetchListing();
	}, []);

	// fetch rent listing
	useEffect(() => {
		const fetchListing = async () => {
			setLoading(true);

			const listingRef = collection(db, "realtor_listing");

			const q = query(
				listingRef,
				where("type", "==", "rent"),
				orderBy("timestamp", "desc"),
				limit(4)
			);

			const querySnapshot = await getDocs(q);
			let listings = [];
			querySnapshot.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});
			setRentListings(listings);
			setLoading(false);
		};
		fetchListing();
	}, []);

	// fetch sale listing
	useEffect(() => {
		const fetchListing = async () => {
			setLoading(true);

			const listingRef = collection(db, "realtor_listing");

			const q = query(
				listingRef,
				where("type", "==", "sell"),
				orderBy("timestamp", "desc"),
				limit(4)
			);

			const querySnapshot = await getDocs(q);
			let listings = [];
			querySnapshot.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});
			setSaleListings(listings);
			setLoading(false);
		};
		fetchListing();
  }, []);
  
	if (loading) {
		return <Spinner />;
  }
  
  // console.log(offerListings);
  // console.log(rentListings);
  // console.log(saleListings);
	return (
		<div>
			<HomeSlider />

			<div className="max-w-6xl mx-auto">
				{offerListings && offerListings?.length > 0 && (
					<div className="mt-5">
						<h2 className="px-3 text-2xl mt-6 font-semibold">
							Recent offers
						</h2>
						<Link to="/offer">
							<p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
								Show more offers
							</p>
						</Link>

						<div className=" sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-3 ">
							{offerListings.map((list) => (
								<ListingItem key={list.id} id={list.id} listing={list.data} />
							))}
						</div>
					</div>
				)}

				{rentListings && rentListings?.length > 0 && (
					<div className="mt-5">
						<h2 className="px-3 text-2xl mt-6 font-semibold">
							Places for rent
						</h2>
						<Link to="/category/rent">
							<p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
								Show more places for rent
							</p>
						</Link>

						<div className=" sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-3 ">
							{rentListings.map((list) => (
								<ListingItem key={list.id} id={list.id} listing={list.data} />
							))}
						</div>
					</div>
				)}

				{saleListings && saleListings?.length > 0 && (
					<div className="mt-5">
						<h2 className="px-3 text-2xl mt-6 font-semibold">
							Places for sale
						</h2>
						<Link to="/category/sale">
							<p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
								Show more places for sale
							</p>
						</Link>

						<div className=" sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-3 ">
							{saleListings.map((list) => (
								<ListingItem key={list.id} id={list.id} listing={list.data} />
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default Home
