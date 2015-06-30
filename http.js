// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
//var morgan     = require('morgan');

// configure app
//app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8079; // set our port

//var mongoose   = require('mongoose');
//mongoose.connect('mongodb://localhost/emails'); // connect to our database



// var mongoose     = require('mongoose');
// var Schema       = mongoose.Schema;

// var EmailSchema   = new Schema({
// 	to:''
// });

// var emails = mongoose.model('Bear', EmailSchema);


var api_key = "4567-gfhj567-8798-retfhgv";

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'eHatchers' });	
});

// on routes that end in /bears
// ----------------------------------------------------
router
.route('/api')

	// create a bear (accessed at POST http://localhost:8080/bears)
	.post(function(req, res) {

	
//Lets fucking validate
function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

        if(!validateEmail(req.body.to)){
            res.send("Invalid email address in TO field.");
        }


		// Begin send mail
        var outbound = require('./outbound');

        // Grab Parent object
        var plugin = this;

			// Allow overriding of from address
        if (req.body.from) var from = req.body.from;
	
        var contents = [
        "From: " + from,
        "To: " + req.body.to,
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=ISO-8859-1",
        "X-Mailer:eHatcher",
	    "Content-Transfer-Encoding:7bit",
	    "Subject: " + req.body.subject,
        "",
        req.body.body,
        ""].join("\n");

        var outnext = function(code, msg) {
        	switch (code) {
        		case 906:
        		var output = msg;
        		break;
	            case 'DENY':
	                var output = "Sending mail failed: " + msg;
	                break;
	            case 'OK':
	                var output = "mail sent";
	                break;
	            default:
	                var output = "Unrecognised return code from sending email: " + msg;
	                break;
            };
            console.log(output);
            res.send(output);
        };


        if (req.body.key === api_key)
        	outbound.send_email(from, req.body.to, contents, outnext);
        else
        	res.send(("API Key was invalid."));
    });



// REGISTER OUR ROUTES -------------------------------
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
