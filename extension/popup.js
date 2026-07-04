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
    const values = message.data.result
    document.getElementById("company").value = values.Company_name;
    document.getElementById("role").value = values.Role;
    document.getElementById("resume").value = values.Resume_name; 
  }
});
