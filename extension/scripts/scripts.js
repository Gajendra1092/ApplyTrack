async function callAPI(content) {
  console.log("Hit CallAPI function")
  try {
    const response = await fetch('http://127.0.0.1:8000/handle-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: content
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
  const response = await callAPI(content);

  if (response) {
    chrome.runtime.sendMessage({
      type: 'extractedData',
      data: response
    });
  }
})();

