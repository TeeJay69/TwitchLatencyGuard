chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getSetting") {
        chrome.storage.sync.get(request.key, function(data) {
            sendResponse({ value: data[request.key] });
        });
        return true; // Indicates that the response will be sent asynchronously
    }
});
