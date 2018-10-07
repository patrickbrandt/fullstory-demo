![image](https://user-images.githubusercontent.com/11197026/46587664-91b30d00-ca5d-11e8-9457-27696ea65372.png)
# FullStory Demo Feedback API
* Receive user-entered text from the feedback widget on [http://wpb.is/FullStory](http://wpb.is/FullStory).
* Pass the text into [Amazon Comprehend](https://aws.amazon.com/comprehend/).
* Store the results in Amazon DynamoDB.
* If negative sentiment is detected, create a GitHub issue for this project labeled `negative-feedback`. Include the user-entered text and the FullStory session replay URL.

## GET /feedback
Returns all feedback filtered by sentiment categories (if provided). Results are ordered by creation date, descending.
### Request parameters
#### query string
| Parameter     | Type           | Required  | Description |
| :------------- | :------------- | :----- | :--- |
| filter      | enum | No | Accepted values are: 'POSITIVE', 'NEUTRAL', 'MIXED', 'NEGATIVE', 'RAGE' |

### Responses
#### 200
#### Response type
```JSON
[
  {
    sessionURL: String,
    date: String (ISO 8601 format),
    sessionId: String,
    feedback: String,
    sentiment: String Enum: POSITIVE|NEUTRAL|MIXED|NEGATIVE|RAGE
  },
    ...
]
```
#### Example
```JSON
[
  {
    "sessionURL": "https://app.fullstory.com/ui/F7F6T/session/5672330625810432%3A5742506566221824%3A1538927170851",
    "date": "2018-10-07T15:46:11.054Z",
    "sessionId": "5672330625810432:5742506566221824",
    "feedback": "oh well..\n\nI'll live with it",
    "sentiment": "NEUTRAL"
  },
]
```
#### 500
#### Response type
```JSON
{
  name: String
  message: String
}
```
