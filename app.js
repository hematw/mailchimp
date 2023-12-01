const express = require('express');
const request = require('request');
const https = require('https')

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
})
app.post('/', (req, res) => {
    console.log(req.body);
    let firstName = req.body.firstname;
    let lastName = req.body.lastname;
    let email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/bafe050e72";

    const options = {
        method: "POST",
        auth: "hematw:752be2ca3a5727b9ed46402f2b2e4ffd-us21"
    }

    const postReq = https.request(url, options, (response) => {
        let responseData = ''; // Accumulate response data

        response.on("data", function (chunk) {
            responseData += chunk;
        });
        response.on("end", function () {
            console.log(JSON.parse(responseData));
        });

        if(response.statusCode == 200) {
            res.sendFile(__dirname +'/success.html')
        }else {
            res.sendFile(__dirname +'/failure.html')
        }
    });
    postReq.write(jsonData);
    postReq.end();
})
app.post('/failure', (req, res)=> {
    res.redirect("/");
})
app.listen(process.env.PORT || 3000, function () {
    console.log('Server is running on port 3000 😀');
})


// Mailchimp API key:
// 752be2ca3a5727b9ed46402f2b2e4ffd-us21

// List id:
// bafe050e72