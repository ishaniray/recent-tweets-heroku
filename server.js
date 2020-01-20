require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http').Server(app);

const Twitter = require('twitter');
const apiKeys = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
}
const T = new Twitter(apiKeys);

const searchParams = {
    q: '#Cerner',
    count: 10,
    result_type: 'recent',  // this can be 'popular' or 'mixed'
    lang: 'en'
};

app.get('/', function(req, res) {

    T.get('search/tweets', searchParams, (err, data, response) => {
		// In case of an error, return
        if(err) {
            return console.log(err);
        }

        // Loop through the returned tweets and extract relevant information
        const tweets = data.statuses.map(tweet => ({ 
            id: tweet.id_str,
            username: tweet.user.screen_name
        }));

        var oembedParams = {};
        var embeddedTweets = [];
        var count = 0;   
            
        for(var i = 0; i < tweets.length; ++i) {        
            var id = tweets[i].id;
            var username = tweets[i].username;
            var fullUrl = `https://twitter.com/${username}/status/${id}`;
            oembedParams.url = fullUrl;

            T.get('statuses/oembed', oembedParams , (err, oembedData, response) => {
                count = count + 1;

                if(err) {
                    return console.log(err);
                }

                embeddedTweets.push(oembedData.html);

                if(count == tweets.length) {  // render index.ejs only when all callbacks but the current one have finished executing 
                    res.render('index.ejs', {
                        embeddedTweets: embeddedTweets
                    });
                }
            });
        }
    });
});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});
