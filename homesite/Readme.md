![image](https://user-images.githubusercontent.com/11197026/46587664-91b30d00-ca5d-11e8-9457-27696ea65372.png)

### [http://wpb.is/FullStory](https://wpb.is/FullStory)
The homesite has a feedback widget where users can provide their thoughts of the site. This is the entryway for sentiment analysis and GitHub issue creation. 

The site has a FullStory JavaScript tag that records sessions and provides a [JavaScript API](https://help.fullstory.com/develop-js) to get session replay URLs. The feedback widget uses `FS.getCurrentSessionURL(true)` to link the session replay to the moment the feedback was submitted.

The site is vanilla HTML5/CSS3, optimized for dektop and tablet. The feedback widget is a web component built with [Polymer 3.0](https://www.polymer-project.org/). There is a playground near the bottom of the site to provide events for session reply and analytics.
