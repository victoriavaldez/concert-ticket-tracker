document.getElementById('trackForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const url = document.getElementById('urlInput').value;
    chrome.storage.local.get(['trackedUrls'], (result) => {
      const trackedUrls = result.trackedUrls || [];
      if (!trackedUrls.includes(url)) {
        trackedUrls.push(url);
        chrome.storage.local.set({ trackedUrls: trackedUrls }, () => {
          displayTrackedUrls();
        });
      }
    });
    document.getElementById('urlInput').value = '';
  });
  
  function displayTrackedUrls() {
    chrome.storage.local.get(['trackedUrls'], (result) => {
      const trackedUrls = result.trackedUrls || [];
      const ul = document.getElementById('trackedUrls');
      ul.innerHTML = '';
      trackedUrls.forEach(url => {
        const li = document.createElement('li');
        li.textContent = url;
        ul.appendChild(li);
      });
    });
  }
  
  document.addEventListener('DOMContentLoaded', displayTrackedUrls);
  