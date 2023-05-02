import { baseUrl } from "../components/api.js";

const user = JSON.parse(localStorage.getItem("user"));

async function createBid(listingId, amount) {
	try {
		const headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${user.accessToken}`,
		};
		const body = JSON.stringify({ amount });
		const response = await fetch(
			`${baseUrl}/auction/listings/${listingId}/bids`,
			{
				method: "POST",
				headers,
				body,
			}
		);
		const data = await response.json();
	} catch (error) {
		console.error(error);
	}
}

export { createBid };
