import { baseUrl } from "./api.js";
import { routeRegister } from "./api.js";
import { toggleLinks } from "./handleUser.js";

toggleLinks();

document.querySelector("form").addEventListener("submit", async (event) => {
	event.preventDefault();
	const new_username = document.getElementById("new_username").value;
	const new_email = document.getElementById("new_email").value;
	const new_password = document.getElementById("new_password").value;
	const new_avatar = document.getElementById("new_avatar").value;

	if (!new_username.match(/^[a-zA-Z0-9_]+$/)) {
		alert(
			"Username must not contain punctuation symbols apart from underscore (_)"
		);
		return;
	}

	if (!new_email.match(/^[a-zA-Z0-9]+@(stud\.)?noroff\.no$/)) {
		alert("Email must be a valid stud.noroff.no or noroff.no email address");
		return;
	}

	if (new_password.length < 8) {
		alert("Password must be at least 8 characters");
		console.log("Password must be at least 8 characters");
		return;
	}

	const response = await fetch(baseUrl + routeRegister, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			name: new_username,
			email: new_email,
			password: new_password,
			avatar: new_avatar,
		}),
	});

	if (response.status === 201) {
		const data = await response.json();
		const accessToken = data.access_token;
		localStorage.setItem("accessToken", accessToken);
		window.location.href = "login.html";
	} else {
		alert("Error registering user, please try again");
	}
});
