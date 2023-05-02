export function updateTime() {
	const now = new Date();
	const clock = document.getElementById("clock");
	clock.innerHTML = now.toLocaleString();
}

export function initializeClock() {
	updateTime();
	setInterval(updateTime, 1000);
}
export function formatTimeRemaining(timeDifference) {
	const hours = Math.floor(timeDifference / (1000 * 60 * 60));
	const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

	return `${hours}h ${minutes}m ${seconds}s`;
}

export function startCountdown(endTime, countdownElement) {
	const updateCountdown = () => {
		const now = new Date();
		const timeDifference = endTime - now;

		if (timeDifference <= 0) {
			clearInterval(intervalId);
			countdownElement.innerText = "Auction ended";
		} else {
			countdownElement.innerText = formatTimeRemaining(timeDifference);
		}
	};

	const intervalId = setInterval(updateCountdown, 1000);
	updateCountdown();
}
