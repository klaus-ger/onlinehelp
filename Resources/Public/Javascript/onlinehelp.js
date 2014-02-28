/*!
 * jQuery Cookie Plugin v1.4.0
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals.
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write
		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));

/*!
 * jQuery online Help
 *
 * Copyright 2014 Klaus Heuer t3-developer.com
 * 
 */

// Cookie funktions
// get a cookie: if($.cookie("mein Cockie") == 0){
// set a cookie:  $.cookie('myCoockie', "1"); 

// check if a chat exists
if($.cookie("chatID") != 0){
    var chatID = $.cookie("chatID");
    var username = $.cookie("username");
};

 // set update Interval if chat exists
 // @todo: make this as a funktion after first sending 
    if (chatID != null){
        setInterval(function() {
            chat.update();
        }, 2000);
    }
    
    
    
    var instanse = false;
    var state;
    var mes;
    var file;

    function Chat () {
        this.update = updateChat;
        this.send = sendChat;
        this.getState = getStateOfChat;
    }
	
    var file = chatID + '.txt';
    
    //gets the state of the chat
    function getStateOfChat() {
        if(!instanse){
            instanse = true;
            $.ajax({
                async: 'true',
                url: 'index.php',       
                type: 'POST',  
          
                data: {
                    eID: "ajaxDispatcher",   
                    request: {
                        extensionName:  'T3devOnlinehelp',
                        pluginName:     'onlinehelp',
                        controllerName: 'Chat', 
                        actionName:     'index',
                        arguments: {
                            'function': 'getState',
                            'file': file
                        }
                    } 
                },
                dataType: "json",  
            	
                success: function(data) {
                    state = data.state-10;
                    instanse = false;
                }
            });
        }	
    }

    //Updates the chat
    function updateChat() {
        if(!instanse){
            instanse = true;
            if(!ajaxLoading) {
                ajaxLoading = true;
                $.ajax({
                    async: 'true',
                    url: 'index.php',       
                    type: 'POST',  
          
                    data: {
                        eID: "ajaxDispatcher",   
                        request: {
                            extensionName:  'T3devOnlinehelp',
                            pluginName:     'onlinehelp',
                            controllerName: 'Chat', 
                            actionName:     'index',
                            arguments: {
                                'function': 'update',
                                'state': state,
                                'file': file
                            }
                        } 
                    },
                    dataType: "json",
                    success: function(data) {
                        if(data.text){
                            numItems = $('#chat-area p').length;
                            if(numItems > 10){
                                for (var i = 0; i < numItems-10; i++) {
                                    $('#chat-area p').remove();
                            
                                }
                       
                            }
                            for (var i = 0; i < data.text.length; i++) {
                                $('#chat-area').append($("<p>"+ data.text[i] +"</p>"));
                            }
                            numItems = $('#chat-area p').length;
                        
                            if(numItems > 10){
                                for (var i = 0; i < numItems-10; i++) {
                                    $('#chat-area p:lt(1)').remove();
                                }    
                            }
                            document.getElementById('chat-area').scrollTop = document.getElementById('chat-area').scrollHeight;
                        }
                        // document.getElementById('chat-area').scrollTop = document.getElementById('chat-area').scrollHeight;
                        instanse = false;
                        state = data.state;
                        ajaxLoading = false;
                    }
                });
            }
        
            else {
                setTimeout(updateChat, 1500);
            }
        }
    }
 
    //send the message
    function sendChat(message, nickname) { 
        updateChat();
        $.ajax({
            async: 'true',
            url: 'index.php',       
            type: 'POST',  
          
            data: {
                eID: "ajaxDispatcher",   
                request: {
                    extensionName:  'T3devOnlinehelp',
                    pluginName:     'onlinehelp',
                    controllerName: 'Chat', 
                    actionName:     'index',
                    arguments: {
                        'function': 'send',
                        'message': message,
                        'nickname': nickname,
                        'file': file
                    }
                } 
            },
            dataType: "json",
            success: function(data){
                updateChat();
            }
        });
    }

    
    //Updates the chat
    //if($('#jqChat').html() == 1){
    function loadChat() {
        if(!ajaxLoading) {
            ajaxLoading = true;
            if(!instanse){
                instanse = true;
                $.ajax({
                    async: 'true',
                    url: 'index.php',       
                    type: 'POST',  
          
                    data: {
                        eID: "ajaxDispatcher",   
                        request: {
                            extensionName:  'Cofo',
                            pluginName:     'user',
                            controllerName: 'Chat', 
                            actionName:     'index',
                            arguments: {
                                'function': 'load',
                                //  'state': state,
                                'file': file
                            }
                        } 
                    },
                    dataType: "json",
                    success: function(data) {
                        if(data.text){
                        
                        
                            $('#chat-area p').remove();
                        
                            for (var i = 0; i < data.text.length; i++) {
                                //data.text[i]= data.text[i].replace("[2]", "<img src='http://www.smilies.4-user.de/include/Tuzki/tuzki-smilies-124.gif' alt=''>");
                                //data.text[i]= data.text[i].replace("[1]", "<img src='http://www.smilies.4-user.de/include/Tuzki/tuzki-smilies-113.gif' alt=''>");
                                $('#chat-area').append($("<p>"+ data.text[i] +"</p>"));
                            }	
                        }
                        document.getElementById('chat-area').scrollTop = document.getElementById('chat-area').scrollHeight;
                        instanse = false;
                        state = data.state;
                        ajaxLoading = false;
                    }
                });
            }
        }
    }
   
     
    
    
    
    // ask user for name with popup prompt    
    //var name = prompt("Enter your chat name:", "Guest");
 
    // default name is 'Guest'
    if (!name || name === ' ') {
        name = $('.jqLogedInUsername').html();  
    }
    //var name = escape($('#jqLogedInUsername').html());
    var name = encodeURIComponent($('#jqLogedInUsername').html());
    //name = $('#jqLogedInUsername').html();
    // strip tags
    //name = name.replace(/(<([^>]+)>)/ig,"");
  
    // display name on page
    $("#name-area").html("You are: <span>" + name + "</span>");
  
    // kick off chat
    var chat =  new Chat();

    $(function() {
  
        chat.getState(); 
     
        // watch textarea for key presses
        $("#sendie").keydown(function(event) {  
     
            var key = event.which;  
   
            //all keys including return.  
            if (key >= 33) {
           
                var maxLength = $(this).attr("maxlength");  
                var length = this.value.length;  
             
                // don't allow new content if length is maxed out
                if (length >= maxLength) {  
                    event.preventDefault();  
                }  
            }  
        });
        // watch textarea for release of key press
        $('#sendie').keyup(function(e) {  
                
            if (e.keyCode == 13) { 
        
                var text = $(this).val();
              
                var maxLength = $(this).attr("maxlength");  
                var length = text.length; 
               
                // send 
                if (length <= maxLength + 1) { 
                    //put here the chat inititalisierung
                    chat.send(text, name);  
                    $(this).val("");
                } else {
                    $(this).val(text.substring(0, maxLength));
                }  
            }
        });
    });

