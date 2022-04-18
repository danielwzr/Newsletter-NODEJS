const express = require('express');
const bodyParser = require('body-parser');
const region = "us14";
const apiKey = "689a853cbf1a4e2228994dbf9191e2de-" + region;
const https = require('https');
const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
    apiKey: apiKey,
    server: region
})

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public")); /* locate local files used in HTML on server side using public folder */

app.get('/', function(req, res){
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', async function(req, res){
    const fname = req.body.firstname;
    const lname = req.body.secondname;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: fname,
                LNAME: lname,
            }
        }]
    }

    const jsonData = JSON.stringify(data);
    
    var url = "https://" + region + ".api.mailchimp.com/3.0/lists/" + "9b352466ab";
    const options = {
        method: 'POST',
        auth: 'danielwzr:689a853cbf1a4e2228994dbf9191e2de-us14',
    }

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200){
            res.send("Success in subscribing")
        }
        else{
            res.send("There is some error")
        }

        response.on("data", function(data){       
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

})


app.listen(3001, function(req, res){
    console.log('Server on..');
});