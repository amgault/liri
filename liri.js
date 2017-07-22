const keys = require('./keys.js');
const twitter = require('twitter');
const spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');

var command = process.argv[2];
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
    var logs = '';
    // console.log(thing);
    if(command === 'do-what-it-says') {
        fs.readFile('random.txt', 'utf8', (err, data) => doWhatItSays(err, data));   
    } else if(command === 'my-tweets') {
        myTweets();
    } else if(command === 'spotify-this-song') {
        spotifyThisSong(thing);
    } else if(command === 'movie-this') {
        movieThis(thing);
    } else {
        logs += '---------------------------------------------------------------------------------------------\n';
        logs += 'You did not enter a valid command. Please enter one of the following: do-what-it-says, my-tweets, spotify-this-song, or movie-this.\n';
        logs += '---------------------------------------------------------------------------------------------\n';
        console.log(logs);
        logResponse(logs);
    }
}

// Runs the my-tweets command
function myTweets() {
    var logs = '';

    var client = new twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret,
    });

    var params = {screen_name: 'amandagualt', count: 20};
    client.get('statuses/user_timeline', params, function(err, tweets, response) {
        
        if(err) {
            logs += 'error: ' + err + '\n';
        }
        if (!err) {
            logs += '---------------------------------------------------------------------------------------------\n';
            for(var i = 0; i < tweets.length; i++) {
                logs += 'Time: ' + tweets[i].created_at + '\n'
                    + 'Tweet: ' + tweets[i].text + '\n'
                    + '---------------------------------------------------------------------------------------------\n';
            }
        }
        console.log(logs);
        logResponse(logs);
    });
}

// Runs that spotify-this-song command
function spotifyThisSong(song) {
    var logs = '';

    if(!song) {
        song = 'the sign ace of base';
    }
    var spot = new spotify({
        id: keys.spotifykeys.client_id,
        secret: keys.spotifykeys.client_secret,
    });
    
    spot.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            logs += 'Error: ' + err + '\n';
        }
        else{
            logs = 
                '---------------------------------------------------------------------------------------------\n'
                + 'Artist(s): ' + data.tracks.items[0].name + '\n' 
                + 'Song Title: ' + data.tracks.items[0].album.artists[0].name + '\n'
                + 'Album: ' + data.tracks.items[0].album.name + '\n'
                + 'Preview Link: ' +data.tracks.items[0].album.artists[0].uri + '\n'
                + '---------------------------------------------------------------------------------------------\n';
        }
        console.log(logs);
        logResponse(logs);
    });
}

// Runs the movie-this command
function movieThis(movie) {
    var logs = '';
    
    if(!movie) {
        movie = 'Mr.+Nobody';
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";

    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
            logs = 
                '---------------------------------------------------------------------------------------------\n'
                + 'Title: ' + JSON.parse(body).Title + '\n'
                + 'Release Year: ' + JSON.parse(body).Year +'\n'
                + 'IMBD Rating: ' + JSON.parse(body).imdbRating +'\n'
                + 'Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value +'\n'
                + 'Actors: ' + JSON.parse(body).Actors +'\n'
                + 'Plot: ' + JSON.parse(body).Plot +'\n'
                + 'Language: ' + JSON.parse(body).Language +'\n'
                + 'Production Country(ies): ' + JSON.parse(body).Country +'\n'
                + '---------------------------------------------------------------------------------------------\n';
            
        }
        console.log(logs);
        logResponse(logs);
    });
}

// Gets the command and thing from the text file and send them to doThis()
function doWhatItSays(err, data) {
    if (err) {
        return console.log('Error: ' + err);
    }
    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");
    // We will then re-display the content as an array for later use.
    command = dataArr[0];
    doThis(dataArr[1]);
}

// Logs the response in logfile.txt
function logResponse(response) {
    fs.appendFile('logfile.txt', response, function(err) {
        if (err) {
            console.log('Error: ' + err);
        }
    });
}