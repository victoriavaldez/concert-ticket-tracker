const scrapePrices = () => {
    let prices = [];

    if(window.location.hostname.includes('ticketmaster.com')) {
        document.querySelectorAll('.price').forEach(el => prices.push(parseFloat(el.textContext.replace(/[^0-9.-]+/g, ""))));
    }
    else if (window.location.hostname.includes('seatgeek.com')) {
        document.querySelectorAll('.listing-price').forEach(el => prices.push(parseFloat(el.textContent.replace(/[^0-9.-]+/g, ""))));
    } 
    else if (window.location.hostname.includes('vividseats.com')) {
        document.querySelectorAll('.price-wrapper .price').forEach(el => prices.push(parseFloat(el.textContent.replace(/[^0-9.-]+/g, ""))));
    } 
    else if (window.location.hostname.includes('axs.com')) {
        document.querySelectorAll('.price').forEach(el => prices.push(parseFloat(el.textContent.replace(/[^0-9.-]+/g, ""))));
    }

    return prices;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'scrapePrices') {
      const prices = scrapePrices();
      sendResponse({ prices: prices });
    }
  });