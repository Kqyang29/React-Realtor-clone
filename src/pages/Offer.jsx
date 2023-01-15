import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import ListingItem from '../components/ListingItem';
import Spinner from '../components/Spinner';
import { db } from '../firebase';

function Offer() {
	const [offerListings, setOfferListings] = useState(null);
  const [postNum, setPostNum] = useState(8);
	const [loading, setLoading] = useState(false);

	// fetch offer listing
	useEffect(() => {
		const fetchListing = async () => {
			setLoading(true);

			const listingRef = collection(db, "realtor_listing");

			const q = query(
				listingRef,
				where("offer", "==", true),
				orderBy("timestamp", "desc"),
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

  console.log(offerListings);
  
  if (loading) {
		return <Spinner />;
	}

  return (
		<div className="max-w-6xl mx-auto">
			<div className="w-full mb-20">
				<h2 className="pt-5 text-3xl font-bold text-center">Offers</h2>

				{offerListings && offerListings?.length > 0 && (
					<div className="flex flex-col items-center">
						<div className=" sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-5 p-3 ">
							{offerListings?.slice(0, postNum).map((list) => (
								<ListingItem key={list.id} id={list.id} listing={list.data} />
							))}
						</div>

						<button
							onClick={() => setPostNum(postNum + 8)}
							className="bg-slate-50 px-7 py-3 border border-gray-200 rounded-md shadow-sm hover:border-gray-500 transition duration-150 ease-in-out">
							Load More
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default Offer;
