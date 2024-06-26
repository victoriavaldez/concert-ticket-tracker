document.getElementById('trackForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const url = document.getElementById('urlInput').value;
  const artist = document.getElementById('artistName').value;
  const website = document.getElementById('websiteName').value;

  const entry = { url, artist, website };

  chrome.storage.local.get(['trackedUrls'], (result) => {
    const trackedUrls = result.trackedUrls || [];
    if (!trackedUrls.some(item => item.url === url)) {
      trackedUrls.push(entry);
      chrome.storage.local.set({ trackedUrls: trackedUrls }, () => {
        displayTrackedUrls();
      });
    }
  });
  document.getElementById('artistName').value = '';
  document.getElementById('websiteName').value = '';
  document.getElementById('urlInput').value = '';
});

function displayTrackedUrls() {
  chrome.storage.local.get(['trackedUrls', 'priceData'], (result) => {
    const trackedUrls = result.trackedUrls || [];
    const priceData = result.priceData || {};
    const container = document.getElementById('trackedUrls');
    container.innerHTML = '';

    trackedUrls.forEach(item => {
      const div = document.createElement('div');
      div.innerHTML = `<strong>${item.artist} on ${item.website}</strong>`;
      const list = document.createElement('ul');

      const priceHistory = priceData[item.url] || [];
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
