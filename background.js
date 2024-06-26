chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create('checkPrices', { periodInMinutes: 30});
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkPrices') {
        checkPrices();
    }
});

function checkPrices() {
    chrome.storage.local.get(['trackedUrls'], (result) => {
        const urls = result.trackedUrls || [];
        urls.forEach(url => {
            chrome.tabs.create({url: url, activate: false }, (tab) => {
                chrome.tabs.executeScript(tab.id, { file: 'content.js'}, () => {
                    chrome.tabs.sendMessage(tab.id, {action: "scrapePrices"}, (response) => {
                        if (response && response.prices){
                            compareAndNotify(url, response.prices);
                        }
                        chrome.tabs.remove(tab.id);
                    });
                });
            });
        });
    });
}

function compareAndNotify(url, newPrices) {
    const timestamp = new Date().toISOString(); // Get current time in ISO format
    chrome.storage.local.get(['priceData'], (result) => {
      const priceData = result.priceData || {};
      const priceHistory = priceData[url] || [];
  
      const lastPriceEntry = priceHistory[priceHistory.length - 1] || {};
      const lastPrices = lastPriceEntry.prices || [];
  
      const hasChanges = !lastPrices.length || lastPrices.some((price, index) => price !== newPrices[index]);
  
      if (hasChanges) {
        priceHistory.push({ timestamp: timestamp, prices: newPrices }); // Store new price entry with timestamp
        priceData[url] = priceHistory;
        chrome.storage.local.set({ priceData: priceData }, () => {
          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'images/icon128.png',
            title: 'Price Alert!',
            message: `Price changes detected on ${url}`
          });
        });
      }
    });
  }
  