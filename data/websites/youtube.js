var YoutubeTrackListener = function() {
	this.mutationObserverAttributeName = 'class';
	this.mutationObserverAttributeValue = new RegExp('page-loaded');
	this.mutationObserverElement = document.body;
};
YoutubeTrackListener.prototype = new Common.WebsiteTrackListener();

YoutubeTrackListener.prototype.isPlaying = function() {
	return typeof $('#watch7-content > meta[itemprop="name"]').attr('content') !== 'undefined';
}

YoutubeTrackListener.prototype.scrapPlayData = function() {
	if ($('#eow-title').find('a').length) {
		this.artistName = $('#eow-title').find('a').text();
		this.trackName  = $.trim($('#eow-title').contents().filter(function(){ return this.nodeType == Node.TEXT_NODE; }).text());
		var matches;

		if (matches = this.trackName.match('^(-|\u2012|\u2013|\u2014|\u2015]|\|)'))
		{
			if (matches[0] != '')
			{
				this.trackName = $.trim(this.trackName.substring(1));
			}
		}
		return true;
	}
	var play = $('#watch7-content > meta[itemprop="name"]').attr('content');
	[this.artistName, this.trackName] = Common.parseArtistTitle(play);
	return true;
}

YoutubeTrackListener.prototype.scrapAlbumArt = function() {
	var link = $('link[itemprop="thumbnailUrl"]').attr('href');
	if (link.substring(0,4) != 'http')
		return 'https:' + link;
	return link;
};

YoutubeTrackListener.prototype.scrapUrl = function() {
	return $('link[itemprop="url"]').attr('href');
}

YoutubeTrackListener.prototype.scrapDuration = function() {
	return $('.ytp-time-duration').text();
}

if (self.options.prefs.unpDisableYoutube !== true)
	Common.runTrackListenerMutationObserverAttr(new YoutubeTrackListener());