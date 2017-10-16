(function() {

    //PubNub Pub and Sub Key
    const PUB_KEY = "pub-c-xxxxxxx";
    const SUB_KEY = "sub-c-xxxxxxx";
    const KEY_LOCAL_STORAGE = 'tweets.meetup';
    const CHANNEL = 'node-red';

    pubnub = new PubNub({
        publishKey : PUB_KEY,
        subscribeKey : SUB_KEY
    });

    function _getMessages() {
        return localStorage.getItem(KEY_LOCAL_STORAGE);
    }

    function _setMessages(currentTweet) {
        try {
            messagesLocalStorage = JSON.parse(_getMessages());
            let objTweet = {
                user: currentTweet.message.msg.topic,
                payload: currentTweet.message.msg.payload
            };
            if (messagesLocalStorage && messagesLocalStorage.length) {
                messagesLocalStorage.push(objTweet);
            } else {
                messagesLocalStorage = [objTweet];
            }
            localStorage.setItem(KEY_LOCAL_STORAGE, JSON.stringify(messagesLocalStorage));
        } catch(e) {}
    }

    function _clearCardTweets() {
        $('.content-empty').html('');
    }
    
    function publishSampleMessage() {
        var publishConfig = {
            channel : "receive-msg",
            message : "Twitter recebido no back-end. Obrigado parceiro!!!!"
        }
        pubnub.publish(publishConfig, function(status, response) {
            console.log(status, response);
        });
    }
    
    pubnub.addListener({
        message: function(obj) {
            try {
                _setMessages(obj);
                _clearCardTweets();
                
                let messages = JSON.parse(_getMessages());
                messages = _.uniq(messages, 'payload');
                let len = messages.length;
                for (var x = 0; x < len; x++) {
                    let user = messages[x].user;
                    let payload = messages[x].payload;
                    $('.content-empty').prepend(`<div class="tweet-maroto"><p>${user}</p><small>${payload}</small></div>`);    
                }
                publishSampleMessage();
            } catch(e) { }
        },
        presence: function(presenceEvent) {}
    })      
    console.log("Subscribing...");
    pubnub.subscribe({
        channels: [CHANNEL] 
    });

}());