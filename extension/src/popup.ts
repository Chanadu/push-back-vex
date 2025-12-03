let pathNodes: PathNode[] = [];
/// <reference types="chrome"/>
//

interface SavedData {
	pathNodes: PathNode[];
	speeds: { [key: string]: string };
	directions: { [key: string]: string };
}

interface Config {
	drivetrainName: string;
	defaultSpeed: string;
	defaultDirection: string;
	functionName: string;
}

const DEFAULT_CONFIG: Config = {
	drivetrainName: 'drivetrain',
	defaultSpeed: 'DRIVE_SPEED',
	defaultDirection: 'fwd',
	functionName: 'auton',
};

let currentConfig: Config = { ...DEFAULT_CONFIG };

async function saveConfig() {
	await chrome.storage.local.set({ config: currentConfig });
	console.log('Config saved');
}

async function loadConfig(): Promise<Config> {
	const result = await chrome.storage.local.get('config');
	if (result.config) {
		return result.config as Config;
	}
	return { ...DEFAULT_CONFIG };
}

function updateConfigFromUI() {
	const drivetrainInput = document.getElementById('drivetrainName') as HTMLInputElement;
	const defaultSpeedSelect = document.getElementById('defaultSpeed') as HTMLSelectElement;
	const defaultDirectionSelect = document.getElementById('defaultDirection') as HTMLSelectElement;
	const functionNameInput = document.getElementById('functionName') as HTMLInputElement;

	if (drivetrainInput) currentConfig.drivetrainName = drivetrainInput.value || 'drivetrain';
	if (defaultSpeedSelect) currentConfig.defaultSpeed = defaultSpeedSelect.value;
	if (defaultDirectionSelect) currentConfig.defaultDirection = defaultDirectionSelect.value;
	if (functionNameInput) currentConfig.functionName = functionNameInput.value || 'auton';

	saveConfig();
	updateCodeDisplay();
}

function loadConfigToUI(config: Config) {
	const drivetrainInput = document.getElementById('drivetrainName') as HTMLInputElement;
	const defaultSpeedSelect = document.getElementById('defaultSpeed') as HTMLSelectElement;
	const defaultDirectionSelect = document.getElementById('defaultDirection') as HTMLSelectElement;
	const functionNameInput = document.getElementById('functionName') as HTMLInputElement;

	if (drivetrainInput) drivetrainInput.value = config.drivetrainName;
	if (defaultSpeedSelect) defaultSpeedSelect.value = config.defaultSpeed;
	if (defaultDirectionSelect) defaultDirectionSelect.value = config.defaultDirection;
	if (functionNameInput) functionNameInput.value = config.functionName || 'auton';
}

async function saveData() {
	const speeds: { [key: string]: string } = {};
	const directions: { [key: string]: string } = {};

	// Collect all speed and direction values
	for (let i = 1; i <= pathNodes.length - 1; i++) {
		const from = i;
		const to = i + 1;
		const idBase = `node-${from}-to-${to}`;
		const speedSelect = document.getElementById(idBase + '-speed') as HTMLSelectElement;
		const dirSelect = document.getElementById(idBase + '-dir') as HTMLSelectElement;

		if (speedSelect) speeds[idBase] = speedSelect.value;
		if (dirSelect) directions[idBase] = dirSelect.value;
	}

	const data: SavedData = {
		pathNodes: pathNodes,
		speeds: speeds,
		directions: directions,
	};

	await chrome.storage.local.set({ savedPathData: data });
	console.log('Data saved');
}

async function loadData(): Promise<SavedData | null> {
	const result = await chrome.storage.local.get('savedPathData');
	if (result.savedPathData) {
		return result.savedPathData as SavedData;
	}
	return null;
}

function restoreSelectors(savedData: SavedData) {
	// Restore speed and direction values
	for (let i = 1; i <= pathNodes.length - 1; i++) {
		const from = i;
		const to = i + 1;
		const idBase = `node-${from}-to-${to}`;
		const speedSelect = document.getElementById(idBase + '-speed') as HTMLSelectElement;
		const dirSelect = document.getElementById(idBase + '-dir') as HTMLSelectElement;

		if (speedSelect && savedData.speeds[idBase]) {
			speedSelect.value = savedData.speeds[idBase];
		}
		if (dirSelect && savedData.directions[idBase]) {
			dirSelect.value = savedData.directions[idBase];
		}
	}
}

