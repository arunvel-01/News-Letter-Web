const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const dotenv = require("dotenv");

const app = express();


app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


app.get("/", function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }            
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/0888baa758"; 
    const options = {
        method: "POST",
        auth: `Arunvel:${process.env.MAILCHIMP_API_KEY}`,
    };
   const mailchimpRequest =  https.request(url, options, function(response){
    if (response.statusCode === 200){
        res.sendFile(__dirname + "/success.html")
    } else{
        res.sendFile(__dirname + "/failure.html");
    }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });
   
  mailchimpRequest.write(jsonData);
  mailchimpRequest.end();
});

app.post("/failure", function(req,res){
    res.redirect("/")
})

app.listen(3000 , function(){
    console.log("Server is running on port 3000.");
});
