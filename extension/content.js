// Helper: wait for N ms
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runClickAndRead() {
	// Select all list items
	const items = document.querySelectorAll('div.PathTreePanel-TreeItemContent');

	for (const li of items) {
		li.click(); // simulate click
		await sleep(500); // wait for DOM to update

		// Example: read from some element after click
		const target = document.querySelector('#:r14:'); // adjust selector
		if (target) {
			console.log('Extracted text:', target.innerText);
		} else {
			console.log('No target element found');
		}
	}
}

console.log('Running');
runClickAndRead();
