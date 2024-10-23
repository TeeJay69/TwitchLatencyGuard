// TwitchLatencyGuard

window.addEventListener('load', function() {
    function main_listener(interval = 2000){ // 1350 till 24-10-22
        let last_timeStamp = 0;
        return async function(event){
            if(event.timeStamp - last_timeStamp <= interval) return; // event throttle
            last_timeStamp = event.timeStamp;
            
            const delay2a = document.querySelector(`[aria-label="Latency To Broadcaster"]`); // Latency To Broadcaster
            const delay2b = document.querySelector("#live-channel-stream-information > div > div > div.Layout-sc-1xcs6mc-0.dRGOOY > div > div.Layout-sc-1xcs6mc-0.evfzyg > div.Layout-sc-1xcs6mc-0.iStNQt > div.Layout-sc-1xcs6mc-0.hJHxso > div > div > button:nth-child(4) > div > span.ffz-stat-text");
            let delay2;
            if(delay2b != null){
                delay2 = delay2b.textContent.match(/([0-9.]+)/)?.[1];
                
            }
            else if(delay2a != null){
                delay2 = delay2a.textContent.match(/([0-9.]+)/)?.[1];
            }
            else{
                return;
            }
            
            const delay2f = parseFloat(delay2);
            const latLimit = await getLatLimit(); 
    
            if (delay2f > parseFloat(latLimit)) {
                document.querySelectorAll("video").forEach(video => {
                    if (video.buffered.length) {
                        let bufferEnd = video.buffered.end(video.buffered.length - 1);
                        video.currentTime = bufferEnd - 1; // Reduce buffer to 1 second
                        displayNotification(`Fast forwarding due to high latency ${delay2f}`)
                        // video.pause();
                        // setTimeout(() => {
                        //     video.play();
                        // }, 300);

                    }
                });
            }
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
        setTimeout(() => notification.remove(), 2000);
    }
    
    async function getLatLimit(){
        return new Promise(resolve => {
            chrome.storage.sync.get('latencyThreshold', function(data){
                resolve(data.latencyThreshold || 1.5);
            });
        });
    }

    // Add the event listener for latency handling
    document.addEventListener("timeupdate", main_listener(2000), true);

    // function displayBufferedRanges() {
    //     const video = document.querySelector('video');
    //     if (video && video.buffered.length) {
    //         let bufferedRanges = [];
    //         for (let i = 0; i < video.buffered.length; i++) {
    //             let start = video.buffered.start(i).toFixed(3); // Include numbers after the comma
    //             let end = video.buffered.end(i).toFixed(3);
    //             bufferedRanges.push(`[${start}, ${end}]`);
    //         }
    //         let message = `Buffered Ranges: ${bufferedRanges.join(', ')}`;
    //         // Update existing buffer notification or create a new one
    //         updateBufferNotification(message);
    //     } else {
    //         updateBufferNotification('No buffered ranges');
    //     }
    // }
    // let bufferNotification; // Variable to hold the buffer notification element

    // function updateBufferNotification(message) {
        // if (!bufferNotification) {
        //     bufferNotification = document.createElement('div');
        //     bufferNotification.style.position = 'fixed';
        //     bufferNotification.style.bottom = '60px';
        //     bufferNotification.style.right = '40x';
        //     bufferNotification.style.padding = '10px';
        //     bufferNotification.style.background = 'blue';
        //     bufferNotification.style.color = 'white';
        //     bufferNotification.style.zIndex = '10000';
    //         document.body.appendChild(bufferNotification);
    //     }
    //     bufferNotification.innerText = message;
    // }

    // Call the displayBufferedRanges function every second
    // setInterval(displayBufferedRanges, 1000);
});
