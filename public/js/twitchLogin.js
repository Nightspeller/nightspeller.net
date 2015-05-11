$('document').ready(function(){
    Twitch.init({clientId: 'aoj81mhxdidmwxqw05lm73wt7s2p3sg'}, function(error, status) {
        if (error) {
            console.log(error);
        }

         if (!status.authenticated) {
             Twitch.login({
                 scope: ['chat_login']
             });
         } else {
             document.location.href = document.location.href+'#token='+status.token;
         }

        Twitch.api({method: 'oauth2/token'}, function(error, data) {
            console.log(data);
        });

        console.log(error, status);
    });

});