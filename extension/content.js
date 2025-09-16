// Helper: wait for N ms
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runClickAndRead() {
	const items = document.querySelectorAll('.PathTreePanel-TreeItemLabel');

	// console.log(items.length);

	let first = true;
	for (let li of items) {
		if (first) {
			first = false;
			continue;
		}
		console.log(li);
		li.click(); 
		await sleep(500); 
		const target = document.querySelector('.MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputSizeSmall.css-17opruk'); 
		if (target) {
			console.log('Extracted text:', target.innerText);
		} else {
			console.log('No target element found');
		}
	}
}

console.log('Running');
runClickAndRead();
