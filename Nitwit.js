const config = require('./config.js');
const editJsonFile = require('edit-json-file');
const Twitter = require('twitter');

const T = new Twitter(config);

const tweetOutFromList = (
	filePath = config.quotes_file_path,
	callback = function tweeter(tweet) {
		T.post('statuses/update', { status: tweet }, responseCallback);
	}
) => {
	let fileTweets = editJsonFile(filePath, {
		autosave: true,
	});

	let tweets = fileTweets.data.tweets;

	if (tweets) {
		callback(tweets.shift());
		fileTweets.set('tweets', tweets);
	} else {
		console.log('No quotes');
	}
};

const respondTweet = (
	task = 'favorites/create',
	filePath = config.quotes_file_path,
	responseValues = extractResponseValues(filePath),
	params = {
		q: extractQuery(responseValues),
		count: Math.floor(Math.random() * 10) + 1,
		result_type: 'recent',
		lang: 'en',
	}
) => {
	T.get('search/tweets', params, function(err, data, response) {
		if (!err) {
			data.statuses.forEach(tweet => {
				let apiParams = { id: tweet.id_str };
				if (task !== 'favorites/create') {
					apiParams = {
						status:
							'@' +
							tweet.user.screen_name +
							' ' +
							responseValues.tweetResponses[
								Math.floor(Math.random() * responseValues.tweetResponses.length)
							],
						in_reply_to_status_id: tweet.id_str,
					};
				}
				if (!config.blackList.includes(tweet.user.screen_name)) {
					T.post(task, apiParams, responseCallback);
				} else {
					console.log('User ', tweet.user.screen_name, ' is blacklisted and will not be processed');
				}
			});
		} else {
			console.log(err);
		}
	});
};

const extractResponseValues = filePath => {
	let fileTweets = editJsonFile(filePath, {
		autosave: true,
	});
	const responseValues = {
		topicsList: fileTweets.data.topics,
		tweetResponses: fileTweets.data.responses,
	};
	return responseValues;
};

const extractQuery = responseValues => {
	return responseValues.topicsList[Math.floor(Math.random() * responseValues.topicsList.length)];
};

const responseCallback = (err, data) => {
	if (err) console.log('error : ', err);
	else console.log('Success : ' + data.text);
};

module.exports = {
	respondTweet: respondTweet,
	tweetOutFromList: tweetOutFromList,
};
