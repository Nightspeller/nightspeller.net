function chooseNewStream(event) {
    event.stopPropagation();

    var previewId = $(this).parents('.streamPreview').attr('data-previewId');
    var streamChooser = $('#streamChooser');
    streamChooser.html('').append('<article id="chooseSource"><div id="twitchSource"><h1>Twitch.tv</h1><img src="img/streamViewer/logo_twitch.jpg"/></div><div id="cybergameSource"><h1>Cybergame.tv</h1><img src="img/streamViewer/logo_cybergame.jpg"/></div></article>');
//  streamChooser.html('').append('<article id="chooseSource"><div id="twitchSource"><h1>Twitch.tv</h1><img src="img/streamViewer/logo_twitch.jpg"/></div><div id="cybergameSource"><h1>Cybergame.tv</h1><img src="img/streamViewer/logo_cybergame.jpg"/></div><div id="goodgameSource"><h1>GoodGame.ru</h1><img src="img/streamViewer/logo_goodgame.png"/></div></article>');
    streamChooser.show();
    streamChooser.off('click','#twitchSource').on('click','#twitchSource', function(){
        loadGamesList(0);
    });
    streamChooser.off('click','#cybergameSource').on('click','#cybergameSource', function(){
        showAllCybergameStreams();
    });
    streamChooser.off('click','#goodgameSource').on('click','#goodgameSource', function(){
        showAllGoodgameStreams();
    });
    streamChooser.off('click','.gameCard').on('click','.gameCard', function(){
        loadStreamsList($(this).attr('data-game'), 0);
    });
    streamChooser.off('click','.streamCard').on('click','.streamCard', function(){
        addStreamToPreview(previewId, $(this).attr('data-stream'), $(this).attr('data-source'));
        streamChooser.html('').hide();
    });

    $(document).click(function(event) {
        if (streamChooser.html() !== '') {
            streamChooser.html('').hide();
        }
    });
    streamChooser.click(function(event){
        event.stopPropagation();
    });
}

function loadGamesList(page) {
    var streamChooser = $('#streamChooser');
    var gameChooser = $('<div id="gameChooser">' +
    '<div id="searchButton"><button type="button" class="btn btn-default btn-md"><span class="glyphicon glyphicon-search" aria-hidden="true"></span>Search</button></div>' +
    '<nav><span class="glyphicon glyphicon-backward" aria-hidden="true" title="Previous page"></span>' +
    '<span class="glyphicon glyphicon-forward" aria-hidden="true" title="Next page"></span>' +
    '<span class="glyphicon glyphicon-remove" aria-hidden="true" title="Close"></span></nav></div>');
    gameChooser.find('.glyphicon-remove').on('click', function(){$('#streamChooser').html('').hide();});
    gameChooser.find('.glyphicon-backward').on('click', function(){if (page !== 0) loadGamesList(page-1)});
    gameChooser.find('.glyphicon-forward').on('click', function(){loadGamesList(page+1)});
    gameChooser.find('#searchButton').find('button').on('click', showSearchResults);
    $.ajax({
        type: 'GET',
        mimeType: 'application/vnd.twitchtv.v2+json',
        dataType: 'jsonp',
        url: 'https://api.twitch.tv/kraken/games/top?limit=15&offset='+page*15
    }).done(function( data ) {
        for (var i = 0; i < data.top.length; i++) {
            var gameName = data.top[i].game.name;
            var gamelogo = data.top[i].game.box.medium;
            var gameCard = $('<div class="gameCard" data-game="' + gameName + '"><header>' + gameName + '</header><img src="' + gamelogo + '"/></div>');
            gameChooser.append(gameCard);
        }
        streamChooser.html(gameChooser).show();
    });
}

