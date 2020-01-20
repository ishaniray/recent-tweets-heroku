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
    var tweetsUrls = [];
    var embeddedTweets = [];
    // Initiate your search using the above paramaters
    T.get('search/tweets', params, (err, data, response) => {
		// If there is no error, proceed
        if(err){
            return console.log(err);
        }

        // Loop through the returned tweets
        const tweetsId = data.statuses
            .map(tweet => ({ id: tweet.id_str }));
        
            
        const tweetsScreenName = data.statuses
            .map(tweet => ({ screenName: tweet.user.screen_name }));
            
        for(var i=0; i<tweetsId.length;++i) {
            var id = tweetsId[i].id;
            var username = tweetsScreenName[i].screenName;
            var buildUrl = 'https://twitter.com/'+username+'/status/'+id;
            var inputParams = {
                url: 'test'
            };
            inputParams.url = buildUrl;
            var put;
            tweetsUrls.push(buildUrl);
            put = T.get('statuses/oembed', inputParams , (err, data, response) => {
                if(err){
                    return console.log(err);
                }
                return data.html;
                
            });
            embeddedTweets.push(put);
        }
        
        console.log(embeddedTweets);
		res.render('index.ejs',{
			embeddedTweets: embeddedTweets
		});
        })
});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});

