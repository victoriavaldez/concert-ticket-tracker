chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create('checkPrices', { periodInMinutes: 30});
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkPrices') {
        checkPrices();
    }
});

