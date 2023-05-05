import { initializeClock, updateTime } from "./clock.js";
import { baseUrl } from "./api.js";
import { routeWhiskyListings, routeProfile } from "./api.js";

const statusBarContainer = document.querySelector(".status-container");
const statusBarUsername = document.querySelector(".user__name");
const statusBarAvatar = document.querySelector(".user__avatar-img");
const statusBarCredits = document.querySelector("#available-credits");
const ongoingAuctionsCount = document.querySelector("#ongoing-auctions");
const myAuctionsCount = document.querySelector("#list-my-auctions");

//Shows status bar content if user is logged in
export function statusBarContent() {
	const user = JSON.parse(localStorage.getItem("user"));
	if (user) {
		statusBarContainer.style.display = "flex";
		const userName = user.name;
		const userAvatar = user.avatar;
		const userCredits = user.credits;

		statusBarUsername.innerHTML = userName;
		statusBarAvatar.src = userAvatar;
		statusBarUsername.alt = userName;
		statusBarCredits.innerHTML = userCredits;
	}
	fetchAuctionCounts(user);
}

//Update ongoing auctions count
function updateAuctionsCount(ongoingCount, myCount) {
	if (ongoingAuctionsCount) {
		ongoingAuctionsCount.textContent = ongoingCount;
	}
	if (myAuctionsCount) {
		myAuctionsCount.textContent = myCount;
	}
}

//Fetch auction counts
async function fetchAuctionCounts(user) {
	try {
		const url = `${baseUrl}${routeWhiskyListings}`;
		const myListingUrl = `${baseUrl}${routeProfile}${user.name}/listings`;
		const headers = user.accessToken
			? { Authorization: `Bearer ${user.accessToken}` }
			: {};

		const allListingsResponse = await fetch(url, { headers });
		const allListingsData = await allListingsResponse.json();
		const myListingsResponse = await fetch(myListingUrl, { headers });
		const myListingsData = await myListingsResponse.json();

		const whiskyListings = allListingsData.filter((listing) => {
			return listing.tags.includes("whisky");
		});

		const ongoingAuctions = whiskyListings.filter(
			(listing) => new Date(listing.endsAt) > new Date()
		).length;

		const myAuctions = myListingsData.filter(
			(listing) =>
				listing.tags.includes("whisky") && new Date(listing.endsAt) > new Date()
		).length;

		updateAuctionsCount(ongoingAuctions, myAuctions);
	} catch (error) {
		console.error(error);
	}
}

initializeClock();
updateTime();
