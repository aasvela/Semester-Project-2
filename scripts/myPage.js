import { initializeClock, startCountdown } from "./components/clock.js";
import {
	showUserProfile,
	addAvatarUpdateListener,
	toggleLinks,
	logout,
} from "./components/handleUser.js";
import { baseUrl, routeProfile } from "./components/api.js";
import { statusBarContent } from "./components/statusbar.js";

initializeClock();
addAvatarUpdateListener();
toggleLinks();
logout();
statusBarContent();
showUserProfile();

const toggleOldListingsBtn = document.querySelector("#toggle-old-listings-btn");
const listingsList = document.querySelector(".listing-list ul");
let showEndedListings = false;
const user = JSON.parse(localStorage.getItem("user"));
const myListingUrl = `${baseUrl}${routeProfile}${user.name}/listings`;

toggleOldListingsBtn.addEventListener("click", (event) => {
	event.preventDefault();
	showEndedListings = !showEndedListings;
	renderMyListings();
});

//Gets the user's listings with edit and delete buttons
async function renderMyListings() {
	clearListings();
	try {
		const response = await fetch(myListingUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.accessToken}`,
			},
		});
		if (response.ok) {
			const myListings = await response.json();
			myListings.forEach((listing) => {
				const now = new Date();
				const endsAt = new Date(listing.endsAt);
				if (!showEndedListings && endsAt < now) {
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
				<li class="list-group-item" id="time-left"><p>Auction ends in: <span class="countdown"></span></p></li>
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
									<td>${listing.tags[4]}</td>
								</tr>
							</table>
						</div>
					</li>
        <div class="list-item-card__price">
          <p>${listing.endsAt}</p>

        </div>
        <div class="list-item-card__button">
          <button class="edit-listing-btn btn btn-secondary" data-listing-id="${listing.id}">Edit</button>
          <button class="delete-listing-btn btn btn-danger" data-listing-id="${listing.id}">Delete</button>
        </div>

								<div class="list-item-card__form" style="display: none;">
										  	<div class="form-group">
									        <label for="product-input-${listing.id}">Product</label>
        <input
          type="text"
          class="form-control"
          id="product-input-${listing.id}"
        />
									</div>
									<div class="form-group">
										<label for="">Age</label>
										<input type="number" class="form-control" id="age-input-${listing.id}" />
									</div>
									<div class="form-group">
										<label for="select-volume">Volume</label>
										<select class="form-control" id="select-volume-${listing.id}">
											<option disabled selected>Select volume</option>
											<option>500ml</option>
											<option>700ml</option>
											<option>1000ml</option>
											<option>Other</option>
										</select>
									</div>
									<div class="form-group">
										<label for="select-alcohol-volume">Alcohol volume</label>
										<select class="form-control" id="select-alcohol-volume-${listing.id}">
											<option disabled selected>Select alcohol volume</option>
											<option>40%</option>
											<option>50%</option>
											<option>60%</option>
											<option>Other</option>
										</select>
									</div>
									<div class="form-group">
										<label for="select-country">Country</label>
										<select class="form-control" id="select-country-${listing.id}">
											<option disabled selected>Select a country</option>
											<option>Scotland</option>
											<option>Ireland</option>
											<option>Japan</option>
											<option>Sweden</option>
											<option>Norway</option>
										</select>
									</div>
									<div class="form-group">
										<label for="upload-product-image"
											>Upload product image</label
										>
										<input
											type="url"
											id="upload-product-image--${listing.id}""
											name="product-image"
										/>
									</div>
									<div class="form-group">
										<label for="product-descripton-input-${listing.id}"
											>Example textarea</label
										>
										<textarea
											class="form-control"
											id="product-descripton-input--${listing.id}""
											rows="3"
										></textarea>
									</div>
<button
  type="submit"
  class="btn btn-primary"
  onclick="event.preventDefault(); updateListing('${listing.id}')"
>
  Update
</button>

      </div>
      </div>
    `;
				const editListingBtn = li.querySelector(".edit-listing-btn");
				editListingBtn.addEventListener("click", () => {
					showEditForm(listing.id);
				});
				const deleteListingBtn = li.querySelector(".delete-listing-btn");
				deleteListingBtn.addEventListener("click", () => {
					deleteListing(listing.id);
				});
				listingsList.appendChild(li);

				const countdownElement = li.querySelector(".countdown");
				startCountdown(endsAt, countdownElement);
			});
		} else {
			console.log("Something went wrong");
		}
	} catch (error) {
		console.log(error);
	}
}
renderMyListings();

function clearListings() {
	listingsList.innerHTML = "";
}

//Delete a listing
async function deleteListing(listingId) {
	try {
		const deleteUrl = `${baseUrl}/auction/listings/${listingId}`;

		const response = await fetch(deleteUrl, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${user.accessToken}`,
			},
		});

		if (response.ok) {
			alert("Listing deleted!");
			const li = listingsList.querySelector(`[data-listing-id="${listingId}"]`);
			if (li) li.remove();
		} else {
			alert("Failed to delete the listing");
		}
	} catch (error) {
		console.log(error);
		alert("Error deleting the listing");
	}
}
function showEditForm(listingId) {
	const listItem = document
		.querySelector(`[data-listing-id="${listingId}"]`)
		.closest(".list-group-item");
	const form = listItem.querySelector(".list-item-card__form");
	form.style.display = form.style.display === "none" ? "block" : "none";
}

//Edit a listing
window.updateListing = async function (listingId) {
	const listItem = document
		.querySelector(`[data-listing-id="${listingId}"]`)
		.closest(".list-group-item");
	const productInput = listItem.querySelector(`#product-input-${listingId}`);
	const ageInput = listItem.querySelector(`#age-input-${listingId}`);
	const volumeSelect = listItem.querySelector(`#select-volume-${listingId}`);
	const alcoholVolumeSelect = listItem.querySelector(
		`#select-alcohol-volume-${listingId}`
	);
	const countrySelect = listItem.querySelector(`#select-country-${listingId}`);
	const productImageInput = listItem.querySelector(
		`#upload-product-image--${listingId}`
	);
	const productDescriptionInput = listItem.querySelector(
		`#product-descripton-input--${listingId}`
	);

	const updatedListing = {
		title: productInput.value,
		tags: [
			countrySelect.value,
			volumeSelect.value,
			ageInput.value,
			alcoholVolumeSelect.value,
		],
		description: productDescriptionInput.value,

		media: [productImageInput.value],
	};

	try {
		const response = await fetch(`${baseUrl}/auction/listings/${listingId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.accessToken}`,
			},
			body: JSON.stringify(updatedListing),
		});

		if (response.ok) {
			console.log("Listing updated successfully");
			renderMyListings();
		} else {
			console.log("Something went wrong while updating the listing");
		}
	} catch (error) {
		console.log(error);
	}
};
