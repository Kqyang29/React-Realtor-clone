import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import Spinner from './Spinner';

function HomeSlider() {
  const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	// fetch listing
	useEffect(() => {
		const fetchListing = async () => {
			setLoading(true);

			const listingRef = collection(db, "realtor_listing");

			const q = query(
				listingRef,
        orderBy("timestamp", "desc"),
        limit(5)
			);

			const querySnapshot = await getDocs(q);
			let listings = [];
			querySnapshot.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				});
			});
			setListing(listings);
			setLoading(false);
		};
		fetchListing();
  }, []);
  
   if (loading) {
			return <Spinner />;
		}
		if (listing?.length === 0) {
			return <></>;
    }
  
  // console.log(listing[0].data.regularPrice - listing[0].data.discountPrice)

  return (
		listing && (
			<Carousel
				autoPlay
				infiniteLoop
				showStatus={false}
				showIndicators={false}
				showThumbs={false}
				interval={5000}>
				{listing?.map((list) => (
					<div
						onClick={() => navigate(`/category/${list?.data?.type}/${list.id}`)}
						key={list.id}
						className="relative cursor-pointer">
						<img
							alt="banner_img"
							src={list?.data?.images[0]}
							className="object-cover w-full h-[300px]"
						/>

						<p className="absolute text-white top-5 left-5 bg-green-700 p-2 rounded-br-3xl rounded-sm shadow-lg">
							{list?.data?.name}
						</p>

						<p className="absolute text-white bottom-5 left-5 bg-red-700 p-2 rounded-tr-3xl rounded-sm shadow-lg">
							${list.data.discountedPrice ?? list.data.regularPrice}
							{list.data.type === "rent" && " / month"}
						</p>
					</div>
				))}
			</Carousel>
		)
	);
}

export default HomeSlider
