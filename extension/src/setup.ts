function setup() {
	const items = document.querySelectorAll('.PathTreePanel-TreeItemLabel');

	chrome.runtime.sendMessage({ action: 'updateNumberOfNodes', data: { numberOfNodes: items.length - 1 } });
}

console.log('Running Popup Setup');
setup();
