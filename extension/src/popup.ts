let pathNodes: PathNode[] = [];
/// <reference types="chrome"/>
//

document.addEventListener(
	'DOMContentLoaded',
	async () => {
		console.log('Dom Content Loaded');

		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (message.action == 'nodes') {
				pathNodes = message.data.nodes;
				console.log('Got Path Node Positions');
				createOptionSelectors(pathNodes.length);
			} else {
				console.log('Unknown message.action: ' + message.action);
			}
		});

		const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

		if (!tab?.id) return;

		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			files: ['setup.js'],
		});
	},
	{ once: true },
);

document.getElementById('run')!.addEventListener('click', async () => {
	let data: NodeData[] = [];
	data.push({
		speed: undefined,
		direction: undefined,
		pos: pathNodes[0],
	});
	for (let i = 1; i <= pathNodes.length - 1; i++) {
		const from = i;
		const to = i + 1;
		const idBase = `node-${from}-to-${to}`;
		const speedSelect = document.getElementById(idBase + '-speed')! as HTMLSelectElement;
		const dirSelect = document.getElementById(idBase + '-dir')! as HTMLSelectElement;

		data.push({
			speed: speedSelect.value,
			direction: dirSelect.value,
			pos: pathNodes[i],
		});
	}

	let code = createCode(data);
	await copyToClipboard(code);
});

async function copyToClipboard(text: string) {
	let codeText = document.querySelector('#codeText');
	if (!codeText) {
		codeText = document.createElement('textarea');
		codeText.id = 'codeText';
		document.body.appendChild(codeText);
	}
	const textarea = codeText as HTMLTextAreaElement;

	textarea.value = text;
	textarea.select();
	document.execCommand('copy');

	console.log('Copied to Clipboard');
}

function createCode(pathNodes: NodeData[]): string {
	let code: string[] = [];

	code.push(
		`chassis.odom_xyt_set(${pathNodes[0].pos.x}_in, ${pathNodes[0].pos.y}_in, ${pathNodes[0].pos.heading}_deg);`,
		'',
		`chassis.pid_odom_set(`,
		`\t{`,
	);

	for (let i = 1; i < pathNodes.length; i++) {
		code.push(
			`\t\t{{${pathNodes[i].pos.x}_in, ${pathNodes[i].pos.y}_in, ${pathNodes[i].pos.heading}_deg}, ${pathNodes[i].direction}, ${pathNodes[i].speed}},`,
		);
	}

	code.push(`\t},`, `\ttrue);`, ``, `int currentIndex = 0;`);

	for (let i = 1; i < pathNodes.length; i++) {
		code.push(`chassis.pid_wait_until_index(${i});`);
	}
	code.push('chassis.pid_wait();');

	let finalCode = '\t' + code.join('\n\t');

	console.log('Created Code: \n' + finalCode);

	return finalCode;
}

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
