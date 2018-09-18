var dotenv = require("dotenv").config();
var request = require("request");
var moment = require("moment");
var Spotify = require('node-spotify-api') 
var inquirer = require("inquirer")
var fs = require("fs");

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var pastSearches = [];

fs.readFile("random.txt", "utf8", function(error, data){
    if(error){
        console.log(error);
    }
    pastSearches = data.split(",");
})

function runLiri(){
inquirer.prompt([
    {
        type: "list",
        message: "How can I help you?",
        choices: ["Find a song", "Find a movie", "Find a concert", "View Past Searches"],
        name: "greeting"
    },
        { 
            when: function(response){
                return response.greeting === "Find a movie";
            },
            type: "input", 
            message: "What movie are you looking for?",
            name: "movieTitle" 
        },
        { 
            when: function(response){
                return response.greeting === "Find a concert";
            },
            type: "input", 
            message: "What artist would you like to see live?",
            name: "artist" 
        },
        { 
            when: function(response){
                return response.greeting === "Find a song";
            },
            type: "input", 
            message: "What song would you like to hear?",
            name: "song" 
        },
        { 
            when: function(response){
                return response.greeting === "View Past Searches";
            },
            type: "list", 
            message: "Here is your search history:",
            choices: function(){
                let searchHistory = [];
                for(let i=1; i<pastSearches.length; i+=2){
                    searchHistory.push(pastSearches[i]);
                }
                return searchHistory;
            },
            name: "past" 
        },
])
.then(function(response){
var command = response.greeting
var searchTerm;
var surpriseTerm;
askLiri();
function askLiri(){
switch(command){
    case "Find a concert":
    if (response.greeting === "View Past Searches"){
        
    }
    else if(response.artist === undefined){
        searchTerm = dataArr[1];
    }
    else{
        searchTerm = response.artist;
    }
    function concertCommand(){

        request("https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp", function(error, response, body){
            let concertInfo = JSON.parse(body);
            let venue = concertInfo[0].venue.name;
            let location = concertInfo[0].venue.city+", "+concertInfo[0].venue.country;
            let date = moment(concertInfo[0].datetime).format("MM/DD/YYYY");
            console.log(venue, location, date);
        })
    }
    concertCommand();
    break;
    case "Find a song":
    if(response.greeting === "View Past Searches"){

    }
    else if(response.song === undefined){
        searchTerm = surpriseTerm;
    }
    else{
       searchTerm = response.song; 
    }
        function songCommand(){
            // console.log(songTitle);

            spotify.search({ type: 'track', query: searchTerm }, function(err, data) {
                let songData = data.tracks.items[0];
                // console.log(songData);
                let songName = songData.name;
                let songArtist = songData.artists[0].name;
                // console.log(songArtist);
                let songAlbum = songData.album.name;
                let songLink = songData.preview_url;
                if(songData.preview_url === null){
                    console.log("There is no preview link for this song")
                }
                else{
                    console.log(songLink);
                }
                
                console.log(songName, songArtist, songAlbum);
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
            });
        }   
        songCommand();
    break;
    case "Find a movie":
    if(response.greeting === "View Past Searches"){

    }
    else if(response.movieTitle === undefined){
        searchTerm = "Mr. Nobody"
    }
    else{
        searchTerm = response.movieTitle;
    }

    function movieCommand(){

        request("http://www.omdbapi.com/?t="+searchTerm+"&y=&plot=short&apikey=trilogy", function(error, response, body){
                let movieInfo = JSON.parse(body);
                let title = movieInfo.Title;
                let year = movieInfo.Year;
                let imdb = movieInfo.imdbRating;
                let rotten = movieInfo.Ratings[1];
                let country = movieInfo.Country;
                let language = movieInfo.Language;
                let plot = movieInfo.Plot;
                let actors = movieInfo.Actors;
                let allmovieData = [];
                allmovieData.push(title, year, imdb, rotten, country, language, plot, actors);
                console.log(allmovieData);
            })
        }
        movieCommand();
    break;
    case "Surprise me":
        fs.readFile("random.txt", "utf8", function(error, data){
            if (error){
                console.log(error)
            }
            let dataArr = data.split(",")
            console.log(dataArr);
            command = dataArr[0];
            surpriseTerm = dataArr[1];
            askLiri();
        })
    break;
    case "View Past Searches":
        searchTerm = response.past;
        command = pastSearches[pastSearches.indexOf(searchTerm)-1];
        askLiri();
    break;
} // ends switch case
var searchQuery = command + "," + searchTerm;

if (pastSearches.includes(searchTerm) === false){
   fs.appendFile("random.txt", ","+searchQuery, function(error){
    if(error){
        console.log(error)
    }
})//ends appendFile 
} // ends if pastSearches includes statement
} // ends askLiri function

setTimeout(anythingElse, 2000)
function anythingElse(){
    inquirer.prompt([
        {
            type: "confirm", 
            message: "Is there anything else I can help you with?",
            name:"continue"
        }
    ])
    .then(function(response){
        if(response.continue === true){
            runLiri();
        }
        else{
            console.log("Goodbye.")
        }
    }) 
}// ends anythingElse

}) //ends then after first inquirer prompt
} // ends runLiri
runLiri();