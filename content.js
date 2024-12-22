// TwitchLatencyGuard

// Helper function to get the React internal instance
function getReactInstance(element) {
    for (const key in element) {
        if (key.startsWith("__reactInternalInstance$")) {
            return element[key];
        }
    }
    return null;
}

// Helper function to find a node in the React tree
function findReactNode(root, constraint) {
    if (constraint(root)) {
        return root;
    }
    let child = root.child;
    while (child) {
        const result = findReactNode(child, constraint);
        if (result) {
            return result;
        }
        child = child.sibling;
    }
    return null;
}

// Function to get the Twitch player instance
function getPlayer() {
    const container = document.querySelector('.video-player__container');
    const reactInstance = getReactInstance(container);
    if (!reactInstance) return null;

    const node = findReactNode(reactInstance, node => node?.memoizedProps?.mediaPlayerInstance);
    return node?.memoizedProps?.mediaPlayerInstance || null;
}

function changeQuality() {
    const player = getPlayer();
    if (player) {
        const qualities = player.getQualities();
        const currentQuality = player.getQuality();
        const otherQualities = qualities.filter(q => q.group !== currentQuality);
        if (otherQualities.length > 0) {
            const newQuality = otherQualities[0].group;
            player.setQuality(newQuality);
            setTimeout(() => {
                player.setQuality(currentQuality);
            }, 1000);
        } else {
            console.log('No alternative quality available.');
        }
    } else {
        console.log('Player instance not found.');
    }
}

// Define the fast-forward methods
function seekToLiveEdge() {
    document.querySelectorAll("video").forEach(video => {
        if (video.buffered.length) {
            let bufferEnd = video.buffered.end(video.buffered.length - 1);
            video.currentTime = bufferEnd - 1; // Reduce buffer to 1 second
        }
    });
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
        }, 2000);
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
    function main_listener(interval = 3000) {
        let last_timeStamp = 0;
        return function(event) {
            if (event.timeStamp - last_timeStamp <= interval) return; // Event throttle
            last_timeStamp = event.timeStamp;

            // Existing code to get 'delay2f'
            const delay2a = document.querySelector(`[aria-label="Latency To Broadcaster"]`);
            const delay2b = document.querySelector('.ffz--meta-tray button:nth-child(4) .ffz-stat-text');
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
    document.addEventListener("timeupdate", main_listener(3000), true);
});
