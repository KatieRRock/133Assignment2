function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	let completed = tweet_array.filter(tweet => tweet.source === "completed_event").length;
	let live = tweet_array.filter(tweet => tweet.source === "live_event").length;
	let achievements = tweet_array.filter(tweet => tweet.source === "achievement").length;
	let misc = tweet_array.filter(tweet => tweet.source === "miscellaneous").length;
	let user_written = tweet_array.filter(tweet => tweet.written === true && tweet.source === "completed_event").length;
	let per_completed = (100 * completed / tweet_array.length).toFixed(2);
	let per_live = (100 * live / tweet_array.length).toFixed(2);
	let per_achievements = (100 * achievements/tweet_array.length).toFixed(2);
	let per_misc = (100 * misc/tweet_array.length).toFixed(2);
	let per_written = (100 * user_written / completed).toFixed(2);

	let first_date = tweet_array.reduce((min, tweet) => tweet.time < min ? tweet.time : min, tweet_array[0].date);
	let last_date = tweet_array.reduce((max, tweet) => tweet.time > max ? tweet.time : max, tweet_array[0].date);

	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	document.querySelectorAll('.completedEvents').forEach(element => {
		element.innerText = completed;
	});
	document.querySelector('.liveEvents').innerText = live;
	document.querySelector('.achievements').innerText = achievements;
	document.querySelector('.miscellaneous').innerText = misc;
	document.querySelector('.written').innerText = user_written;
	document.getElementById('firstDate').innerText = first_date;
	document.getElementById('lastDate').innerText = last_date;
	document.querySelector('.completedEventsPct').innerText = per_completed + "%";
	document.querySelector('.liveEventsPct').innerText = per_live + "%";
	document.querySelector('.achievementsPct').innerText = per_achievements + "%";
	document.querySelector('.miscellaneousPct').innerText = per_misc + "%";
	document.querySelector('.writtenPct').innerText = per_written + "%";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});