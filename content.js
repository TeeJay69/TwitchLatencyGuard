// content.js
window.addEventListener('load', function() {
    function main_listener(interval = 900){
        let last_timeStamp = 0;
        return async function(event){
            if(event.timeStamp - last_timeStamp <= interval) return; // event throttle
            last_timeStamp = event.timeStamp;
            
            const delay2 = document.querySelector(`[aria-label="Latency To Broadcaster"]`)?.textContent.match(/([0-9.]+)/)?.[1]; // Latency To Broadcaster
            
            // chrome.storage.sync.get('latencyThreshold', function(data) {
                if (parseFloat(delay2) > parseFloat(1.5)) {
                    displayNotification(`Fast forwarding due to high latency ${delay2}`)
                    document.querySelectorAll("video").forEach(video => {
                        if (video.buffered.length) {
                            video.currentTime = video.buffered.end(video.buffered.length - 1);
                        }
                    });
            }
            // });
        }
    }

    function displayNotification(message) {
        console.log('Displaying notification:', message);
        const notification = document.createElement('div');
        notification.innerText = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px';
        notification.style.background = 'red';
        notification.style.color = 'white';
        notification.style.zIndex = '10000';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    document.addEventListener("timeupdate", main_listener(900), true);
});