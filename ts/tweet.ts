class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
            return "completed_event";
        }
        else if (this.text.includes("Runkeeper Live") || this.text.includes("#RKLive")) {
            return "live_event";
        }
        else if (this.text.startsWith("Achieved")) {
            return "achievement";
        }
        else {
            return "miscellaneous";
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if (this.text.includes(" - ")) { return true; }
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        let comment = this.text.split(" - ")[1].trim();
        let noURL = comment.split("https://")[0].trim();
        let noHash = noURL.split("#Runkeeper")[0].trim();
        if (noHash == "with @Runkeeper. Check it out!" || noHash == "TomTom MySports Watch") {
            return "";
        }
        return noHash;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        let match = this.text.match(/^Just (?:completed|posted) a \d+(?:\.\d+)? (?:km|mi) (.+)/);

        if (!match) { return "unknown"; }

        let activity = match[1];
        activity = activity.split("with @Runkeeper")[0];
        activity = activity.split("with Runkeeper")[0];
        activity = activity.split(" - ")[0];
        activity = activity.split(" in ")[0];
        activity = activity.split(" https://")[0];
        activity = activity.split(" #Runkeeper")[0];

        return activity.trim();
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        let match = this.text.match(/^Just (?:completed|posted) a (\d+(?:\.\d+)?) (km|mi) /);

        if (!match) { return 0; }

        let distance = parseFloat(match[1]);
        let unit = match[2];

        if (unit === "km") {
            distance = distance / 1.609;
        }

        return distance;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        let url = "https://" + this.text.split("https://")[1].split(" ")[0].trim();
        let activity = this.activityType;
        let desc = this.writtenText;
        return `<tr><td>${rowNumber}</td><td>${activity}</td><td><a href="${url}" target="_blank">${desc}</a></td></tr>`;
    }
}