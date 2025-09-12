chrome.action.onClicked.addListener((tab) => {
  chrome.scripting
    .executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    })
    .then(() => {
      console.log("Content script injected!");
    })
    .catch((err) => console.error(err));
});
