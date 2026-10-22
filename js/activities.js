function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	tweet_array.forEach(tweet => {
		if (tweet.activityType.includes("http") ||
			tweet.activityType.includes("#") ||
			tweet.activityType.includes("@")) {
			console.log(tweet.activityType, tweet);
		}
	});

	let activities = tweet_array.map(tweet => tweet.activityType);
	let activityCount = activities.reduce((counts, activity) => {
		if (activity !== "unknown") {
			counts[activity] = (counts[activity] || 0) + 1;
		}
		return counts;
	}, {});

	let graphData = Object.entries(activityCount).map(([activity, count]) => ({
		activity: activity,
		count: count
	}))

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": graphData
	  },
	  "mark": "bar",
	  "encoding": {
		"x": {
			"field": "activity",
			"type": "nominal",
			"title": "Activity Type"
		},
		"y": {
			"field": "count",
			"type": "quantitative",
			"title": "Number of Tweets"
		}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	let top3 = Object.entries(activityCount).sort((a,b) => b[1]-a[1]).slice(0, 3).map(entry => entry[0]);
	let topTweets = tweet_array.filter(tweet => top3.includes(tweet.activityType));
	let topGraph = topTweets.map(tweet => ({
		activity: tweet.activityType,
		day: tweet.time.toLocaleDateString("en-US", {weekday: "long"}),
		distance: tweet.distance,
	}));

	let top_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Average distance by activity and day of the week",
		"data": {
			"values": topGraph
		},
		"mark": "bar",
		"encoding": {
			"x": {
				"field": "day",
				"type": "ordinal",
				"sort": [
					"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
				],
				"title": "Day of the Week"
			},
			"y": {
				"field": "distance",
				"type": "quantitative",
				"aggregate": "mean",
				"title": "Average Distance (miles)"
			},
			"color": {
				"field": "activity",
				"type": "nominal",
				"title": "Activity"
			},
			"xOffset": {
				"field": "activity"
			}
		}
	}
	vegaEmbed('#distanceVisAggregated', top_vis_spec, {actions: false});

	let distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"data": {
			"values": topGraph
		},
		"mark": "point",
		"encoding": {
			"x": {
				"field": "day",
				"type": "ordinal",
				"sort": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
			},
			"y":
			{
				"field": "distance",
				"type": "quantitative",
				"title": "Distance (miles)"
			},
			"color": {
				"field": "activity",
				"type": "nominal"
			}
		}
	}
	vegaEmbed('#distanceVis', distance_vis_spec, {actions: false});

	let activityAverages = top3.map(activity => {
		let distances = topGraph.filter(tweet => tweet.activity === activity).map(tweet => tweet.distance).filter(distance => Number.isFinite(distance) && distance > 0);
		let total = distances.reduce((sum, distance) => sum + distance, 0);
		return {
			activity: activity,
			average: distances.length ? total / distances.length : 0
		}
	})

	activityAverages.sort((a, b) => b.average - a.average);

	let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

	let weekdayDistances = topGraph.filter(tweet => weekdays.includes(tweet.day)).map(tweet => tweet.distance).filter(distance => Number.isFinite(distance) && distance > 0);
	let weekendDistances = topGraph.filter(tweet => !weekdays.includes(tweet.day)).map(tweet => tweet.distance).filter(distance => Number.isFinite(distance) && distance > 0);

	let weekdayAvg = weekdayDistances.reduce((sum, distance) => sum + distance, 0) / weekdayDistances.length;
	let weekendAvg = weekendDistances.reduce((sum, distance) => sum + distance, 0) / weekendDistances.length;

	let longerPeriod = weekdayAvg > weekendAvg ? "weekdays" : "weekends";

	document.getElementById('numberActivities').innerText = Object.keys(activityCount).length;
	document.getElementById('firstMost').innerText = top3[0];
	document.getElementById('secondMost').innerText = top3[1];
	document.getElementById('thirdMost').innerText = top3[2];
	document.getElementById('longestActivityType').innerText = activityAverages[0].activity;
	document.getElementById('shortestActivityType').innerText = activityAverages[activityAverages.length-1].activity;
	document.getElementById('weekdayOrWeekendLonger').innerText = longerPeriod;

	let button = document.getElementById('aggregate');
	let individualGraph = document.getElementById('distanceVis');
	let avgGraph = document.getElementById('distanceVisAggregated');

	avgGraph.style.display = "none";

	let showingMeans = false;

	button.addEventListener("click", function() {
		showingMeans = !showingMeans;
		
		if (showingMeans) {
			individualGraph.style.display = "none";
			avgGraph.style.display = "block";
			button.innerText = "Show individual distances";
		} else {
			individualGraph.style.display = "block";
			avgGraph.style.display = "none";
			button.innerText = "Show means";
		}
	});

	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
