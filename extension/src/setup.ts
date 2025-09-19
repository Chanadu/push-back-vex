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
		await sleep(200);
		const x = +getInputValueByLabelText('X')!;
		const y = +getInputValueByLabelText('Y')!;
		const heading = +getInputValueByLabelText('Heading')!;

		console.log(`Path Node ${i}: (${x}, ${y}, ${heading}) `);
		pathNodes.push({ x: x, y: y, heading: heading });
	}
	return pathNodes;
}

async function setup() {
	let nodes = await runClickAndRead();

	chrome.runtime.sendMessage({ action: 'nodes', data: { nodes: nodes } });
}

console.log('Running Popup Setup');
(async function () {
	await setup();
})();
