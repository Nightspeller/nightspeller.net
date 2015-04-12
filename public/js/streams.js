$('document').ready(function(){

    parseUrl();

    $('.glyphicon-question-sign, .glyphicon-remove-circle').on('click', function(){$('#about').toggle()});
    $('.glyphicon-import').on('click', showHideChat);
    $('.glyphicon-th-large').on('click', showAllStreamsButtonClicked);
    $('.menuButton').on('click', showHideMenu);

    var controlPanel = $(document).find('.streamPreviewControl');
    controlPanel.find('.glyphicon-plus').on('click', chooseNewStream);
    controlPanel.find('.glyphicon-refresh').on('click', refreshStream);
    controlPanel.find('.glyphicon-trash').on('click', removeStream);
    controlPanel.find('.glyphicon-share-alt').on('click', moveStreamToMain);
    controlPanel.find('.glyphicon-eye-open').hover(function(){
        if ($('.activeAllStreams').length === 0) {
            var previewId = $(this).parents('.streamPreview').attr('data-previewId');
            showPreview(previewId, 'hover');
        }
        }, hidePreview
    ).on('click', function(){
        if ($('.activeAllStreams').length === 0) {
            var previewId = $(this).parents('.streamPreview').attr('data-previewId');
            showPreview(previewId, 'click');
        }
    });

    $('#chats').find('button').on('click', function(){
        $('.chatElement').hide();
        $('#chat'+$(this).attr('data-chatButton')).show();

        $('#chats').find('button').removeClass('activeButton');
        $(this).addClass('activeButton');
    });

    window.onresize = function() {
        if ($('.active').length !== 0)
            adjustMainStreamSize($('.active').attr('data-previewId'));
    };
});

function showHideMenu() {
    $('.topHeader').toggle();
    $('#flexBox').toggleClass('fullHeight');
    adjustMainStreamSize($('.active').attr('data-previewId'));
    adjustMainStreamSize($('.active').attr('data-previewId'));
}

function showHideChat() {
    $('#chats').toggle();
    var active = $('.active');
    if (active.length !== 0) adjustMainStreamSize(active.attr('data-previewId'));
    if ($('.activeAllStreams').length !== 0 ) {
        moveAllStreamsToMain();
    }
}

function showAllStreamsButtonClicked() {
    if ($(this).hasClass('activeAllStreams')) {
        $(this).removeClass('activeAllStreams');
        $('.streamPreviewPlayer').css({position: '', top:'', left: '', width: '', height: '', 'z-index': ''});
    } else {
        $(this).addClass('activeAllStreams');
        $('.active').removeClass('active');
        $('.activePreview').removeClass('activePreview');
        moveAllStreamsToMain();
    }
}

function moveAllStreamsToMain() {
    var mainStreamContainer = $('.mainStreamContainer');
    var streamsList = $('#streamsList');
    var playerWidth = mainStreamContainer.width()/2;
    var playerHeight = mainStreamContainer.height()/2;
    for (var i = 0; i < 4; i++) {
        var streamPreview = $('#streamPreview'+(i+1));
        var streamPreviewPlayer = streamPreview.find('.streamPreviewPlayer');
        var currentTopPosition = mainStreamContainer.offset().top - streamPreview.offset().top;
        var leftPosition = streamsList.outerWidth(true);
        if (i % 2 === 1 ) {
            leftPosition += mainStreamContainer.width()/2;
        }
        var topPosition = currentTopPosition;
        if (i === 2 || i === 3) {
            topPosition += playerHeight;
        }
        streamPreviewPlayer.css({position: 'absolute', top: topPosition, left: leftPosition, width: playerWidth-1, height: playerHeight-1});
    }
}

function refreshStream() {
    var streamPreview = $(this).parents('.streamPreview');
    var streamPreviewPlayer = streamPreview.find('.streamPreviewPlayer');
    streamPreviewPlayer.html(streamPreviewPlayer.html());
    var chat = $('#chat'+streamPreview.attr('data-previewId'));
    chat.html(chat.html());
}

