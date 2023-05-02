import { baseUrl } from "../components/api.js";
import { routeAllListings } from "../components/api.js";

export async function createListing() {
	const title = document.querySelector("#brand-input").value;
	const description = document.querySelector("#product-descripton-input").value;
	const tags = [
		document.querySelector("#brand-input").value,
		document.querySelector("#product-input").value,
		document.querySelector("#age-input").value,
		document.querySelector("#select-volume").value,
		document.querySelector("#select-alcohol-volume").value,
		document.querySelector("#select-country").value,
		"whisky",
	];
	const endsAt = new Date(document.getElementById("auction-ends-input").value);
	let productImage = [];
	if (document.querySelector("#upload-product-image").value) {
		productImage = [document.querySelector("#upload-product-image").value];
	}
	const media = productImage;

	const now = new Date();
	const twoHoursLater = new Date(now.getTime() + 4 * 60 * 60 * 1000); // Two hours later
	const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Seven days later

	const auctionEndInput = document.getElementById("auction-ends-input");
	if (auctionEndInput) {
		auctionEndInput.value = twoHoursLater.toISOString().substring(0, 16);
		auctionEndInput.min = twoHoursLater.toISOString().substring(0, 16);
		auctionEndInput.max = sevenDaysLater.toISOString().substring(0, 16);
	}

	const user = JSON.parse(localStorage.getItem("user"));
	const response = await fetch(baseUrl + routeAllListings, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${user.accessToken}`,
		},
		body: JSON.stringify({
			title,
			description,
			tags,
			media,
			endsAt,
		}),
	});

	if (response.status === 201) {
		const data = await response.json();
	} else {
		console.log(body);
		console.error("Error submitting form");
	}
}
