# Twitch Latency Guard Development Plan

## Minimal description:
 - Something

## Commit guidelines:
### Format:
> The mood should be whatever feels natural and most appropriate. One can use the imparative for the headline and the present for the body if that feels right.
```Git
type(scope): Headline
-> Description

type(scope): Headline
-> Description

<!-- Example -->
feat(list): Display installed programs
-> 'list --installed' operand (-i). Shows the date and the name of the program. The output is sorted in ascending order of date.
```

### Types:
* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing or correcting existing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
generation


## Feature Dev:
- [x] Make latency limit an adjustable setting 
- [ ] Allow different latency limits for different channels
- [ ] Save settings for next browser session


## Critical ToDo's:
- [ ] XXX



## Reevaluate:
- [Declined] ~~xxx~~
- [x] xxx

## Feature requests:
- [Declined] ~~xxx~~
- [ ] xxx


## Known Bugs:
- [Closed] xxx
- [ ] White line appearing around the video stats box when changing zoom levels
- [ ] Video stats must be manually activated if FFZ extension latency widget is disabled


## Trashcan:
<!-- code -->


## Parking Lot
<!-- code -->
<!-- // const delay2 = document.querySelector(`[aria-label="Latency To Broadcaster"]`)?.textContent.match(/([0-9.]+)/)?.[1]; // Latency To Broadcaster from the video stats table-->
<!-- chrome.storage.sync.get('showVideoStats', function(data) {
        if (data.showVideoStats) {
            document.documentElement.setAttribute('show_video_stats', '');
        } else {
            document.documentElement.removeAttribute('show_video_stats');
        }
    }); -->
<!-- 
        <label for="toggleVideoStats">Show Video Stats</label>
        <input type="checkbox" id="toggleVideoStats">
         -->