import React from 'react'

function Spinner() {
  return (
		<div className=" flex items-center h-screen justify-center w-full rounded-lg">
			<div className="bg-black w-1/3 bg-opacity-50 h-20 flex items-center justify-center">
				<h1 className="text-white font-bold text-3xl text-center">Loading...</h1>
			</div>
		</div>
	);
}

export default Spinner
