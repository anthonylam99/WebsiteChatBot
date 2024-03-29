
require("dotenv").config()
import request from "request"

const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN
const WEBVIEW_URL = process.env.WEBVIEW_URL

let test = (req, res) => {
    return res.send("hello again")
}

let getWebHook = (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = MY_VERIFY_TOKEN

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
}

let postWebHook = (req, res) => {
    // Parse the request body from the POST
    let body = req.body;

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);


            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
}


// Handles messages events
let handleMessage = (sender_psid, received_message) => {
    let response;

    // Checks if the message contains text
    if (received_message.text) {
        // Create the payload for a basic text message, which
        // will be added to the body of our request to the Send API
        response = {
            "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
        };

        if (received_message.text.toLowerCase() === "webview") {
            response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "OK. Let's set your room preferences, so I won't" +
                            "need to ask for them in the future?",
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": WEBVIEW_URL,
                                "title": "Set preferences",
                                "webview_height_ratio": "full", //display on mobile
                                "messenger_extensions": true //false : open the webview in new tab
                            },
                        ]
                    }
                }
            };
        }

    } else if (received_message.attachments) {
        // Get the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no",
                            }
                        ],
                    }]
                }
            }
        }
    }

    // Send the response message
    callSendAPI(sender_psid, response);
};


// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'yes') {
        response = { "text": "Thanks!" }
    } else if (payload === 'no') {
        response = { "text": "Oops, try sending another image." }
    } else if (payload == "GET_STARTED_PAYLOAD") {
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Vòng quay may mắn",
                            "image_url": "https://us.123rf.com/450wm/onyxprj/onyxprj1710/onyxprj171000022/87288142-spinning-wheel-with-prizes-game-roulette-vector-illustration-isolate.jpg?ver=6",
                            "subtitle": "Chương trình khuyến mãi",
                            "default_action": {
                                "type": "web_url",
                                "url": WEBVIEW_URL,
                                "messenger_extensions": true,
                                "webview_height_ratio": "full"
                            },
                            "buttons": [
                                {
                                    "type": "web_url",
                                    "url": WEBVIEW_URL,
                                    "title": "Chơi",
                                    "webview_height_ratio": "full", //display on mobile
                                    "messenger_extensions": true //false : open the webview in new tab
                                },
                            ]
                        }
                    ]
                }
            }
        };
    }
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v7.0/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

let getWebView = (req, res) => {
    return res.render("webview.ejs")
}


let postResult = (req, res) => {
    let response;
    response = {
        "text": `Bạn đã trúng ${req.body.message}`
    };
    callSendAPI(req.body.psid, response)
    res.send(response)
}


module.exports = {
    test: test,
    getWebHook: getWebHook,
    postWebHook: postWebHook,
    getWebView: getWebView,
    postResult: postResult,
}