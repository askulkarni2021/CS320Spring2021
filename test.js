var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let request = new XMLHttpRequest()
request.onreadystatechange = function() {
  if (this.readyState === 4) {
    console.log(this.status)
    console.log(this.responseText)
  }
}
request.open("POST", "https://events-api.notivize.com/applications/77f4a178-c6be-4a14-bf1a-dfddf7a35fa8/event_flows/94b9ddcc-b9b2-4b6e-8503-31a1824acb71/events", true)
request.setRequestHeader("Content-Type", "application/json")
request.setRequestHeader("Authorization", "Bearer 67140638-bdc8-408a-90dc-aac4475d6d65")
request.send(JSON.stringify({
  'aashah@umass.edu': 'Hope you are well'
}))
