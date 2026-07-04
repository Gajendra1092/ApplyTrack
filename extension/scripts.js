async function callAPI(cleaned_text) {
  try {
    const response = await fetch('http://127.0.0.1:8000/handle-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: cleaned_text
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.log('Error occurred:', err);
    return null;
  }
}

(async () => {
  const content = document.body.innerText;
  const cleaned = content.replace(/[^a-zA-Z0-9_.\s]/g, '');
  const response = await callAPI(cleaned);

  if (response) {
    chrome.runtime.sendMessage({
      type: 'extractedData',
      data: response
    });
  }
})();

