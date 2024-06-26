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