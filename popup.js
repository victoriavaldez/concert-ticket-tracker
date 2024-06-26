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
    container.innerHTML = ''; // Clear existing entries

    trackedUrls.forEach((item, index) => {
      if (!item) return; // Skip if the item is undefined or null

      const div = document.createElement('div');
      const title = document.createElement('span');
      title.textContent = `${item.artist} on ${item.website}`;
      title.style.cursor = "pointer";
      title.onclick = () => togglePriceDisplay(index);
      div.appendChild(title);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => deleteTracker(index);
      div.appendChild(deleteButton);

      const priceList = document.createElement('ul');
      priceList.id = `priceList-${index}`;
      priceList.style.display = 'none';

      // Safely access price history using optional chaining (?.)
      const priceHistory = priceData[item.url]?.length > 0 ? priceData[item.url] : [];
      priceHistory.forEach(entry => {
        if (!entry) return; // Skip if entry is undefined or null

        const li = document.createElement('li');
        li.textContent = `Time: ${entry.timestamp}, Prices: ${entry.prices.join(', ')}`;
        priceList.appendChild(li);
      });

      div.appendChild(priceList);
      container.appendChild(div);
    });
  });
}


function togglePriceDisplay(index) {
  const priceList = document.getElementById(`priceList-${index}`);
  priceList.style.display = priceList.style.display === 'none' ? 'block' : 'none';
}

function deleteTracker(index) {
  chrome.storage.local.get(['trackedUrls', 'priceData'], (result) => {
    const trackedUrls = result.trackedUrls;
    const priceData = result.priceData;
    const urlToDelete = trackedUrls[index].url;

    trackedUrls.splice(index, 1);
    delete priceData[urlToDelete];

    chrome.storage.local.set({ trackedUrls, priceData }, () => {
      displayTrackedUrls();
    });
  });
}

document.addEventListener('DOMContentLoaded', displayTrackedUrls);
