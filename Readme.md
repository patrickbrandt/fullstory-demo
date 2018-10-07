# User feedback + sentiment analysis + FullStory
A demonstration of how [FullStory's](https://fullstory.com) session replay URLs can be fused with sentiment anaylsis on customer feedback to automatically generate issues in GitHub.

FullStory session replay provides website owners and customer support staff a pixel-perfect replay of real user experiences on their websites.

## Demo components
Three different components were built to bring this demo together.

### The Homesite
![image](https://user-images.githubusercontent.com/11197026/46587200-86a8ae80-ca56-11e8-8d20-259e635f19b5.png)

A feedback widget (the blue tab - docked to the right of the screen) sends user-entered text to an API that performs sentiment analysis and categorizes it into Positive, Neutral, Mixed, Negative, and Rage clusters. Any feedback that falls in the Negative or Rage categories automatically creates a GitHub issue on this project with a [`negative-feedback`](https://github.com/patrickbrandt/fullstory-demo/labels/negative-feedback) label.

### The Feedback Portal
![image](https://user-images.githubusercontent.com/11197026/46587232-0e8eb880-ca57-11e8-960b-3ebe32a41e6c.png)
[TBC]

### The API

[TBC]