document.addEventListener(
	'DOMContentLoaded',
	async () => {
		console.log('Dom Content Loaded');

		// Load config
		currentConfig = await loadConfig();
		loadConfigToUI(currentConfig);

		// Set up config change listeners
		const drivetrainInput = document.getElementById('drivetrainName') as HTMLInputElement;
		const defaultSpeedSelect = document.getElementById('defaultSpeed') as HTMLSelectElement;
		const defaultDirectionSelect = document.getElementById('defaultDirection') as HTMLSelectElement;
		const functionNameInput = document.getElementById('functionName') as HTMLInputElement;

		if (drivetrainInput) {
			drivetrainInput.addEventListener('input', updateConfigFromUI);
			drivetrainInput.addEventListener('change', updateConfigFromUI);
		}
		if (defaultSpeedSelect) {
			defaultSpeedSelect.addEventListener('change', updateConfigFromUI);
		}
		if (defaultDirectionSelect) {
			defaultDirectionSelect.addEventListener('change', updateConfigFromUI);
		}
		if (functionNameInput) {
			functionNameInput.addEventListener('input', updateConfigFromUI);
			functionNameInput.addEventListener('change', updateConfigFromUI);
		}

		// Try to load saved data
		const savedData = await loadData();
		if (savedData && savedData.pathNodes.length > 0) {
			pathNodes = savedData.pathNodes;
			console.log('Loaded saved path nodes');
			createOptionSelectors(pathNodes.length);
			// Restore selectors after a brief delay to ensure DOM is ready
			setTimeout(() => {
				restoreSelectors(savedData);
				updateCodeDisplay();
			}, 10);
		}

		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (message.action == 'nodes') {
				pathNodes = message.data.nodes;
				console.log('Got Path Node Positions');
				createOptionSelectors(pathNodes.length);
				// Try to restore saved speeds/directions if they exist
				loadData().then((savedData) => {
					if (savedData) {
						setTimeout(() => {
							restoreSelectors(savedData);
							updateCodeDisplay();
						}, 10);
					}
				});
				// Save path nodes
				saveData();
			} else {
				console.log('Unknown message.action: ' + message.action);
			}
		});

		const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

		if (!tab?.id) return;

		// Function to get path nodes
		async function getPathNodes() {
			const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

			if (!tab?.id) return;

			chrome.scripting.executeScript({
				target: { tabId: tab.id },
				files: ['setup.js'],
			});
		}

		// Add click handler for getting path nodes
		document.getElementById('getNodes')!.addEventListener('click', getPathNodes);

		// Automatically get path nodes only if there are no saved path nodes
		if (!savedData || !savedData.pathNodes || savedData.pathNodes.length === 0) {
			await getPathNodes();
		}

		// Add click handler for loading nodes to website
		document.getElementById('loadNodes')!.addEventListener('click', async () => {
			const savedData = await loadData();
			if (!savedData || !savedData.pathNodes || savedData.pathNodes.length === 0) {
				alert('No saved path nodes found. Please get path nodes first.');
				return;
			}

			const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
			if (!tab?.id) return;

			// First inject the setup script if not already injected
			await chrome.scripting.executeScript({
				target: { tabId: tab.id },
				files: ['setup.js'],
			});

			// Wait longer for the script to be ready and message listener to be set up
			await new Promise((resolve) => setTimeout(resolve, 300));

			// Send message to load nodes
			chrome.tabs.sendMessage(
				tab.id,
				{
					action: 'loadNodes',
					data: { nodes: savedData.pathNodes },
				},
				(response) => {
					if (chrome.runtime.lastError) {
						console.error('Error loading nodes:', chrome.runtime.lastError);
						alert(
							'Error loading nodes: ' +
								chrome.runtime.lastError.message +
								'\n\nMake sure you are on path.jerryio.com',
						);
					} else if (response && response.success) {
						console.log('Nodes loaded successfully');
						alert('Path nodes loaded to website successfully!');
					} else {
						console.error('Failed to load nodes:', response);
						alert('Failed to load nodes to website: ' + (response?.error || 'Unknown error'));
					}
				},
			);
		});

		// Add click handler for clearing storage
		document.getElementById('clearStorage')!.addEventListener('click', async () => {
			if (
				confirm('Are you sure you want to clear all saved data? This will remove all path nodes and settings.')
			) {
				await chrome.storage.local.clear();
				console.log('Storage cleared');

				// Reset state
				pathNodes = [];
				currentConfig = { ...DEFAULT_CONFIG };

				// Clear UI
				const output = document.getElementById('output');
				if (output) output.innerHTML = '';

				const codeDisplay = document.getElementById('codeDisplay');
				if (codeDisplay) codeDisplay.style.display = 'none';

				// Reset config UI
				loadConfigToUI(currentConfig);

				alert('Storage cleared successfully!');
			}
		});

		// Set up config toggle
		const configToggle = document.getElementById('configToggle');
		const configDiv = document.getElementById('config');

		if (configToggle && configDiv) {
			configToggle.addEventListener('click', () => {
				configDiv.classList.toggle('collapsed');
			});
		}
	},
	{ once: true },
);

