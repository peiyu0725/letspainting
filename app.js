const linebot = require('linebot');
const express = require('express');
const line = require('@line/bot-sdk');
const engine = require('ejs-locals');
const path = require('path');
const bodyParser = require('body-parser');
const qs = require('qs');
const fs = require("fs");
const multer = require('multer');
const bot = linebot({
	channelId: process.env.CHANNEL_ID,
	channelSecret: process.env.CHANNEL_SECRET,
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});
const app = express();
const linebotParser = bot.parser();

console.log(linebotParser);
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// modify router use file name
app.get('/', function(req, res) {
  res.render('pages/index');
});

app.post('/linewebhook', linebotParser);

var upload = multer({ dest: 'upload/'});
var type = upload.single('file');

app.post('/fileupload', type, function (req,res) {
	console.log(req.file);

  /** When using the "single"
      data come in "req.file" regardless of the attribute "name". **/
  var tmp_path = req.file.path;
  /** The original name of the uploaded file
      stored in the variable "originalname". **/
  var target_path = 'upload/' + req.file.originalname;

  /** A better way to copy the uploaded file. **/
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  src.on('end', function() {
		var response = {
			status : true,
			image: req.file.originalname
		}
		res.end(JSON.stringify(response));
		//
		// res.render('complete');
});
  src.on('error', function(err) { res.render('error'); });
});
// app.post('/fileupload', multer(multerConfig).single('photo'), function(req, res) {
// 	console.log(req);
//
// 	// var data = { 'filename' : res.req.file.filename };
// 	// res.json({
// 	// 	status : true,
// 	// 	image: 'paint-' + new Date().getTime() + '.png',
// 	// });
//
// 	// var file = 'uploads' + '/' + req.file.originalname;
//   // fs.rename(req.file.path, file, function(err) {
//   //   if (err) {
//   //     res.send(500);
//   //   } else {
//   //     res.json({
// 	// 			status : true,
// 	// 			image: 'paint-' + new Date().getTime() + '.png',
//   //     });
//   //   }
//   // });
// 	// var body = '';
// 	// //
// 	// req.on('data', function(data) {
// 	// 	body += data;
// 	// 	if(body.length > 1e6)
// 	// 	req.connection.destroy();
// 	// });
// 	//
// 	// req.on('end', function() {
// 	// 	var post = qs.parse(body);
// 	// 	var filename = 'paint-' + new Date().getTime() + '.png';
// 	// 	// console.log(filename);
// 	// 	// saveImage(post.image, filename + '.png');
// 	// 	var response = {
// 	// 		status : true,
// 	// 		image: filename
// 	// 	}
// 	// 	res.end(JSON.stringify(response));
// 	// });
// });

const message = {
	"type": "bubble",
	"hero": {
		"type": "image",
		"url": "https://www.laprairie.co.uk/on/demandware.static/-/Library-Sites-LaPrairieSharedLibrary/default/dw7b9e971c/Editorial/39/DE03660D.jpg",
		"size": "full",
		"aspectRatio": "20:13",
		"aspectMode": "cover",
		"action": {
			"type": "uri",
			"uri": "http://linecorp.com/"
		}
	},
	"footer": {
		"type": "box",
		"layout": "vertical",
		"spacing": "sm",
		"contents": [
			{
				"type": "button",
				"style": "link",
				"height": "sm",
				"action": {
					"type": "uri",
					"label": "進入畫布",
					"uri": "line://app/1583920959-nbaeey1G"
				}
			},
			{
				"type": "spacer",
				"size": "sm"
			}
		],
		"flex": 0
	}
}


const client = new line.Client({
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});


bot.on('message', function (event) {
	// console.log(event);
	if(event.source.type === 'user') {
		// console.log('user');
		client.getProfile(event.source.userId)
		  .then((profile) => {
				sendMessage(event, profile);
		  })
		  .catch((err) => {
		    console.log(err);
		  });
	}
	else if(event.source.type === 'group') {
		// console.log('group');
		client.getGroupMemberProfile(event.source.groupId, event.source.userId)
			.then((profile) => {
				sendMessage(event, profile);
			})
			.catch((err) => {
				console.log(err);
			});
	}
	else if(event.source.type === 'room') {
		// console.log('room');
		client.getGroupMemberProfile(event.source.roomId, event.source.userId)
			.then((profile) => {
				sendMessage(event, profile);
			})
			.catch((err) => {
				console.log(err);
			});
	}
});

function sendMessage(event, profile) {
	// console.log(profile);
	if(event.message.text === '嗨' || event.message.text === '你好' || event.message.text === '安安') {
		event.reply(event.message.text + '！' + profile.displayName).then(function (data) {
			// console.log('success',data);
		}).catch(function (error) {
			console.log('Error', error);
		});
	}
	else if(event.message.text === '我要畫畫' || event.message.text === '開始畫畫') {
		event.reply([
			{
				"type": "flex",
				"altText": "維尼小畫布",
				"contents": message
			}
		]).then(function (data) {
			// console.log('succsss',data);
		}).catch(function (error) {
			console.log('Error', error);
		});
	}
	else if(event.message.text === '哈哈') {
		event.reply('笑屁XD').then(function (data) {
			// console.log('success',data);
		}).catch(function (error) {
			console.log('Error', error);
		});
	}
	else {
		event.reply(event.message.text).then(function (data) {
			// console.log('success',data);
		}).catch(function (error) {
			console.log('Error', error);
		});
	}
}


app.listen(process.env.PORT || 80, function () {
	console.log('LineBot is running.');
});
