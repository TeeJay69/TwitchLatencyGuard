// content.js
window.addEventListener('load', function() {
    function main_listener(interval = 900){
        let last_timeStamp = 0;
        return async function(event){
            if(event.timeStamp - last_timeStamp <= interval) return; // event throttle
            last_timeStamp = event.timeStamp;
            
            // const delay2 = document.querySelector(`[aria-label="Latency To Broadcaster"]`)?.textContent.match(/([0-9.]+)/)?.[1]; // Latency To Broadcaster
            const delay2b = document.querySelector("#live-channel-stream-information > div > div > div.Layout-sc-1xcs6mc-0.dRGOOY > div > div.Layout-sc-1xcs6mc-0.evfzyg > div.Layout-sc-1xcs6mc-0.iStNQt > div.Layout-sc-1xcs6mc-0.hJHxso > div > div > button:nth-child(4) > div > span.ffz-stat-text");
            if(delay2b != null){
                const delay2 = delay2b.textContent.match(/([0-9.]+)/)?.[1];
                // const delay2f = parseFloat(delay2);
                // displayNotification(`latency ${delay2f}`);
                // chrome.storage.sync.get('latencyThreshold', function(data) {
                const delay2f = parseFloat(delay2);
                if (delay2f > parseFloat(1.5)) {
                    displayNotification(`Fast forwarding due to high latency ${delay2f}`)
                    document.querySelectorAll("video").forEach(video => {
                        // let ffVal = (delay2f - (delay2f * parseFloat(0.1)));
                        // displayNotification(`ffVal                                                    ${ffVal}`);
                        if (video.buffered.length) {
                            video.currentTime = video.buffered.end(video.buffered.length - 1);
                        }
                    });
                }
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

    chrome.storage.sync.get('showVideoStats', function(data) {
        if (data.showVideoStats) {
            document.documentElement.setAttribute('show_video_stats', '');
        } else {
            document.documentElement.removeAttribute('show_video_stats');
        }
    });
    
    document.addEventListener("timeupdate", main_listener(900), true);
});