function showSearchResults() {
    var searchChooser = $('<div id="searchChooser">' +
    '<span class="glyphicon glyphicon-arrow-left" aria-hidden="true" title="Back"></span>' +
    '<div id="twitchSearch"><label>Search for game: <input id="gameSearch" type="text" /></label>' +
    '<label>Search for streamer: <input id="streamerSearch" type="text" /></label></div>' +
    '<nav><span class="glyphicon glyphicon-remove" aria-hidden="true" title="Close"></span></nav></div><div id="searchResults"></div>');
    searchChooser.find('.glyphicon-arrow-left').on('click', function(){loadGamesList(0)});
    searchChooser.find('.glyphicon-remove').on('click', function(){$('#streamChooser').html('').hide();});
    searchChooser.find('#gameSearch').on('change', function(){
        $.ajax({
            type: 'GET',
            mimeType: 'application/vnd.twitchtv.v2+json',
            dataType: 'jsonp',
            url: 'https://api.twitch.tv/kraken/search/games?q=' + $(this).val() + '&type=suggest'
        }).done(function( data ) {
            var gameCardsList = $('<div></div>');
            if (data.games.length !== 0) {
                for (var i = 0; i < data.games.length; i++) {
                    var gameName = data.games[i].name;
                    var gamelogo = data.games[i].box.medium;
                    var gameCard = $('<div class="gameCard" data-game="' + gameName + '"><header>' + gameName + '</header><img src="' + gamelogo + '"/></div>');
                    gameCardsList.append(gameCard);
                }
            } else {
                gameCardsList.append('<p>No games were found. Sorry -(</p>');
            }
            $('#streamChooser').find('#searchResults').html(gameCardsList).show();
        });
    });
    searchChooser.find('#streamerSearch').on('change', function(){
        $.ajax({
            type: 'GET',
            mimeType: 'application/vnd.twitchtv.v2+json',
            dataType: 'jsonp',
            url: 'https://api.twitch.tv/kraken/search/streams?q=' + $(this).val()
        }).done(function( data ) {
            var gameCardsList = $('<div></div>');
            if (data.streams.length !== 0) {
                for (var i = 0; i < data.streams.length; i++) {
                    var streamStatus = data.streams[i].channel.status;
                    var streamPreview = data.streams[i].preview.medium;
                    var streamName = data.streams[i].channel.name;
                    var streamCard = $('<div class="streamCard" data-stream="' + streamName + '"><header>' + streamStatus + ' (' + streamName + ') </header><img src="' + streamPreview + '"/></div>');
                    gameCardsList.append(streamCard);
                }
            } else {
                gameCardsList.append('<p>No live channels were found. Probably the one you are looking for is offline. Sorry -(</p>');
            }

            $('#streamChooser').find('#searchResults').html(gameCardsList).show();
        });
    });
    $('#streamChooser').html(searchChooser).show();
}

function loadStreamsList(game, page) {
    var channelChooser = $('<div id="channelChooser">' +
    '<span class="glyphicon glyphicon-arrow-left" aria-hidden="true" title="Back"></span>' +
    '<nav><span class="glyphicon glyphicon-backward" aria-hidden="true" title="Previous page"></span>' +
    '<span class="glyphicon glyphicon-forward" aria-hidden="true" title="Next page"></span>' +
    '<span class="glyphicon glyphicon-remove" aria-hidden="true" title="Close"></span></nav></div>');
    channelChooser.find('.glyphicon-arrow-left').on('click', function(){loadGamesList(0)});
    channelChooser.find('.glyphicon-backward').on('click', function(){if (page !== 0) loadStreamsList(game, page-1)});
    channelChooser.find('.glyphicon-forward').on('click', function(){loadStreamsList(game, page+1)});
    channelChooser.find('.glyphicon-remove').on('click', function(){$('#streamChooser').html('').hide();});
    game = escape(game);
    $.ajax({
        type: 'GET',
        mimeType: 'application/vnd.twitchtv.v2+json',
        dataType: 'jsonp',
        url: 'https://api.twitch.tv/kraken/streams?game=' + game + '&limit=12&offset=' + 12*page
    }).done(function( data ) {
        for (var i = 0; i < data.streams.length; i++) {
            var streamStatus = data.streams[i].channel.status;
            var streamPreview = data.streams[i].preview.medium;
            var streamName = data.streams[i].channel.name;
            var streamViewers = data.streams[i].viewers;
            var streamCard = $('<div class="streamCard" data-source="tw" data-stream="' + streamName + '"><header>' + streamStatus + ' (<span>' + streamName + '</span>) ' + streamViewers + ' viewers </header><img src="' + streamPreview + '"/></div>');
            channelChooser.append(streamCard);
        }
        $('#streamChooser').html(channelChooser).show();
    });
}

