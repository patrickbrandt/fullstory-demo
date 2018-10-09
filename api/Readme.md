![image](https://user-images.githubusercontent.com/11197026/46587664-91b30d00-ca5d-11e8-9457-27696ea65372.png)
# FullStory Demo Feedback API
* Receive user-entered text from the feedback widget on [http://wpb.is/FullStory](http://wpb.is/FullStory).
* Pass the text into [Amazon Comprehend](https://aws.amazon.com/comprehend/).
* Store the results in Amazon DynamoDB.
* If negative sentiment is detected, create a GitHub issue for this project labeled `negative-feedback`. Include the user-entered text and the FullStory session replay URL.

Code and API components are orchestrated with the [Serverless Framework](http://serverless.com).

## GET /feedback
Returns all feedback filtered by sentiment categories (if provided). Results are ordered by creation date, descending.
### Request parameters
#### query string
| Parameter     | Type           | Required  | Description |
| :------------- | :------------- | :----- | :--- |
| filter      | Enum | No | Accepted values are: 'POSITIVE', 'NEUTRAL', 'MIXED', 'NEGATIVE', 'RAGE' |

### Responses
#### 200
#### Response type
```
[
  {
    sessionURL: String,
    date: String (ISO 8601 format),
    sessionId: String,
    feedback: String,
    sentiment: Enum('POSITIVE'|'NEUTRAL'|'MIXED'|'NEGATIVE'|'RAGE')
  }
]
```
#### Example
/feedback?filter=NEUTRAL,POSITIVE
```JSON
[
  {
    "sessionURL": "https://app.fullstory.com/ui/F7F6T/session/5672330625810432%3A5742506566221824%3A1538927170851",
    "date": "2018-10-07T15:46:11.054Z",
    "sessionId": "5672330625810432:5742506566221824",
    "feedback": "oh well..\n\nI'll live with it",
    "sentiment": "NEUTRAL"
  },
  {
    "sessionURL": "https://app.fullstory.com/ui/F7F6T/session/5717023518621696%3A5724160613416960%3A1539008933563",
    "date": "2018-10-08T14:28:49.015Z",
    "sessionId": "5717023518621696:5724160613416960",
    "feedback": "this is great!",
    "sentiment": "POSITIVE"
  }
]
```
#### 500
#### Response type
```
{
  error: {
    name: String
    message: String
  }
}
```

## POST /feedback
Analyze and store user-entered feedback
### Request parameters
#### body
mime-type: application/json

| Parameter     | Type           | Required  | Description |
| :------------- | :------------- | :----- | :--- |
| sessionId      | String | Yes | The session Id provided by the FullStory JavaScript API |
| sessionURL      | String | Yes | The session replay URL provided by the FullStory JavaScript API |
| feedback      | String | Yes | User-entered feedback |

### Responses
#### 200

If the feedback is not categorized as negative, this is the response:
```JSON
{
    "message": "😊 only happy thoughts 😊"
}
```

If the feedback is categorized as negative, the response is a pass-through from the GitHub [Create Issue API](https://developer.github.com/v3/issues/#create-an-issue).

#### 500
#### Response type
```
{
  error: {
    name: String
    message: String
  }
}
```
