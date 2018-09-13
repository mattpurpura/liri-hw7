var dotenv = require("dotenv").config();
var request = require("request");
var moment = require("moment");
var Spotify = require('node-spotify-api') 

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
console.log(spotify);

var command = process.argv[2];

switch(command){
    case "concert-this":
        let artist = process.argv[3];
        console.log(artist);

        request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function(error, response, body){
            let concertInfo = JSON.parse(body);
            let venue = concertInfo[0].venue.name;
            let location = concertInfo[0].venue.city+", "+concertInfo[0].venue.country;
            let date = concertInfo[0].datetime;
            console.log(venue, location, date);
        })
        
    break;
    case "spotify-this-song":
    break;
    case "movie-this":
        let movieTitle;
        
        if (process.argv[3]===undefined){
            movieTitle = "Mr.+Nobody";
        }
        else{
            movieTitle = process.argv.splice(3).join("+");
        }

        console.log(movieTitle);

        request("http://www.omdbapi.com/?t="+movieTitle+"&y=&plot=short&apikey=trilogy", function(error, response, body){
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
    break;
    case "do-what-it-says":
    break;
}
