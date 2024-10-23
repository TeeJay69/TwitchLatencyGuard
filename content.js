// TwitchLatencyGuard

// Define the fast-forward methods
function seekToLiveEdge() {
    document.querySelectorAll("video").forEach(video => {
        if (video.buffered.length) {
            let bufferEnd = video.buffered.end(video.buffered.length - 1);
            video.currentTime = bufferEnd - 1; // Reduce buffer to 1 second
        }
    });
}

function changeQuality() {
    const player = Array.from(document.querySelectorAll('*')).find(el => el?.player)?.player;
    if (player) {
        const qualities = player.getQualities();
        const currentQuality = player.getQuality();
        const newQuality = qualities.find(q => q.group !== currentQuality)?.group;
        if (newQuality) {
            player.setQuality(newQuality);
            setTimeout(() => {
                player.setQuality(currentQuality);
            }, 1000);
        }
    } else {
        console.log('Player instance not found.');
    }
}

function reloadVideoElement() {
    const video = document.querySelector('video');
    if (video) {
        const src = video.currentSrc;
        video.pause();
        video.removeAttribute('src');
        video.load();
        video.src = src;
        video.load();
        video.play();
    } else {
        console.log('Video element not found.');
    }
}

function speedUpPlayback() {
    const video = document.querySelector('video');
    if (video) {
        const originalRate = video.playbackRate;
        video.playbackRate = 2.0;
        setTimeout(() => {
            video.playbackRate = originalRate;
        }, 5000);
    } else {
        console.log('Video element not found.');
    }
}

function reinitializePlayer() {
    const playerContainer = document.querySelector('.video-player');
    if (playerContainer) {
        const newPlayerContainer = playerContainer.cloneNode(false);
        playerContainer.parentNode.replaceChild(newPlayerContainer, playerContainer);
    } else {
        console.log('Player container not found.');
    }
}

// Function to display notifications
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
    setTimeout(() => notification.remove(), 2000);
}

// Function to get settings from the background script
function getSetting(key) {
    return new Promise(resolve => {
        chrome.runtime.sendMessage({ action: "getSetting", key: key }, function(response) {
            resolve(response.value);
        });
    });
}

window.addEventListener('load', function() {
    function main_listener(interval = 2000) {
        let last_timeStamp = 0;
        return function(event) {
            if (event.timeStamp - last_timeStamp <= interval) return; // Event throttle
            last_timeStamp = event.timeStamp;

            // Existing code to get 'delay2f'
            const delay2a = document.querySelector(`[aria-label="Latency To Broadcaster"]`);
            const delay2b = document.querySelector("#live-channel-stream-information > div > div > div.Layout-sc-1xcs6mc-0.dRGOOY > div > div.Layout-sc-1xcs6mc-0.evfzyg > div.Layout-sc-1xcs6mc-0.iStNQt > div.Layout-sc-1xcs6mc-0.hJHxso > div > div > button:nth-child(4) > div > span.ffz-stat-text");
            let delay2;
            if (delay2b != null) {
                delay2 = delay2b.textContent.match(/([0-9.]+)/)?.[1];
            } else if (delay2a != null) {
                delay2 = delay2a.textContent.match(/([0-9.]+)/)?.[1];
            } else {
                return;
            }

            const delay2f = parseFloat(delay2);

            // Get settings and execute the selected method
            Promise.all([getSetting('latencyThreshold'), getSetting('fastForwardMethod')]).then(([latLimit, method]) => {
                if (delay2f > parseFloat(latLimit || 1.5)) {
                    switch (method) {
                        case 'seek':
                            seekToLiveEdge();
                            break;
                        case 'quality':
                            changeQuality();
                            break;
                        case 'reload':
                            reloadVideoElement();
                            break;
                        case 'speedup':
                            speedUpPlayback();
                            break;
                        case 'reinit':
                            reinitializePlayer();
                            break;
                        default:
                            seekToLiveEdge(); // Default method
                    }
                    displayNotification(`Fast forwarding due to high latency ${delay2f}`);
                }
            });
        };
    }

    // Add the event listener for latency handling
    document.addEventListener("timeupdate", main_listener(2000), true);
});
