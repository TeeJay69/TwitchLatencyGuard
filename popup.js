// popup.js
document.getElementById('save').addEventListener('click', function() {
    const latencyThreshold = document.getElementById('latency-threshold').value;
    chrome.storage.sync.set({latencyThreshold: parseFloat(latencyThreshold)}, function() {
        console.log('Settings saved');
        alert("Settings saved successfully!"); // Provides a simple feedback mechanism
    });
});

document.getElementById('toggleVideoStats').addEventListener('change', function() {
    const showStats = this.checked;
    chrome.storage.sync.set({ showVideoStats: showStats }, function() {
        console.log('Video stats visibility updated:', showStats);
    });
});

// Load the current settings when the popup opens
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get('latencyThreshold', function(data) {
        if (data.latencyThreshold) {
            document.getElementById('latency-threshold').value = data.latencyThreshold;
        }
    });
    chrome.storage.sync.get('showVideoStats', function(data) {
        document.getElementById('toggleVideoStats').checked = data.showVideoStats || false;
    });
});
