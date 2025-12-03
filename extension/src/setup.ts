function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function getInputValueByLabelText(labelText: string): string | null {
	const labels = document.querySelectorAll('label');

	for (const label of labels) {
		if (label.innerText.trim() === labelText) {
			if (label.htmlFor) {
				const input = document.getElementById(label.htmlFor) as HTMLInputElement;
				if (input) return input.value;
			}

			const input = label.querySelector('input') as HTMLInputElement;
			if (input) return input.value;
		}
	}
	console.log('Could not find input with label: ' + labelText);
	return null;
}

function setInputValueByLabelText(labelText: string, value: string | number): boolean {
	const labels = document.querySelectorAll('label');

	for (const label of labels) {
		if (label.innerText.trim() === labelText) {
			let input: HTMLInputElement | null = null;

			if (label.htmlFor) {
				input = document.getElementById(label.htmlFor) as HTMLInputElement;
			}

			if (!input) {
				input = label.querySelector('input') as HTMLInputElement;
			}

			if (input) {
				// Set the value
				input.value = String(value);

				// Try multiple event types to ensure the website updates
				const events = ['input', 'change', 'blur', 'keyup'];
				events.forEach((eventType) => {
					input!.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
				});

				// Also try React's synthetic events if the site uses React
				const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
					window.HTMLInputElement.prototype,
					'value',
				)?.set;
				if (nativeInputValueSetter) {
					nativeInputValueSetter.call(input, String(value));
					const event = new Event('input', { bubbles: true });
					input.dispatchEvent(event);
				}

				// Focus and blur to trigger any focus-based handlers
				input.focus();
				input.blur();

				return true;
			}
		}
	}
	console.log('Could not find input with label: ' + labelText);
	return false;
}

// Wait for input values to update after clicking, with timeout
async function waitForInputsUpdate(timeout: number = 500): Promise<boolean> {
	const startTime = Date.now();
	const checkInterval = 10; // Check every 10ms

	while (Date.now() - startTime < timeout) {
		const x = getInputValueByLabelText('X');
		const y = getInputValueByLabelText('Y');
		const heading = getInputValueByLabelText('Heading');

		// If we have valid values (not null and not empty), inputs are ready
		if (x !== null && y !== null && heading !== null && x !== '' && y !== '' && heading !== '') {
			return true;
		}

		await sleep(checkInterval);
	}
	return false;
}

async function runClickAndRead(): Promise<PathNode[]> {
	const items = document.querySelectorAll('.PathTreePanel-TreeItemLabel');
	console.log(`Found ${items.length} items`);

	let first = true;

	let pathNodes = [] as PathNode[];

	for (let i = 0; i < items.length; i++) {
		const element = items[i] as HTMLElement;
		if (first) {
			first = false;
			continue;
		}
		element.click();

		// Wait for inputs to update (max 200ms, but usually much faster)
		await waitForInputsUpdate(200);

		const x = +getInputValueByLabelText('X')!;
		const y = +getInputValueByLabelText('Y')!;
		const heading = +getInputValueByLabelText('Heading')!;

		console.log(`Path Node ${i}: (${x}, ${y}, ${heading}) `);
		pathNodes.push({ x: x, y: y, heading: heading });
	}
	return pathNodes;
}

async function loadNodesToWebsite(nodes: PathNode[]) {
	const items = document.querySelectorAll('.PathTreePanel-TreeItemLabel');
	console.log(`Found ${items.length} items, loading ${nodes.length} nodes`);

	if (items.length < nodes.length + 1) {
		console.error('Not enough path nodes in website to load all saved nodes');
		throw new Error('Not enough path nodes in website');
	}

	let first = true;
	let nodeIndex = 0;

	for (let i = 0; i < items.length && nodeIndex < nodes.length; i++) {
		const element = items[i] as HTMLElement;
		if (first) {
			first = false;
			continue;
		}

		const node = nodes[nodeIndex];
		console.log(`Loading node ${nodeIndex} at index ${i}`);
		element.click();

		// Wait for inputs to be ready
		await waitForInputsUpdate(300);

		// Set the values with a small delay between each
		const xSet = setInputValueByLabelText('X', node.x);
		await sleep(50);
		const ySet = setInputValueByLabelText('Y', node.y);
		await sleep(50);
		const headingSet = setInputValueByLabelText('Heading', node.heading);
		await sleep(100); // Wait a bit after setting all values

		if (!xSet || !ySet || !headingSet) {
			console.warn(`Failed to set some values for node ${nodeIndex}`);
		}

		console.log(`Loaded Path Node ${nodeIndex}: (${node.x}, ${node.y}, ${node.heading})`);
		nodeIndex++;
	}

	console.log('Finished loading nodes to website');
}

async function setup() {
	let nodes = await runClickAndRead();

	chrome.runtime.sendMessage({ action: 'nodes', data: { nodes: nodes } });
}

// Set up message listener first, before auto-running setup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log('Received message:', message.action);
	if (message.action === 'loadNodes') {
		const nodes = message.data.nodes as PathNode[];
		console.log('Loading nodes to website:', nodes);
		loadNodesToWebsite(nodes)
			.then(() => {
				console.log('Successfully loaded all nodes');
				sendResponse({ success: true });
			})
			.catch((error) => {
				console.error('Error loading nodes:', error);
				sendResponse({ success: false, error: error.message });
			});
		return true; // Keep the message channel open for async response
	}
	return false;
});

// Only auto-run setup if we're not loading nodes
// Check if we should run setup by looking for a flag
if (!window.location.href.includes('skipAutoSetup')) {
	console.log('Running Popup Setup');
	(async function () {
		await setup();
	})();
}