function addStreamToPreview(previewId, streamName, service) {
    var streamPreview = $('#streamPreview'+previewId);
    var chatElement = $('#chat'+previewId);

    var player = '<object type="application/x-shockwave-flash" data="//www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf" width="100%" height="100%" id="ember1097-flash-player" style="visibility: visible; min-height: 150px;"><param name="allowScriptAccess" value="always"><param name="allowFullScreen" value="true"><param name="wmode" value="opaque"><param name="bgcolor" value="000000"><param name="flashvars" value="id=ember1097-flash-player&amp;hide_chat=true&amp;channel='+ streamName + '&amp;embed=0&amp;auto_play=true&amp;eventsCallback=Twitch.player.FlashPlayer2.callbacks.callback0"></object>';
    if (service === 'cg') player = '<iframe src="http://api.cybergame.tv/p/embed.php?c=' + streamName + '&w=100pc&h=100pc&type=embed" width="100%" height="100%" frameborder="0"></iframe>';
    var chat = '<iframe frameborder="0" scrolling="no" id="chat_embed" src="http://twitch.tv/chat/embed?channel='+ streamName + '&amp;popout_chat=true" height="100%" width="100%"></iframe>';
    if (service === 'cg') chat = '<iframe src="http://cybergame.tv/cgchat.htm?v=b#' + streamName + '" width="100%" height="100%" frameborder="0" scrolling="no"></iframe>';
    streamPreview.find('.streamPreviewPlayer').html(player);
    chatElement.html(chat);
    if (streamPreview.hasClass('active')) {
        adjustMainStreamSize(streamPreview.attr('data-previewId'));
    }

    var search = window.location.search.split('?')[1];
    var streamIds = [];
    var state = '';
    if (search) {
        streamIds = search.split('&');
    }
    if (streamIds.length >= previewId) {
        streamIds[previewId-1] = service+'='+streamName;
    } else {
        for (var i = 0; i < 4; i++) {
            if (!streamIds[i]) {
                streamIds[i] = 'none';
            }
        }
        streamIds[previewId-1] = service+'='+streamName;
    }
    for (var i = 0; i < streamIds.length; i++) {
        state += streamIds[i]+'&';
    }
    state = state.substring(0, state.length - 1);
    window.history.pushState("", "", 'streams?'+state);
}

function showAllCybergameStreams() {
    $.ajax({
        type: 'GET',
        url: 'http://api.cybergame.tv/w/streams2.php'
    }).done(function( data ) {
        var allChannelsUrl = 'http://api.cybergame.tv/w/streams2.php?';
        for (var i = 0; i< data.length; i++) {
            allChannelsUrl += 'channels[]=' + data[i] + '&'
        }
        $.ajax({
            type: 'GET',
            url: allChannelsUrl
        }).done(function( channelsData ) {
            channelsData.sort(function(a, b){return b.viewers - a.viewers});
            showCybergamePage(channelsData, 0)

        });
    });
}

function showCybergamePage(channelsData, page) {
    var channelChooser = $('<div id="channelChooser">' +
    '<nav><span class="glyphicon glyphicon-backward" aria-hidden="true" title="Previous page"></span>' +
    '<span class="glyphicon glyphicon-forward" aria-hidden="true" title="Next page"></span>' +
    '<span class="glyphicon glyphicon-remove" aria-hidden="true" title="Close"></span></nav></div>');
    channelChooser.find('.glyphicon-backward').on('click', function(){if (page !== 0) showCybergamePage(channelsData, page-1)});
    channelChooser.find('.glyphicon-forward').on('click', function(){if (page+1 < Math.floor(channelsData.length%16)) showCybergamePage(channelsData, page+1)});
    channelChooser.find('.glyphicon-remove').on('click', function(){$('#streamChooser').html('').hide();});

    var topLimit = (page+1)*16 > channelsData.length ? channelsData.length : (page+1)*16;
    for (var i = page*16; i < topLimit ; i++) {
        var channelName = channelsData[i]['channel name'];
        var channelGame = channelsData[i].channel_game;
        var channelViewers = channelsData[i].viewers;
        var channelPreview = channelsData[i].thumbnail;

        var streamCard = $('<div class="streamCard" data-source="cg" data-stream="' + channelName + '"><header>' + channelGame + ' (<span>' + channelName + '</span>) ' + channelViewers + ' viewers</header><img src="' + channelPreview + '"/></div>');
        channelChooser.append(streamCard);
    }
    $('#streamChooser').html(channelChooser).show();
}


function showAllGoodgameStreams() {
    $.ajax({
        type: 'POST',
        dataType: 'jsonp',
        url: 'http://goodgame.ru/api/getggchannels?fmt=json'
    }).done(function( data ) {
        console.log(data);
    });
}showAllGoodgameStreams()