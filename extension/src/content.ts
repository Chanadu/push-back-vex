// Helper: wait for N ms
function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function copyToClipboard(text: string) {
	const textarea = document.createElement('textarea');
	textarea.value = text;
	document.body.appendChild(textarea);
	textarea.select();
	document.execCommand('copy');
	document.body.removeChild(textarea);

	console.log('Copied to Clipboard');
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

type PathNode = {
	x: number;
	y: number;
	heading: number;
};

/*
 *{
	chassis.odom_xyt_set(-61_in, -24.53_in, 270_deg);

	chassis.pid_odom_set(
		{
			{{-26.66_in, -25.665_in, 225_deg}, rev, DRIVE_SPEED},
			{{-24.868_in, -43.17_in, 164_deg}, fwd, SLOW_DRIVE_SPEED},
			{{-17.414_in, -29.22_in, 0_deg}, fwd, DRIVE_SPEED},
			{{-14.723_in, -11.338_in, 0_deg}, fwd, DRIVE_SPEED},
		},
		true);

	int currentIndex = 0;

	chassis.pid_wait_until_index(currentIndex++);  // 0
	chassis.pid_wait_until_index(currentIndex++);  // 1
	chassis.pid_wait_until_index(currentIndex++);  // 2
	chassis.pid_wait_until_index(currentIndex++);  // 3

	chassis.pid_wait();



}
 */
function createCode(pathNodes: PathNode[]): string {
	let code: string[] = [];

	code.push(
		`chassis.odom_xyt_set(${pathNodes[0].x}_in, ${pathNodes[0].y}_in, ${pathNodes[0].heading}_deg);`,
		'',
		`chassis.pid_odom_set(`,
		`\t{`,
	);

	for (let i = 1; i < pathNodes.length; i++) {
		code.push(`\t\t{{${pathNodes[i].x}_in, ${pathNodes[i].y}_in, ${pathNodes[i].heading}_deg}, fwd, DRIVE_SPEED},`);
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

async function runClickAndRead() {
	const items = document.querySelectorAll('.PathTreePanel-TreeItemLabel');

	// console.log(items.length);

	let first = true;

	let pathNodes = [] as PathNode[];

	for (const li of items) {
		const element = li as HTMLElement;
		if (first) {
			first = false;
			continue;
		}
		element.click();
		await sleep(200);
		const x = +getInputValueByLabelText('X')!;
		const y = +getInputValueByLabelText('Y')!;
		const heading = +getInputValueByLabelText('Heading')!;

		// console.log('X: ' + x + ', Y: ' + y + ', Heading: ' + heading);
		pathNodes.push({ x: x, y: y, heading: heading });
	}

	let code = createCode(pathNodes);
	await copyToClipboard(code);
}

runClickAndRead();
