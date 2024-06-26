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
    console.log("Tracked URLs:", result.trackedUrls);  // Debugging line to see what's fetched
    console.log("Price Data:", result.priceData);     // Debugging line to see price data

    const trackedUrls = result.trackedUrls || [];
    const container = document.getElementById('trackedUrls');
    container.innerHTML = ''; // Clear existing entries

    trackedUrls.forEach((item, index) => {
      console.log("Processing item:", item); // Debug each item
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

      const priceHistory = result.priceData[item.url] || [];
      priceHistory.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `Time: ${entry.timestamp}, Prices: ${entry.prices.join(', ')}`;
        priceList.appendChild(li);
      });

      if (priceHistory.length === 0) {
        const noDataLi = document.createElement('li');
        noDataLi.textContent = "No price history available.";
        priceList.appendChild(noDataLi);
      }

      div.appendChild(priceList);
      container.appendChild(div);
    });
  });
}

function togglePriceDisplay(index) {
  const priceList = document.getElementById(`priceList-${index}`);
  if (priceList) {
    priceList.style.display = priceList.style.display === 'none' ? 'block' : 'none';
  }
}

function deleteTracker(index) {
  chrome.storage.local.get(['trackedUrls', 'priceData'], (result) => {
    let trackedUrls = result.trackedUrls || [];
    let priceData = result.priceData || {};

    if (trackedUrls.length > index) { // Check to prevent out-of-bound errors
      const urlToDelete = trackedUrls[index].url;
      trackedUrls.splice(index, 1); // Remove the item at the specified index
      delete priceData[urlToDelete]; // Remove associated price data

      chrome.storage.local.set({ trackedUrls, priceData }, () => {
        displayTrackedUrls(); // Refresh the list after deleting
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', displayTrackedUrls);
