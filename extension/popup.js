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
      const successHtml = `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 16px;
                min-width: 220px;
                background: #f7fdf8;
              }
              .card {
                border: 1px solid #2e7d32;
                border-radius: 8px;
                padding: 12px;
                color: #1b5e20;
              }
            </style>
          </head>
          <body>
            <div class="card">
              <h3>Saved successfully</h3>
              <p>Your application was stored.</p>
            </div>
          </body>
        </html>`;

      document.open();
      document.write(successHtml);
      document.close();
      return;
    }

    throw new Error('Save failed');
  } catch (error) {
    console.error('Failed to save form:', error);
    document.body.innerHTML = '<div style="padding:8px;color:#b71c1c;">Something went wrong while saving.</div>';
  }
});
