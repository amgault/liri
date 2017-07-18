const keys = require('./keys.js');
const twitter = require('twitter');
const spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');

const command = process.argv[2];
var thing = '';

getThing(doThis);

// Gets all arguments passed after the command and concatenates them
function getThing(callback) {
    for(var i = 3; i < process.argv.length; i++) {
        thing += (process.argv[i] + ' ');
    }
    callback(thing);
}

// Determines which command is being called
function doThis(thing) {
    console.log(thing);
    if(command === 'do-what-it-says') {
        fs.readFile('random.txt', 'utf8', (err, data) => doWhatItSays(err, data));   
    } else if(command === 'my-tweets') {
        myTweets();
    } else if(command === 'spotify-this-song') {
        spotifyThisSong(thing);
    } else if(command === 'movie-this') {
        movieThis(thing);
    } else {
        console.log('---------------------------------------------------------------------------------------------');
        console.log('You did not enter a valid command. Please enter one of the following: do-what-it-says, my-tweets, spotify-this-song, or movie-this.');
        console.log('---------------------------------------------------------------------------------------------');
    }
}

// Runs the my-tweets command
function myTweets() {
    var client = new twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret,
    });

    var params = {screen_name: 'amandagualt', count: 20};
    client.get('statuses/user_timeline', params, function(err, tweets, response) {
        console.log("yay");
        if(err) {
            console.log('error: ' + err);
        }
        if (!err) {
            console.log('---------------------------------------------------------------------------------------------');
            for(var i = 0; i < tweets.length; i++) {
                console.log('Time: ' + tweets[i].created_at);
                console.log('Tweet: ' + tweets[i].text);
                console.log('---------------------------------------------------------------------------------------------');
            }
        }
    });
}

// Runs that spotify-this-song command
function spotifyThisSong(song) {
    if(!song) {
        song = 'the sign ace of base';
    }
    var spot = new spotify({
        id: keys.spotifykeys.client_id,
        secret: keys.spotifykeys.client_secret,
    });
    
    spot.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error: ' + err);
        }
        else{
            console.log('---------------------------------------------------------------------------------------------');
            console.log('Artist(s): ' + data.tracks.items[0].name); 
            console.log('Song Title: ' + data.tracks.items[0].album.artists[0].name);
            console.log('Album: ' + data.tracks.items[0].album.name);
            console.log('Preview Link: ' +data.tracks.items[0].album.artists[0].uri);
            console.log('---------------------------------------------------------------------------------------------');
        }
    
    });
}

// Runs the movie-this command
function movieThis(movie) {
    
    if(!movie) {
        movie = 'Mr.+Nobody';
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";

    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            console.log('---------------------------------------------------------------------------------------------');
            console.log('Title: ' + JSON.parse(body).Title);
            console.log('Release Year: ' + JSON.parse(body).Year);
            console.log('IMBD Rating: ' + JSON.parse(body).imdbRating);
            console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value);
            console.log('Actors: ' + JSON.parse(body).Actors);
            console.log('Plot: ' + JSON.parse(body).Plot);
            console.log('Language: ' + JSON.parse(body).Language);
            console.log('Production Country(ies): ' + JSON.parse(body).Country);
            console.log('---------------------------------------------------------------------------------------------');
        }
    });
}

// Gets the command and thing from the text file and send them to doThis()
function doWhatItSays(err, data) {
    if (err) {
        return console.log(err);
    }
    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");
    // We will then re-display the content as an array for later use.
    doThis(dataArr[0], dataArr[1]);
}