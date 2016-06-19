const youtube = (options) => {
    if (options.unpDisableYoutube === true) {
        throw new Error('UNP disabled on youtube');
    }
    const YoutubeTrackListener = function() {};
    YoutubeTrackListener.prototype = new window.UNPCommon.WebsiteTrackListener();

    YoutubeTrackListener.prototype.isPlaying = function() {
        return typeof $('#watch7-content > meta[itemprop="name"]').attr('content') !== 'undefined';
    };

    YoutubeTrackListener.prototype.scrapPlayData = function() {
        if ($('#eow-title').find('a').length) {
            this.artistName = $('#eow-title').find('a').text();
            this.trackName = $.trim($('#eow-title').contents().filter(function() {
                return this.nodeType == Node.TEXT_NODE;
            }).text());
            const matches = this.trackName.match('^(-|\u2012|\u2013|\u2014|\u2015]|\|)');

            if (matches) {
                if (matches[0] != '') {
                    this.trackName = $.trim(this.trackName.substring(1));
                }
            }
            return true;
        }
        const play = $('#watch7-content > meta[itemprop="name"]').attr('content');
        [this.artistName, this.trackName] = window.UNPCommon.parseArtistTitle(play);
        if (!this.artistName) {
            this.artistName = $.trim($('#watch7-user-header .yt-user-info a').text());
        }
        return true;
    };

    YoutubeTrackListener.prototype.scrapAlbumArt = function() {
        const link = $('link[itemprop="thumbnailUrl"]').attr('href');
        if (link.substring(0, 4) != 'http')
            return 'https:' + link;
        return link;
    };

    YoutubeTrackListener.prototype.scrapUrl = function() {
        return $('link[itemprop="url"]').attr('href');
    };

    YoutubeTrackListener.prototype.scrapDuration = function() {
        return $('.ytp-time-duration').text();
    };

    const updateTriggerer = new window.UNPCommon.MutationObserverUpdater(new YoutubeTrackListener());
    updateTriggerer.setSelector('body');
    updateTriggerer.setNodeAttributeName('class');
    updateTriggerer.setNodeAttributeValue(new RegExp('page-loaded'));
    updateTriggerer.runOnAttr();

};

window.UNPBrowserFunc.getOptions().then(youtube);
