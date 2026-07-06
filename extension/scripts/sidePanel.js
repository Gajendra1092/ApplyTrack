document.getElementById('runBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.id) {
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['scripts/scripts.js']
    });
  } catch (error) {
    console.error('Failed to run script from popup:', error);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'extractedData') {
    console.log(message);
    const values = message.data;
    document.getElementById("company").value = values.Company_name;
    document.getElementById("role").value = values.Role;
    document.getElementById("resume").value = values.Resume_name; 
  }
});

// Calling submit api
document.getElementById('saveForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    Company_name: document.getElementById('company').value,
    Role: document.getElementById('role').value,
    Resume_name: document.getElementById('resume').value,
  };
  
  try {
    const response = await fetch('http://127.0.0.1:8000/store-to-db', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => null);

    if (response.ok && result === true) {
      // Create and show success card for 2 seconds
      const cardDiv = document.createElement('div');
      cardDiv.style.cssText = `
        position: fixed;
        top: 25px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        background: rgba(0, 0, 0, 0.89);
        padding: 7px 15px;
        border-radius: 8px;
        border: none;
        color: white;
        text-align: center;
        width: fit-content;
        box-shadow: 0 1px 8px rgba(237, 237, 237, 0.2);
      `;
      cardDiv.innerHTML = '<h3 style="margin: 0; font-size: 16px; font-weight: 600;">Done!</h3>';
      
      document.body.insertBefore(cardDiv, document.body.firstChild);
      
      document.getElementById('saveForm').reset();
      // Remove after 2 seconds
      setTimeout(() => cardDiv.remove(), 2000);
      
      return;
    }
    
    throw new Error('Save failed');
  } catch (error) {
    console.error('Failed to save form:', error);
    document.body.innerHTML = '<div style="padding:8px;color:#b71c1c;">Something went wrong while saving.</div>';
  }
});
