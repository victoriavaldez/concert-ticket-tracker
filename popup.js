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
  chrome.storage.local.get(['trackedUrls', 'priceData'], (result) => {
    const trackedUrls = result.trackedUrls || [];
    const priceData = result.priceData || {};
    const container = document.getElementById('trackedUrls');
    container.innerHTML = '';

    trackedUrls.forEach(url => {
      const div = document.createElement('div');
      div.innerHTML = `<strong>${url}</strong>`;
      const list = document.createElement('ul');

      const priceHistory = priceData[url] || [];
      priceHistory.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `Time: ${entry.timestamp}, Prices: ${entry.prices.join(', ')}`;
        list.appendChild(li);
      });

      div.appendChild(list);
      container.appendChild(div);
    });
  });
}

document.addEventListener('DOMContentLoaded', displayTrackedUrls);

  