/**---------------------------------------------------------------------------------------
 * SCRAPER.JS
 *
 * @author:  Pattey Bleecker
 * Date:    December 9, 2016
 * For:     teamTreehouse Project 7, Build a Twitter Interface
 *
 * Use Node.js and Express to retrieve information from twitter account.
 * Use Twitter's REST API to communicate with Twitter, retrieve JSON data,
 * and display the results using an HTML template (jade). 
 *
 * This application requires a keys.js stored in src/public/js directory
 * that stores the access keys to log onto 
 * a twitter account: The format of the file is as follows:
 *		var accessKeys = {
 *    		consumerKey: 'your consumer key',
 *    		consumerSecret: 'your consumer secret',
 *    		accessToken :  'your access token',
 *    		accessSecret:  'your access secret',
 *    		screen_name: 'your screen name without the @',
 *    		name: "your screen name",
 *    		url: 'https:/**twitter.com/'
 *		};
 *
 * 		module.exports = accessKeys;
 */
'use strict';

var keys 		= require('./public/js/keys.js');
var twitter		= require('twitter');
var express 	= require('express');
var bodyParser	= require('body-parser');
var Promise 	= require('bluebird');
var moment 		= require('moment');

var app			= express();

/** Variables used to store retrieved data */
var tweets		 = {};
var friends		 = {};
var messagesRcvd = [];
var messagesSent = [];
var messages 	 = [];
/** Other variables */
var count 		 = 5;
var page;
var errorMsg	 = '';

/** Variables required for logging onto twitter account */
var client = new twitter({
	consumer_key: keys.consumerKey,
	consumer_secret: keys.consumerSecret,
	access_token_key: keys.accessToken,
	access_token_secret: keys.accessSecret
});

var params = {screen_name: keys.screen_name, count: count};

app.use('/static', express.static(__dirname + '/public'));

/** SET UP THE VIEW ENGINE */
app.set('view engine', 'jade');
app.set('views', __dirname + '/public/views');

/** ESTABLISH THE PORT */
var port = process.env.PORT || 3000;

/** ROUTE FOR OUR API */
var router = express.Router();

/** REGISTER OUR ROUTES */
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

/** OUR ROUTES */
app.get('/', function(req, res) {
	if (errorMsg === 'twitter fail') { res.redirect('/error'); }
	res.render('index', {tweets: tweets, friends: friends, messages: messages, params});
});


app.post('/', function(req, res) {
	var newTweet = req.body.tweet;
	page = res;
	client.post('statuses/update', {status: newTweet}, function(error) {
		if (!error) {
			page.redirect('/update');
		} else {
			errorMsg = 'twitter fail';
			page.redirect('/error');
		}
	}); 
});

app.get('/update', function(req, res) {
	page = res;
	getData('statuses/user_timeline', params).then( function(data) {
		tweets = data;
		tweets = getLapsedTime(tweets);
		res.render('index', {tweets: tweets, friends: friends, messages: messages});
	}).catch(function(err) {
		page.redirect(err, '/error');
	});
});

app.get('/error', function(req, res) {
	var message;
	if (errorMsg === 'twitter fail') {
		message = 'Couldn\'t connect with twitter.com';
	} else {
		message = 'Something went wrong.';
	}
	res.render('error', {message: message});
});

/** START THE Server */
app.listen(port);
console.log('Twitter interface is running on port ' + port + '...');

/** GET TIMELINE */
getData('statuses/user_timeline', params).then( function(data) {
	tweets = data;
	tweets = getLapsedTime(tweets);
}).catch( function() {
	errorMsg = 'twitter fail';
});

/** GET FRIENDS LIST */
getData('friends/list', params).then( function(data) {
	friends = data;
}).catch( function() {
	errorMsg = 'twitter fail';
});

/** GET DIRECT MESSAGES (received and sent) */
getData('direct_messages', params).then( function(data) {
	messagesRcvd = data.reverse();
	return getData('direct_messages/sent', params);
}).then(function(data) {
	messagesSent = data.reverse();
	messages = sortMessages(messagesRcvd, messagesSent);
}).catch( function() {
	errorMsg = 'twitter fail';
});

/**-------------------------------------------------------------------------------
 * FUNCTION getData()
 *
 * Promisified function that will retrieve requested data from twitter account
 * 
 * @param {string} path - the path to navigate to once we access twitter.com
 * @param {object} params - object containing screen name and # of items to retrieve
 * 
 */
function getData(path, params) {
	return new Promise(function(resolve, reject) {
		client.get(path, params, function(err, data) {
			if (err) {
				reject(err);
			} else {
				resolve(data);  
			}            
		});
	});
}

/**-------------------------------------------------------------------------------
 * FUNCTION getLapsedTime()
 *
 * Calculates the difference in time between when a message was created and now()
 * 
 * @params {array of objects} tweets - retrieved items from twitter
 * @returns tweets with updated created_at field
 * 
 */
function getLapsedTime(tweets) {
	var fmt = 'ddd MMM DD hh:mm:ss Z YYYY';
	for (var i = 0; i < tweets.length; i++) {
		tweets[i].created_at = (moment(tweets[i].created_at, fmt).fromNow());
	}
	return tweets;
}

/**-------------------------------------------------------------------------------
 * FUNCTION sortMessages()
 *
 * Sorts the messaged received and the messages sent into one array of messages,
 * in ascending order
 * 
 * @params {array of objects} rcvd - messages received by user
 * @params {array of objects} sent = messages sent by user
 * @returns list that contains all messages in order by time sent
 * 
 */
function sortMessages(rcvd, sent) {
	var fmt = 'ddd MMM DD hh:mm:ss Z YYYY';
	var i = 0, j = 0, k = 0;
	var d1 = moment().format(fmt);
	var d2 = moment().format(fmt);
	var list= [];

	while (i < rcvd.length && j < sent.length) { /** while not reached end of either msg list */
		d1 = rcvd[i].created_at;
		d2 = sent[j].created_at;
		if (moment(d1).isBefore(d2, 'seconds')) { /** push earlier message onto working list */
			list.push(rcvd[i]);
			i++;
		} else {
			list.push(sent[j]);
			j++;
		}
	}
	if (i < rcvd.length) { /** if there are still rcvd messages, push onto list */
		for(k = i; k < rcvd.length; k++) {
			list.push(rcvd[k]);
		}
	} else if (j < sent.length) { /** else push remaining sent messages */
		for(k = j; k < rcvd.length; k++) { 
			list.push(sent[k]);
		}
	}

	/** Remove the leading '0' in dates from 1 to 9 */
	for (i = 0; i < list.length; i++) {
		var timestamp = list[i].created_at;
		var date, time;
		date = list[i].created_at.slice(8,10);
		if (date.startsWith('0')) {
			date = date.slice(1);
		}
		/** Generate a timestamp that is more user-friendly */
		time = moment(list[i].created_at.slice(11,16), 'hh:mm').format('hh:mm a');
		timestamp = list[i].created_at.slice(4, 7) + ' ' + date + ', ' + list[i].created_at.slice(26);
		timestamp += ' at ' + time; 
		list[i].created_at = timestamp;
	}

	return list;
}