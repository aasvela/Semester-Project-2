import { toggleLinks, logout } from "./components/handleUser.js";
import { createListing } from "./auction/handleItem.js";
import { statusBarContent } from "./components/statusbar.js";

toggleLinks();
logout();

if (JSON.parse(localStorage.getItem("user"))) {
	statusBarContent();
}
const createListingBtn = document.querySelector("#createListingBtn");
createListingBtn.addEventListener("click", (event) => {
	event.preventDefault();
	console.log("createListingBtn");
	createListing();
});
