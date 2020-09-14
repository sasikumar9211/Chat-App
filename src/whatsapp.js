var http = require('http');

var instanceId = 11; // TODO: Replace it with your gateway instance ID here
var clientId = "sasikumar.balasubramanian92@gmail.com"; // TODO: Replace it with your Forever Green client ID here
var clientSecret = "25410c6882b6410fa99233143aad8b18";  // TODO: Replace it with your Forever Green client secret here

var i;
//for (i = 0; i < 10; i++) {
   // console.log(i);

var jsonPayload = JSON.stringify({
    group_admin: "+918754000313", // TODO: Specify the WhatsApp number of the group creator, including the country code
    group_name: "Bro sis machies",   // TODO:  Specify the name of the group
    message: "How are you!!! I am Messaging from the Server Gateway !!! I will Spam you guys"  // TODO: Specify the content of your message
});

var options = {
    hostname: "api.whatsmate.net",
    port: 80,
    path: "/v3/whatsapp/group/text/message/" + instanceId,
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-WM-CLIENT-ID": clientId,
        "X-WM-CLIENT-SECRET": clientSecret,
        "Content-Length": Buffer.byteLength(jsonPayload)
    }
};

var request = new http.ClientRequest(options);
request.end(jsonPayload);

request.on('response', function (response) {
    console.log('Heard back from the WhatsMate WA Gateway:\n');
    console.log('Status code: ' + response.statusCode);
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
        console.log(chunk);
    });
});

//}