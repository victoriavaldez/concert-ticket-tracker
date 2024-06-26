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
    chrome.storage.local.get(['priceData'], (result) => {
        const priceData = result.priceData || {};
        const oldPrices = priceData[url] || [];

        const hasChanges = oldPrices.length === 0 || oldPrices.some((price, index) => price !== newPrices[index]);

        if(hasChanges){
            priceData[url] = newPrices;
            chrome.storage.local.set({priceData: priceData}, () => {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'images/icon128.png',
                    title: 'Price Alert!',
                    message: 'Price changes detected on ${url}'
                });
            });
        }
    });
}