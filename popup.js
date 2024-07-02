document.getElementById('save').addEventListener('click', function() {
    const latencyThreshold = document.getElementById('latency-threshold').value;
    chrome.storage.sync.set({latencyThreshold: parseFloat(latencyThreshold)}, function() {
        console.log('Settings saved');
        alert("Settings saved successfully!"); // Provides a simple feedback mechanism
    });
});

// Load the current settings when the popup opens
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get('latencyThreshold', function(data) {
        if (data.latencyThreshold) {
            document.getElementById('latency-threshold').value = data.latencyThreshold;
        }
    });
});
