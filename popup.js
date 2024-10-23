document.getElementById('save').addEventListener('click', function() {
    const latencyThreshold = parseFloat(document.getElementById('latency-threshold').value);
    const fastForwardMethod = document.getElementById('fast-forward-method').value;

    chrome.storage.sync.set({
        latencyThreshold: latencyThreshold,
        fastForwardMethod: fastForwardMethod
    }, function() {
        console.log('Settings saved');
        alert("Settings saved successfully!"); // Provides a simple feedback mechanism
    });
});

// Load the current settings when the popup opens
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get(['latencyThreshold', 'fastForwardMethod'], function(data) {
        if (data.latencyThreshold) {
            document.getElementById('latency-threshold').value = data.latencyThreshold;
        }
        if (data.fastForwardMethod) {
            document.getElementById('fast-forward-method').value = data.fastForwardMethod;
        }
    });
});
