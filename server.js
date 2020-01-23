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

app.get('/favicon.ico', (req, res) => res.sendStatus(204)); // No content

app.get('/:parameters?', function(req, res) {  // '?' indicates the hashtag param is optional

    const searchParams = {
        count: 10,
        lang: 'en'
    };

    var searchedParams = `${req.params.parameters}`;

    if(req.params.parameters == undefined) {
        searchParams.q = '#Cerner';
        searchParams.result_type = 'recent';
    } else {
        var splitSearchedParams = searchedParams.split("-");
        var hashtag = splitSearchedParams[0];
        var type = splitSearchedParams[1];

        searchParams.result_type = type;
        searchParams.q = `#${hashtag}`;
    }

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
                    const uniqueEmbeddedTweets = new Set(embeddedTweets);
                    res.render('index.ejs', {
                        embeddedTweets: uniqueEmbeddedTweets,
                        searchParams: searchParams
                    });
                }
            });
        }
    });
});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});
