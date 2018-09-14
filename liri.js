var dotenv = require("dotenv").config();
var request = require("request");
var moment = require("moment");
var Spotify = require('node-spotify-api') 
var fs = require("fs");

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
console.log(spotify);

var command = process.argv[2];
var searchTerm = process.argv.splice(3).join(" ");

askLiri();

function askLiri(){
switch(command){
    case "concert-this":
    function concertCommand(){

        request("https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp", function(error, response, body){
            let concertInfo = JSON.parse(body);
            let venue = concertInfo[0].venue.name;
            let location = concertInfo[0].venue.city+", "+concertInfo[0].venue.country;
            let date = concertInfo[0].datetime;
            console.log(venue, location, date);
        })
    }
    concertCommand();
    break;
    case "spotify-this-song":
        function songCommand(){
            // console.log(songTitle);

            spotify.search({ type: 'track', query: searchTerm }, function(err, data) {
                let songData = data.tracks.items[0];
                // console.log(songData);
                let songName = songData.name;
                let songArtist = songData.artists[0].name;
                // console.log(songArtist);
                let songAlbum = songData.album.name;
                let songLink = songData.href;
                console.log(songLink);
                console.log(songName, songArtist, songAlbum);
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
            });
        }   
        songCommand();
    break;
    case "movie-this":
    function movieCommand(){

        if (process.argv[3]===undefined){
            searchTerm = "Mr.+Nobody";
        }


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
        +
        6./8*9/3
    break;
    case "do-what-it-says":
        fs.readFile("random.txt", "utf8", function(error, data){
            if (error){
                console.log(error)
            }
            let dataArr = data.split(",")
            console.log(dataArr);
            command = dataArr[0];
            searchTerm = dataArr[1];
            askLiri();
        })
    break;
}
}
