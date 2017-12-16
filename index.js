var chromecastPlayer = require('chromecast-player');
var express = require('express');
var querystring = require('querystring');
var tts = require('voice-rss-tts');

require('dotenv').config();
var app = express();


// Endpoint to produce MP3 with the text query string parameter
app.get('/tts.mp3', function (req, res) {
    tts.speech({
        key: process.env.VOICERSS_KEY,
        hl: 'en-us',
        src: req.query.text,
        r: 0,
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false,
        b64: false,
        callback: function (error, content) {
			if (error) {
			  res.status(500).send(error);
			} else {
              res.send(content);
			}
        }
    });
});

// Endpoint which speaks the text query string parameter
var player = chromecastPlayer();
app.get('/speak', function(req, res) {
  var media = req.protocol + '://' + req.get('host') + '/tts.mp3?text=' +
              querystring.escape(req.query.text);
  player.launch(media, function(err, p) {
    if (err) {
	  res.status(500).send('Error playing notification.');
	}
    p.once('playing', function() {
      res.send('Notification sent.');
    });
  });
});

app.listen(process.env.port || 3000);