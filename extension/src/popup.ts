/// <reference types="chrome"/>
document.getElementById('run')!.addEventListener('click', async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	chrome.scripting.executeScript({
		target: { tabId: tab.id! },
		files: ['content.js'],
	});
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === 'updatePopup') {
		const output = document.getElementById('output');
		if (output) {
			output.innerText = message.data;
		}
	}
});
