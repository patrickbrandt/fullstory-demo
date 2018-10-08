# User feedback + sentiment analysis + FullStory
A demonstration of how [FullStory's](https://fullstory.com) session replay URLs can be fused with sentiment anaylsis on customer feedback to automatically generate issues in GitHub.

FullStory session replay provides website owners and customer support staff a pixel-perfect replay of real user experiences on their websites.

## Demo
Three different components were built to bring this demo together.

### The Homesite
![image](https://user-images.githubusercontent.com/11197026/46587200-86a8ae80-ca56-11e8-8d20-259e635f19b5.png)
#### What it does
A feedback widget (the blue tab - docked on the right side of the screen) sends user-entered text to an API that performs sentiment analysis and categorizes it into Positive, Neutral, Mixed, Negative, and Rage clusters. Any feedback that falls in the Negative or Rage categories automatically creates a GitHub issue on this project with a [`negative-feedback`](https://github.com/patrickbrandt/fullstory-demo/labels/negative-feedback) label.

The Homesite is here: [http://wpb.is/FullStory](http://wpb.is/FullStory)

The code is here: [https://github.com/patrickbrandt/fullstory-demo/tree/master/homesite](https://github.com/patrickbrandt/fullstory-demo/tree/master/homesite)

### The Feedback Portal
![image](https://user-images.githubusercontent.com/11197026/46587232-0e8eb880-ca57-11e8-960b-3ebe32a41e6c.png)
#### What it does
All user-entered feedback for all sentiment categories are displayed in a portal where feedback can be filtered by category. Timestamps and FullStory session replay URLs are also available.

The Feedback Portal is here: [http://wpb.is/FeedbackPortal](http://wpb.is/FeedbackPortal)

The code is here: [https://github.com/patrickbrandt/fullstory-demo/tree/master/feedback-portal](https://github.com/patrickbrandt/fullstory-demo/tree/master/feedback-portal)

### The API

The API binds user-entered feedback with sentiment analysis and GitHub integration. Issues are created via a [GitHub App](https://developer.github.com/apps/about-apps/#about-github-apps) available to repositories in my GitHub account.

The code is here: [https://github.com/patrickbrandt/fullstory-demo/tree/master/api](https://github.com/patrickbrandt/fullstory-demo/tree/master/api)