document.getElementById('run')!.addEventListener('click', async () => {
	let code = getCurrentCode();
	await copyToClipboard(code);
});

function getCurrentCode(): string {
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

	return createCode(data);
}

function autoResizeTextarea(textarea: HTMLTextAreaElement) {
	// Reset height to auto to get the correct scrollHeight
	textarea.style.height = 'auto';
	// Set height to scrollHeight to fit all content, but respect max-height
	const scrollHeight = textarea.scrollHeight;
	const maxHeight = 600; // Match max-height from CSS
	textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';

	// Remove width calculation - let CSS handle it with 100% width
	textarea.style.width = '100%';
}

function updateCodeDisplay() {
	if (pathNodes.length === 0) return;

	const codeDisplay = document.getElementById('codeDisplay');
	const codeText = document.getElementById('codeText') as HTMLTextAreaElement;

	if (codeDisplay && codeText) {
		codeDisplay.style.display = 'block';
		codeText.value = getCurrentCode();
		// Auto-resize to fit all content
		autoResizeTextarea(codeText);
	}

	// Save data whenever code display is updated
	saveData();
}

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
	const chassisName = currentConfig.drivetrainName;
	const functionName = currentConfig.functionName || 'auton';

	code.push(
		`${chassisName}.odom_xyt_set(${pathNodes[0].pos.x}_in, ${pathNodes[0].pos.y}_in, ${pathNodes[0].pos.heading}_deg);`,
		'',
		`${chassisName}.pid_odom_set(`,
		`\t{`,
	);

	for (let i = 1; i < pathNodes.length; i++) {
		code.push(
			`\t\t{{${pathNodes[i].pos.x}_in, ${pathNodes[i].pos.y}_in, ${pathNodes[i].pos.heading}_deg}, ${pathNodes[i].direction}, ${pathNodes[i].speed}},`,
		);
	}

	code.push(`\t},`, `\ttrue);`, ``, `int currentIndex = 0;`);

	for (let i = 1; i < pathNodes.length; i++) {
		code.push(`${chassisName}.pid_wait_until_index(${i});`);
	}
	code.push(`${chassisName}.pid_wait();`);

	let bodyCode = '\t' + code.join('\n\t');

	// Wrap in C++ function
	let finalCode = `void ${functionName}() {\n${bodyCode}\n}`;

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
		dirSelect.addEventListener('change', () => {
			updateCodeDisplay();
			saveData();
		});

		const optFwd = document.createElement('option');
		optFwd.value = 'fwd';
		optFwd.textContent = 'fwd';
		const optRev = document.createElement('option');
		optRev.value = 'rev';
		optRev.textContent = 'rev';
		dirSelect.appendChild(optFwd);
		dirSelect.appendChild(optRev);
		dirSelect.value = currentConfig.defaultDirection; // Use config default

		// Speed selector (3 options)
		const speedLabel = document.createElement('label');
		speedLabel.htmlFor = `${idBase}-speed`;
		speedLabel.textContent = 'Speed: ';
		speedLabel.className = 'node-speed-label';

		const speedSelect = document.createElement('select');
		speedSelect.id = `${idBase}-speed`;
		speedSelect.name = `${idBase}-speed`;
		speedSelect.className = 'node-speed-select';
		speedSelect.addEventListener('change', () => {
			updateCodeDisplay();
			saveData();
		});

		for (const s of SPEED_OPTIONS) {
			const opt = document.createElement('option');
			opt.value = s;
			opt.textContent = s;
			speedSelect.appendChild(opt);
		}
		speedSelect.value = currentConfig.defaultSpeed; // Use config default

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

	// Initial code display after creating selectors
	updateCodeDisplay();
}
