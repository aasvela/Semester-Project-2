import { baseUrl } from "./api.js";
const logOutBtn = document.getElementById("logout-btn");
const user = JSON.parse(localStorage.getItem("user"));
const userProfileUsername = document.querySelector(".user-info-username");
const userProfileEmail = document.querySelector(".user-info-email");
const userProfileAvatar = document.querySelector(".user-profile__avatar img");
const userProfileCredits = document.querySelector("#available-credits");
const infoBar = document.querySelector(".info-bar");

export function toggleLinks() {
	if (user) {
		document.querySelector(".register-link").style.display = "none";
		document.querySelector(".login-link").style.display = "none";
		document.querySelector(".my-page-link").style.display = "flex";
		document.querySelector(".logout-btn").style.display = "flex";
	}
}

export function showUserProfile() {
	const userName = user.name;
	const userEmail = user.email;
	const userAvatar = user.avatar;
	const userCredits = user.credits;
	if (user) {
		userProfileUsername.innerHTML = userName;
		userProfileEmail.innerHTML = userEmail;
		userProfileAvatar.src = userAvatar;
		userProfileAvatar.alt = userName;
		userProfileCredits.innerHTML = userCredits;
	}
}

export function logout() {
	logOutBtn.addEventListener("click", () => {
		localStorage.removeItem("user");
		window.location.href = "index.html";
	});
}

async function updateAvatar(newAvatarUrl) {
	try {
		const response = await fetch(
			`${baseUrl}/auction/profiles/${user.name}/media`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.accessToken}`,
				},
				body: JSON.stringify({
					avatar: newAvatarUrl,
				}),
			}
		);

		if (!response.ok) {
			throw new Error("Failed to update avatar.");
		}

		const data = await response.json();
		user.avatar = newAvatarUrl;
		localStorage.setItem("user", JSON.stringify(user));
		userProfileAvatar.src = newAvatarUrl;
	} catch (error) {
		console.error(error);
	}
}

export function addAvatarUpdateListener() {
	const form = document.querySelector("#new-avatar-form");

	form.addEventListener("submit", (event) => {
		event.preventDefault();
		const newAvatarUrl = document.querySelector("#new-avatar-input").value;

		updateAvatar(newAvatarUrl);
	});
}
