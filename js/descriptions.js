
function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(tweet => new Tweet(tweet.text, tweet.created_at)).filter(tweet => tweet.written);
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	let searchBox = document.getElementById('textFilter')
	document.getElementById('searchCount').innerText = 0;
	document.getElementById('searchText').innerText = "";

	searchBox.addEventListener("input", function() {
		let searchText = searchBox.value.toLowerCase();
		let matches = []
		if (searchText !== "") {
			matches = tweet_array.filter(tweet => tweet.writtenText.toLowerCase().includes(searchText));
		}
		
		document.getElementById('searchCount').innerText = matches.length;
		document.getElementById('searchText').innerText = searchText;
		document.getElementById('tweetTable').innerHTML = matches.map((tweet, index) => tweet.getHTMLTableRow(index + 1)).join("");
	});

	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});