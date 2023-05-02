import { baseUrl } from "../components/api.js";
import { routeWhiskyListings } from "../components/api.js";
import { createBid } from "./bids.js";
import { startCountdown } from "../components/clock.js";

const user = JSON.parse(localStorage.getItem("user"));
const authorization = user ? user.accessToken : null;
let url = `${baseUrl}${routeWhiskyListings}`;

//Filter
const listingsList = document.querySelector(".listing-list ul");
const filterCountryCheckboxes = document.querySelectorAll(
	".filter-list-country input[type='checkbox']"
);
const myAuctionsCheckbox = document.querySelector(
	".filter-list__item__my-auctions input[type='checkbox']"
);
const showExpiredCheckbox = document.querySelector(
	".filter-list__item__exipred input[type='checkbox']"
);
filterCountryCheckboxes.forEach((checkbox) => {
	checkbox.addEventListener("change", handleFilterChange);
});
myAuctionsCheckbox.addEventListener("change", handleFilterChange);
showExpiredCheckbox.addEventListener("change", handleFilterChange);

function handleFilterChange() {
	const selectedCountries = Array.from(filterCountryCheckboxes)
		.filter((checkbox) => checkbox.checked)
		.map((checkbox) => checkbox.parentElement.textContent.trim());

	const myAuctions = myAuctionsCheckbox.checked;
	const showExpired = showExpiredCheckbox.checked;

	getListings(url, authorization, selectedCountries, myAuctions, showExpired);
}

//Checks if user is logged in and disables bid button if not
if (!user) {
	const bidInputs = document.querySelectorAll("#bid-input, .bid-button");
	bidInputs.forEach((input) => {
		input.disabled = true;
	});
}
//Checks if listingList exists and gets listings
if (listingsList) {
	getListings(url, authorization);
}

async function getListings(
	url,
	authorization = null,
	selectedCountries = [],
	myAuctions = false,
	showExpired = false
) {
	try {
		const headers = authorization
			? { Authorization: `Bearer ${authorization}` }
			: { Authorization: null };
		const response = await fetch(url, { headers });
		const data = await response.json();
		const whiskyListings = data.filter((listing) => {
			if (
				selectedCountries.length > 0 &&
				!selectedCountries.includes(listing.tags[5])
			) {
				return false;
			}
			if (myAuctions && (!user || listing.sellerId !== user.id)) {
				return false;
			}

			const now = new Date();
			const endsAt = new Date(listing.endsAt);
			if (showExpired) {
				return listing.tags.includes("whisky") && endsAt < now;
			} else {
				return listing.tags.includes("whisky") && endsAt > now;
			}
		});
		const ongoingAuctions = whiskyListings.filter(
			(listing) => new Date(listing.endsAt) > new Date()
		).length;
		document.querySelector(".listing-list ul").innerHTML = "";

		whiskyListings.forEach((listing) => {
			const now = new Date();
			const endsAt = new Date(listing.endsAt);
			if (!showExpired && endsAt < now) {
				return;
			}
			const li = document.createElement("li");
			li.classList.add("list-group-item");
			li.innerHTML = `
			<div class="card"	 	>
				<img class="card-img-top" src="${listing.media[0]}" alt="${listing.title}">
				<div class="card-body">
					<h5 class="card-title">${listing.title} - ${listing.tags[1]} </h5>
					<p class="card-text">${listing.description}</p>
				</div>
				<ul class="list-group list-group-flush">
					<li class="list-group-item">
						<div class="list-item-card__details-table">
							<table>
								<tr>
									<th>Age</th>
									<td>${listing.tags[2]} years</td>
								</tr>
								<tr>
									<th>Origin</th>
									<td>${listing.tags[5]}</td>
								</tr>
								<tr>
									<th>Volume</th>
									<td>${listing.tags[3]}</td>
								</tr>
								<tr>
									<th>ABV</th>
</table>
						</div>	
					</li>
					  <li class="list-group-item"> <p>Auction ends in: <span class="countdown"></span></p></li>
					<li class="list-group-item">Bids: ${listing._count.bids}</li>
				</ul>
							<button type="button"
						data-bs-toggle="collapse"
						data-bs-target="#collapsBidHistory"
						data-listing-id="${listing.id}"
						aria-expanded="false"
						aria-controls="collapsBidHistory"
						>
						See bid history
					</button>
				<ul class="collapse list-group list-group-flush" id="collapseBidHistory">
				</ul>

				<div class="card-body">
				

					<div class="collapse collapseBidList" id="collapsBidHistory">
						</div>

				<div class="card-body">
					<div class="bid-input">
		 				<input type="text" id="bid-input" placeholder="Enter Bid" />
		 				<button class="bid-button" data-listing-id="${listing.id}">Place Bid</button>
					</div  >
				</div>
			</div>`;

			const button = li.querySelector(".btn-primary");
			const detailsContainer = li.querySelector(".details-container");

			listingsList.appendChild(li);
			listingsList.appendChild(li);

			const bidButton = li.querySelector(".bid-button");
			bidButton.addEventListener("click", async () => {
				console.log("clicked");
				const bidInput = bidButton.parentElement.querySelector("#bid-input");
				const amount = parseFloat(bidInput.value);
				const listingId = bidButton.dataset.listingId;
				await createBid(listingId, amount);
			});
			const countdownElement = li.querySelector(".countdown");
			startCountdown(endsAt, countdownElement);
			console.log(listing);
		});
	} catch (error) {
		console.error(error);
	}
}