function showPreview(previewId, eventType) {
    var currentStreamPreview = $('#streamPreview'+previewId);
    if (currentStreamPreview.hasClass('active') !== true && currentStreamPreview.find('.streamPreviewPlayer').html() !== '') {
        if (eventType === 'click')
        {
            $('.activePreview').not(currentStreamPreview).removeClass('activePreview');
            currentStreamPreview.toggleClass('activePreview');
        }
        var mainStreamContainer = $('.mainStreamContainer');
        var streamsList = $('#streamsList');

        var currentStreamPreviewPlayer = currentStreamPreview.find('.streamPreviewPlayer');
        var currentLeftPosition = streamsList.outerWidth(true);
        var currentTopPosition = mainStreamContainer.offset().top - currentStreamPreviewPlayer.parent().offset().top;
        var previewWidth, previewHeight;
        if (mainStreamContainer.width()*0.625 >= mainStreamContainer.height()) {
            previewWidth = mainStreamContainer.width()*0.625;
            previewHeight = previewWidth*0.5625+30;
        } else {
            previewHeight = mainStreamContainer.height()*0.55;
            previewWidth = previewHeight*16/9-30;
        }
        currentStreamPreviewPlayer.css({position: 'absolute', top: currentTopPosition, left: currentLeftPosition+2, width: previewWidth, height: previewHeight, 'z-index': '3'});
        if (eventType === 'hover') currentStreamPreview.find('.streamPreviewPlayer').css({'z-index': '4'});

        if ($('.active').length !== 0) {
            var activeStreamPreviewPlayer = $('.active').find('.streamPreviewPlayer');
            var activeLeftPosition = streamsList.outerWidth(true);
            var activeTopPosition = mainStreamContainer.offset().top - activeStreamPreviewPlayer.parent().offset().top;
            var activeWidth = previewWidth;
            var activeHeight = previewHeight;
            var activeLeftShift = activeLeftPosition + mainStreamContainer.width() - activeWidth;
            var activeTopShift = activeTopPosition + mainStreamContainer.height() - activeHeight;
            activeStreamPreviewPlayer.css({position: 'absolute', top: activeTopShift-4, left: activeLeftShift-2, width: activeWidth, height: activeHeight});
        }
    }
}

function hidePreview() {
    if ($('.activeAllStreams').length === 0) {
        var anyStreamPreview = $('.streamPreview');
        anyStreamPreview.not('.active').not('.activePreview').find('.streamPreviewPlayer').css({position: '', top:'', left: '', width: '', height: '', 'z-index': ''});
        if (anyStreamPreview.hasClass('active') === true && $('.activePreview').length === 0) {
            adjustMainStreamSize($('.active').attr('data-previewId'));
        }
    }
}

function parseUrl() {
    var search = window.location.search.split('?')[1];
    if (search) {
        var streamIds = search.split('&');
        for (var i = 0; i < streamIds.length; i++) {
            if (streamIds[i] !== 'none')
                addStreamToPreview(i+1, streamIds[i].split('=')[1], streamIds[i].split('=')[0]);
        }
    }
}

function removeStream(){
    var currentStreamPreview = $(this).parents('.streamPreview');
    var previewId = currentStreamPreview.attr('data-previewId');
    var currentChat = $('#chat'+previewId);
    currentStreamPreview.find('.streamPreviewPlayer').html('');
    currentChat.html('');

    if (currentStreamPreview.hasClass('activePreview')) {
        currentStreamPreview.removeClass('activePreview');
        hidePreview();
    }

    var search = window.location.search.split('?')[1];
    if (search) {
        var state = '';
        var streamIds = search.split('&');

        streamIds[previewId-1] = 'none';
        for (var i = 0; i < streamIds.length; i++) {
            state += streamIds[i]+'&';
        }
        state = state.substring(0, state.length - 1);
        window.history.pushState("", "", 'streams?'+state);
    }
}

function moveStreamToMain(){
    if ($('.activeAllStreams').length === 0) {
        var currentStreamPreview = $(this).parents('.streamPreview');
        var previewId = currentStreamPreview.attr('data-previewId');
        if (currentStreamPreview.hasClass('active')) {
            returnStreamToPreviewList();
        } else {
            returnStreamToPreviewList();
            currentStreamPreview.removeClass('activePreview');
            currentStreamPreview.addClass('active');
            adjustMainStreamSize(previewId);
            $('#chats').find('button[data-chatButton=' + previewId + ']').click();
        }
    }
}

function adjustMainStreamSize(previewId) {
    var activePreview = $('.activePreview');
    if (activePreview.length !== 0) {
        showPreview(activePreview.attr('data-previewId'),'manual');
    } else {
        var streamPreviewPlayer = $('#streamPreview'+previewId).find('.streamPreviewPlayer');
        var mainStreamContainer = $('.mainStreamContainer');
        var streamsList = $('#streamsList');

        var leftPosition = streamsList.outerWidth(true);
        var topPosition = mainStreamContainer.offset().top - streamPreviewPlayer.parent().offset().top;
        streamPreviewPlayer.css({position: 'absolute', top: topPosition, left: leftPosition+2, width: mainStreamContainer.width()-3, height: mainStreamContainer.height()-3, 'z-index': ''});
    }
}

function returnStreamToPreviewList() {
    var active = $('.active');
    if (active.length !== 0) {
        active.find('.streamPreviewPlayer').css({position: '', top:'', left: '', width: '', height: ''});
        active.removeClass('active');
    }
}