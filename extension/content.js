// Helper: wait for N ms
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Copied to clipboard:", text);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
}

function getInputValueByLabelText(labelText) {
  const labels = document.querySelectorAll("label");

  for (const label of labels) {
    if (label.innerText.trim() === labelText) {
      if (label.htmlFor) {
        const input = document.getElementById(label.htmlFor);
        if (input) return input.value;
      }

      const input = label.querySelector("input, textarea, select");
      if (input) return input.value;
    }
  }
console.log("Could not find input with label: " + labelText)
  return null; 
}
async function runClickAndRead() {
	const items = document.querySelectorAll('.PathTreePanel-TreeItemLabel');

	// console.log(items.length);


	let first = true;
	for (const li of items) {
		if (first) {
			first = false;
			continue;
		}
		li.click(); 
		await sleep(300); 
		const x = getInputValueByLabelText("X")
		const y = getInputValueByLabelText("Y");
		const heading = getInputValueByLabelText("Heading");
		console.log("X: " + x + ", Y: " + y + ", Heading: " + heading);
	}
	
}

console.log('Running');
runClickAndRead();

