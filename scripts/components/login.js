import { baseUrl } from "./api.js";
import { routeLogin } from "./api.js";
import { toggleLinks } from "./handleUser.js";

toggleLinks();

document
	.querySelector("#login-form")
	.addEventListener("submit", async (event) => {
		event.preventDefault();
		const email = document.getElementById("loginEmail").value;
		const password = document.getElementById("password").value;

		const response = await fetch(baseUrl + routeLogin, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: email,
				password: password,
			}),
		});

		if (response.status === 200) {
			const data = await response.json();
			const user = {
				accessToken: data.accessToken,
				name: data.name,
				email: data.email,
				avatar: data.avatar,
				credits: data.credits,
			};
			localStorage.setItem("user", JSON.stringify(user));
			window.location.href = "my_page.html";
		} else {
			alert(
				"Error logging in, please check your email and password and try again"
			);
		}
	});
