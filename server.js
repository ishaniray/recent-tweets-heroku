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
    
    // Initiate your search using the above paramaters
    T.get('search/tweets', params, (err, data, response) => {
        // If there is no error, proceed
        if(err){
            return console.log(err);
        }

        // Loop through the returned tweets
        const tweetsId = data.statuses
            .map(tweet => ({ id: tweet.id_str }));

        tweetsId.map(tweetId => {
            T.post('favorites/create', tweetId, (err, response) => {
            if(err){
                return console.log(err[0].message);
            }

            const username = response.user.screen_name;
            const favoritedTweetId = response.id_str;
            console.log(`Favorited: https://twitter.com/${username}/status/${favoritedTweetId}`);
            
            });
        });
        })
        res.json({name:"https://twitter.com/${username}/status/${favoritedTweetId}"})
        //res.render('index.ejs');
});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});

