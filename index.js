// Reference: https://www.npmjs.com/package/spotify-web-api-node

const express = require('express');
const app = express();
const spotify = require('spotify-web-api-node');

const spotifyApi = new spotify({
    clientId: '96a7a21f8e7a446bb6217a10af4c2f13',
    clientSecret: '7118d278b4d748dc8dd78fbfa6cb9bd0',
    redirectUri: 'http://localhost:8080/callback'
})

app.get('/:artistName/:trackName', (req, res) => {
    spotifyApi.clientCredentialsGrant().then(
        function (data) {
            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.searchTracks(`track:${req.params.trackName.replace('_', ' ')} artist: ${req.params.artistName.replace('_', ' ')}`)
                .then(function (data) {
                    if (data === null) {
                        res.status(404).json({
                            'Error': 'The track/artist was not found on Spotify'
                        })
                    } else {
                        res.status(200).json({
                            "name": data.body.tracks.items[0].name,
                            "artist": data.body.tracks.items[0].artists[0].name,
                            "release_date": data.body.tracks.items[0].album.release_date,
                            "popularity": data.body.tracks.items[0].popularity
                        })
                    }
                }, function (err) {
                    console.log('Something went wrong!', err);
                });
        },
        function (err) {
            console.log('Something went wrong when retrieving an access token', err);
        }
    );
})

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});