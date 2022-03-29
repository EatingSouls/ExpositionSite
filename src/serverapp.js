// --- LIBRARIES ---
require("dotenv").config();
const PORT = process.env.PORT;
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const db = require("./database/connection");


//PAYPAL CONFIG

console.log(colors("yellow", "Starting Website systems..."));

// --- PUBLIC ---
app.use(bodyParser.json());
app.use(cookieParser());

// --- DATABASE CONNECTION ---
// db.then(() => console.log("Database connection:", colors("green", "STABLE"))).catch((err) => console.log(err));

// --- VIEW ENGINE ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// --- ROUTES ---
const homeRoute = require("./routes/home");
app.use('/robots.txt', function (req, res, next) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /admin\nDisallow: /api\nDisallow: /search");
});

// --- MIDDLEWARE ROUTS ---
app.use("/", homeRoute);


// --- 404 ERROR ---
app.use("/noscript", function(req, res, next) {
    res.render('utils/noscript'); 
});

app.use(function(req, res, next) {
    res.status(404).render('utils/errorfile');
});

if(process.env.NODE_ENV == "production"){
    app.use(function(err, req, res, next) {
        res.status(500).render('utils/errorfile', {error: {message: "There are something that doesn't work. Please contact webstite staff for help. Report error saved successfully", code:500}});
        console.log({title: "REPORT_SYSTEM_ERROR", message: err.toString(), path: err.path});
    });
}

app.disable('x-powered-by');


const http = require("http").createServer(app)
const fs = require("fs");
const https = require("https");


http.listen(30, function () {
    console.log(`Website status:`, colors("green", "ONLINE"));
    if(process.env.NODE_ENV == "production"){
        console.log("MODE:", colors("yellow", "Production"));
        console.log("PORT:", colors("green", "433"));
    } else {
        console.log("MODE:", colors("yellow", "Development"));
        console.log("PORT:", colors("green", "80"));
    }
})

var httpSelector = http;
var k = undefined;
var cer = undefined;
var chain = undefined;

if(process.env.NODE_ENV == "production") {
    k = fs.readFileSync('/etc/letsencrypt/live/www.anicorn.tv/privkey.pem', 'utf8');
    cer = fs.readFileSync('/etc/letsencrypt/live/www.anicorn.tv/cert.pem', 'utf8');
    chain = fs.readFileSync('/etc/letsencrypt/live/www.anicorn.tv/chain.pem', 'utf8');

    const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/www.anicorn.tv/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/www.anicorn.tv/cert.pem', 'utf8'),
    chain: fs.readFileSync('/etc/letsencrypt/live/www.anicorn.tv/chain.pem', 'utf8'),
        requestCert: true,
        rejectUnauthorized: false,
    };

    const cssa = https.createServer(options, app).listen(443);
    httpSelector = cssa;
    console.log("SSL status:", colors("green", "Enabled"))
} else {
    console.log("SSL status:", colors("red", "Disabled"))
}

const io = require('socket.io')(httpSelector, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

global.io = io;
if(global.io){
    console.log("Socket status:", colors("green", "Enabled"))
} else {
    console.log("Socket status:", colors("red", "Disabled"))
}

// io.on('connection', async (socket) => {



// });

var Particle = require('particle-api-js');
var particle = new Particle();
setInterval(() => {

    particle.getVariable({ deviceId: '43004d000751373238323937', name: 'smoke', auth: "5a23c4e8837981d9938f4c8b74fde13c31fc3b7a" }).then(function(data) {
        global.io.emit('ping', {
            val: data.body.result != undefined ? data.body.result : 0
        });
      }, function(err) {
        global.io.emit('ping', {
            val: 0
        });
      });

}, 1000);


// io.on('connection', function(socket) {
//     console.log("User connected");
// });

global.link = process.env.NODE_ENV == "production" ? `${process.env.DEFAULT_LINK}:433` : `${process.env.DEFAULT_LINK}`;

function colors(color, text) {
    var colors = {
        "red": "\x1b[31m",
        "green": "\x1b[32m",
        "yellow": "\x1b[33m",
        "blue": "\x1b[34m",
        "magenta": "\x1b[35m",
        "cyan": "\x1b[36m",
        "white": "\x1b[37m",
        "reset": "\x1b[0m"
    }
    return colors[color] + text + colors["reset"];
}
