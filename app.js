var express = require('express'),
    bodyParser = require('body-parser'),
    requestPromise = require('request-promise'),
    app = express(),
    router = express.Router();

app.set('view engine', 'html');
app.use(express.static('app'));
app.enable('trust proxy');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --------------------------- //
// ------- MAIN ROUTES ------- //
// --------------------------- //
// Render Eligibility Test Page
app.get('/', function (req, res) {
        res.status(200).send("Hello World!");
    }
);

// ------------------------------------ //
// ------ Route for Today's Date ------ //
// ------------------------------------ //
app.get('/today', function (req, res) {
		const date = new Date(),
			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			month = months[date.getMonth()],
			day = date.getDay(),
			year = date.getFullYear(),
			americanizedYear = `${month} ${day}, ${year}`;

        res.status(200).send(americanizedYear);
    }
);

// ----------------------------------- //
// ------ Route for Hacker News ------ //
// ----------------------------------- //
app.get('/hn', function (req, res) {
		let firstRequestOptions = {
		    uri: ' https://hacker-news.firebaseio.com/v0/topstories.json',
		    headers: { 'User-Agent': 'Request-Promise' },
		    json: true
		},
		errorMessage;

		requestPromise(firstRequestOptions)
		    .then(function (repos) {
		        // console.log('User has %d repos', repos.length);
		        let firstStoryId = repos[0],
		        	secondRequestOptions = {
		        		uri: `https://hacker-news.firebaseio.com/v0/item/${firstStoryId}.json`,
					    headers: { 'User-Agent': 'Request-Promise' },
					    json: true
		        	};
		        requestPromise(secondRequestOptions)
		        	.then(function(response) {
		        		let hackerNewsArticleTitle = response.title,
		        			hackerNewsArticleAuthor = response.by;
		        		res.status(200).send(`${hackerNewsArticleTitle} - ${hackerNewsArticleAuthor}`);
		        	})
		        	.catch(function (err) {
		        		errorMessage = "Uh oh! The API call to get the first top story failed";
				        console.log(errorMessage);
				        res.status(409).send(errorMessage);
				    });
		    })
		    .catch(function (err) {
		    	errorMessage = "Uh oh! The API call to get the top stories failed";
		        console.log(errorMessage);
		        res.status(409).send(errorMessage);
		    });
    }
);


// ---------------------- //
// ------- SERVER ------- //
// ---------------------- //
var hostname = '0.0.0.0', 
    port = process.env.PORT || 3000;
app.listen(port, hostname, function() {
        console.log(`Server running at http://${hostname}:${port}/`);
});