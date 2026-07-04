document.getElementById('runBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.id) {
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['scripts.js']
    });
  } catch (error) {
    console.error('Failed to run script from popup:', error);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'extractedData') {
    console.log('Received data in popup:', message.data);
    document.body.innerHTML = `
      <h3>Extracted Data</h3>
      <pre>${JSON.stringify(message.data, null, 2)}</pre>
    `;
  }
});
