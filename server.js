const express = require('express');
const app = express();
const http = require('http').Server(app);

const Twitter = require('twitter');
const config = require('./config.js');
const T = new Twitter(config);

// Set up your search parameters
const params = {
    q: '#cerner',
    count: 10,
    result_type: 'recent', // this can be 'popular' or 'mixed'
    lang: 'en'
}

app.get('/', function(req, res) {
	var tweetsTest = [];
	tweetsTest.push('testing'); // will be sent to client
    // Initiate your search using the above paramaters
    T.get('search/tweets', params, (err, data, response) => {
        tweetsTest.push('testing2'); // will be sent to client
		// If there is no error, proceed
        if(err){
            return console.log(err);
        }

        // Loop through the returned tweets
        const tweetsId = data.statuses
            .map(tweet => ({ id: tweet.id_str }));

        tweetsId.map(tweetId => {
            T.post('favorites/create', tweetId, (err, response) => {
			tweetsTest.push('testing3'); // will only be sent to client if at least a link has been favorited	
            if(err){
                return console.log(err[0].message);
            }

            const username = response.user.screen_name;
            const favoritedTweetId = response.id_str;
			tweetsTest.push(`Favorited: https://twitter.com/${username}/status/${favoritedTweetId}`);
            
            });
        });
		res.render('index.ejs',{
			tweetsTest: tweetsTest
		});
        })
});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});

