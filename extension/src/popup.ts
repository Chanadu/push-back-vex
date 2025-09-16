let numOfNodes = -1;
/// <reference types="chrome"/>
//

type NodeData = {
	speed: string;
	direction: string;
};

document.getElementById('run')!.addEventListener('click', async () => {
	let data: NodeData[] = [];
	for (let i = 1; i <= numOfNodes - 1; i++) {
		const from = i;
		const to = i + 1;
		const idBase = `node-${from}-to-${to}`;
		const speedSelect = document.getElementById(idBase + '-speed')! as HTMLSelectElement;
		const dirSelect = document.getElementById(idBase + '-dir')! as HTMLSelectElement;

		data.push({
			speed: speedSelect.value,
			direction: dirSelect.value,
		});
	}

	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.tabs.sendMessage(tab.id!, {
		action: 'data',
		data: {
			fullScript: false,
			nodeDataList: data,
		},
	});
});

document.addEventListener('DOMContentLoaded', async () => {
	const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

	if (!tab?.id) return;

	chrome.scripting.executeScript({
		target: { tabId: tab.id! },
		files: ['content.js'],
	});
});

document.addEventListener('DOMContentLoaded', async () => {
	const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

	if (!tab?.id) return;

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		files: ['setup.js'],
	});
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action == 'updateNumberOfNodes') {
		numOfNodes = message.data.numberOfNodes;
		createOptionSelectors(+message.data.numberOfNodes);
	} else {
		console.log('Unknown message.action: ' + message.action);
	}
});

function createOptionSelectors(n: number) {
	const out = document.getElementById('output');
	if (!out) return;

	// Clear existing children
	out.innerHTML = '';

	if (n === null) {
		const msg = document.createElement('div');
		msg.textContent = 'Number of nodes: unknown';
		out.appendChild(msg);
		return;
	}

	// Need at least 2 nodes to show a transition NodeX -> NodeY
	if (n <= 1) {
		const msg = document.createElement('div');
		msg.textContent = 'No node transitions available';
		out.appendChild(msg);
		return;
	}

	const SPEED_OPTIONS = ['DRIVE_SPEED', 'SLOW_DRIVE_SPEED', 'TURN_SPEED'];
	// Create controls for each transition: label, direction selector (fwd/rev), speed selector (3 options)
	// Transitions are Node1 -> Node2, Node2 -> Node3, ..., Node(n-1) -> Noden
	for (let i = 1; i <= n - 1; i++) {
		const from = i;
		const to = i + 1;
		const idBase = `node-${from}-to-${to}`;

		const wrapper = document.createElement('div');
		wrapper.className = 'node-item';
		wrapper.dataset.index = String(i);

		// Label showing "NodeX -> NodeY"
		const label = document.createElement('div');
		label.className = 'node-label';
		label.textContent = `Node${from} -> Node${to}`;

		// Direction selector (fwd / rev)
		const dirLabel = document.createElement('label');
		dirLabel.htmlFor = `${idBase}-dir`;
		dirLabel.textContent = 'Direction: ';
		dirLabel.className = 'node-dir-label';

		const dirSelect = document.createElement('select');
		dirSelect.id = `${idBase}-dir`;
		dirSelect.name = `${idBase}-dir`;
		dirSelect.className = 'node-dir-select';

		const optFwd = document.createElement('option');
		optFwd.value = 'fwd';
		optFwd.textContent = 'fwd';
		const optRev = document.createElement('option');
		optRev.value = 'rev';
		optRev.textContent = 'rev';
		dirSelect.appendChild(optFwd);
		dirSelect.appendChild(optRev);
		dirSelect.value = 'fwd';

		// Speed selector (3 options)
		const speedLabel = document.createElement('label');
		speedLabel.htmlFor = `${idBase}-speed`;
		speedLabel.textContent = 'Speed: ';
		speedLabel.className = 'node-speed-label';

		const speedSelect = document.createElement('select');
		speedSelect.id = `${idBase}-speed`;
		speedSelect.name = `${idBase}-speed`;
		speedSelect.className = 'node-speed-select';

		for (const s of SPEED_OPTIONS) {
			const opt = document.createElement('option');
			opt.value = s;
			opt.textContent = s;
			speedSelect.appendChild(opt);
		}
		speedSelect.value = SPEED_OPTIONS[0];

		// Arrange elements inside wrapper
		const left = document.createElement('div');
		left.className = 'node-left';
		left.appendChild(label);

		const middle = document.createElement('div');
		middle.className = 'node-middle';
		middle.appendChild(dirLabel);
		middle.appendChild(dirSelect);

		const right = document.createElement('div');
		right.className = 'node-right';
		right.appendChild(speedLabel);
		right.appendChild(speedSelect);

		wrapper.appendChild(left);
		wrapper.appendChild(middle);
		wrapper.appendChild(right);

		out.appendChild(wrapper);
	}
}
