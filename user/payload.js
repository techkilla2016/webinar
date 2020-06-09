var count = 0;
var admin = false;
var messageChannel;
var host = "https://techkilla.com/"
var loginURL = host + "demo/login/login.php";

var channelHandler;
var sb = new SendBird({appId: "00312373-A5E5-41D8-AF21-F993E457EBBF"});

var myid = 0;
var ousers = [];
var streamApproved = false;

$("#scene").addClass("blurBg");

$("#login100-form-btn").click(function(){
	
//	$("#tmpCard").css("opacity","1");
//	return;

  if($("#username").val() == "techkilla" && $("#pass").val() == "123")
  {
	  admin = true;
	  joinChannel("99999");
	  removeLoginForm({"uid":"99999"});
	  checkOnlineUsers();
  }
   else
   {	   
   $.ajax({
   url: loginURL + "?username=" + $("#username").val() + "&pass=" + $("#pass").val(),
   success: function (response) {
    var log = JSON.parse(response);
    
	if(log["status"] == 1)
		removeLoginForm(log);
	else if(log["status"] == 0)
		alert("Username or Password is incorrect.");
	
   }
  });
 }
  
});
	

function removeLoginForm(details)
{       
        Toast.notice("HELLO " + details.name.toUpperCase());
        if(admin == false)
		{
			for(var i=0;i<ousers.length;i++)
			{
				$("#card_" + ousers[i]).removeClass("blurBg");
			}
		}
        myid = details["uid"];
		var params = {"appID":"9f492eda476a43ceb0324c72d3e8ce57","channel":"demo","token":"0069f492eda476a43ceb0324c72d3e8ce57IACOKDAx7qiUeGUiymBKet+9vXdeIhBChX4cybtYPjyKMaDfQtYAAAAAEAB93H0FHNXGXgEAAQAa1cZe","codec":"vp8","mode":"live","uid":Number(myid)};
        rtc.params = params;       
	    join(rtc, params);
		$("#scene").removeClass("blurBg");
     	var rotate = "rotateY(180deg)";
	    var scale = "scale(0.62)";
		var tx = "translateX(" + ($("#tmpCard").position().left - 385) + "px)";
		var ty = "translateY(" + ($("#tmpCard").position().top - 90) + "px)";
	    $("#container-login100").css("transition","all 1s");
		$("scene").removeClass("blurBg");
	    $("#container-login100").css("opacity","0");
		$("#container-login100").css("transform",scale + " " + rotate);
		
		setTimeout(function(){
			$("#limiter").css("z-index","-1");
		},2500);
		
		if(admin == false)
		{
		  joinChannel(details["uid"]);
		  
		  
		}
	  
	   
}

function createCard(user,animate=false)
{
	//trace(getIndex(user.userId.trim()));
	 if(user.userId.trim() == "99999" || getIndex(user.userId.trim()) > -1 || user.connectionStatus == sb.User.OFFLINE) return;
     var card = $("#tmpCard").clone(true);
	 card.appendTo("#scene");
	 card.attr("id","card" + count);
	 card.css("display","");
	 card.attr("id","card_" + user.userId.trim());
	 card.find("#local_stream").attr("id","local_stream_" + user.userId.trim());
	
	  $.ajax({
      url: host + '/demo/helper/getUserDetails.php?uid=' + user.userId,
      success: function (response) {
      var details = JSON.parse(response);		  
	  card.find("#userImg").attr("src",host + "/demo/" + details.img);
	  card.find("#frameImg").attr("src","assets/Conference Social Media-0" + (count % 8).toString() + ".png");
	  
	  }
});

    if(animate == true)
	{
		 card.css("transform","scale(0.5) rotateY(180deg)");
	
     setTimeout(function(){	 
		 card.css("opacity","1");
		 card.css("transform","scale(1) rotateY(0deg)");
	 },50);
	 
	}else
	{
		card.css("opacity","1");
	}
	
     count++;
	 ousers.push(user.userId.trim());
	 
	 card.click(function(e){
		 
		sendMessage(e.currentTarget.id);
	 });
	 
	 if(admin == true)
	     card.addClass("blurBg");
}

function createCard2(user)
{
	if(getIndex(user.uid) > -1) return;
	
     var card = $("#tmpCard").clone(true);
	 card.appendTo("#scene");
	 card.css("display","");
	 card.attr("id","card_" + user.uid); 
	 card.find("#userImg").attr("src",host + "/demo/registration/" + user.img);
	 card.find("#frameImg").attr("src","assets/Conference Social Media-0" + (count % 8).toString() + ".png");
	 card.find("#local_stream").attr("id","local_stream_" + user.uid);
     card.css("opacity","1");
   
     count++;
	
	 ousers.push(user.uid.trim());
	 
	 card.click(function(e){
		 
		sendMessage(e.currentTarget.id);
	 });
	 
	 card.addClass("blurBg");
}

$(this).keypress(function(e)
{
	if(e.keyCode == 32)
	{
		if(messageChannel == null) return;
		
		messageChannel.sendUserMessage(id + "_0", null, null, function(message, error) {
            if (error) {
                return;
			}
       })
	}
});

function sendMessage(id)
{
	if(admin == true)
	{
		if($("#" + id).hasClass("blurBg") == true) return;
		
		sendApprovalMsg(id);
	}else if(id == "card_" + myid)
	{
		sendRequestMsg(id);
	}

}


function sendRequestMsg(id)
{
	    Toast.notice("REQUEST SENT. PLEASE WAIT.");
		messageChannel.sendUserMessage(id, null, null, function(message, error) {
            if (error) {
                return;
			}
       })
}

function sendApprovalMsg(id)
{
	messageChannel.sendUserMessage(id + "_1", null, null, function(message, error) {
            if (error) {
                return;
			}
       })
}

function joinChannel(userId)
{
 
 sb.connect(userId, function(user, error) {
    if (error) {
        return;
    }
	
	console.log("connected");
});

sb.OpenChannel.getChannel("sendbird_open_channel_7869_42580dca33bdab6513e17625cefa6f6b9358a0a3", function(openChannel, error) {
    if (error) {
        return;
    }

    openChannel.enter(function(response, error) {
        if (error) {
            return;
        }
		messageChannel = openChannel;
		console.log("entered in channel");
		var interval = setInterval(checkUsers,5000);
		
    })
	
});


channelHandler = new sb.ChannelHandler();

channelHandler.onUserEntered = function(openChannel, user) {

   var animate = (myid == user.userId.trim()) ? true : false;
   
   createCard(user,animate);
	   
};	

channelHandler.onMessageReceived = function(channel, message) {
	
	if(admin == true)
	{
		$("#" + message.message).removeClass("blurBg");
	    Toast.notice("Request Received");
	}else if(message.message == "card_" + myid + "_1")
	{
		streamApproved = true;
		publish(rtc);
		rtc.localStream.play("local_stream_" + rtc.params.uid)
	}else if(message.message == "card_" + myid + "_0")
	{
		halt();
	}
}


sb.addChannelHandler(87654321, channelHandler);

}


function checkOnlineUsers()
{
	 $.ajax({
      url: host + '/demo/helper/getOnlineUsers.php',
      success: function (response) {
		var data = JSON.parse(response).data;
		 for(var i=0;i<data.length;i++)
		 {
			 createCard2(data[i]);
		 }
		 
	  }
   });
}checkOnlineUsers();

function halt()
{
	if(streamApproved == true)
	{
	   $("#stream2").css("position","absolute");
	   
	   unpublish(rtc);
	   streamApproved = false;
	}
}

function checkUsers()
{
	
if(ousers.length == 0) return;	
	
var participantListQuery = messageChannel.createParticipantListQuery();

participantListQuery.next(function(participantList, error) {
    if (error) {
        return;
    }

	//participantList.forEach(user => removeCard(user));
	
	//trace(ousers.length);
		for(var i=0;i<ousers.length;i++)
		{
			var index = getIndex2(participantList,ousers[i])
			
			if(index < 0)
			{
				//trace(index + " , " +ousers[i] + ", " + ousers.length + "," + i);
				
				removeCard(ousers[i],i);
			}
		}

});

}

function getIndex2(array,user)
{
	for(var i=0;i<array.length;i++)
	{
		if(array[i].userId.trim() == user)
             return i;			
	}
	
	return -1;
}

function removeCard(user,index)
{	
	  var card = document.getElementById("card_" + user);
	  document.getElementById("scene").removeChild(card);
	  ousers.splice(index,1);
	  
	   $.ajax({
      url: host + '/demo/helper/setStatus.php?uid=' + user + "&status=0",
      success: function (response) {
		  trace(response);
	  }
 });
	 
}

function getIndex(id,user=null)
{
	for(var i=0;i<ousers.length;i++)
	{
		
		if(ousers[i] == id)
			return i;
	}
	
	return -1;
}


	
function trace(message)
{
console.log("<-------------------------------------------------------------->");
console.log(message);
console.log("<-------------------------------------------------------------->");
}

//------------------------------------------VIDEO CALLING------------------------------------>

console.log("agora sdk version: " + AgoraRTC.VERSION + " compatible: " + AgoraRTC.checkSystemRequirements())
var resolutions = [
      {
        name: "default",
        value: "default",
      },
      {
        name: "480p",
        value: "480p",
      },
      {
        name: "720p",
        value: "720p",
      },
      {
        name: "1080p",
        value: "1080p"
      }
    ]
    
	 //setTimeout(function(){Toast.notice("Hello World!");},1000);
	
    function Toastify (options) {
      M.toast({html: options.text, classes: options.classes})
    }

    var Toast = {
      info: (msg) => {
        Toastify({
          text: msg,
          classes: "info-toast"
        })
      },
      notice: (msg) => {
        Toastify({
          text: msg,
          classes: "notice-toast"
        })
      },
      error: (msg) => {
        Toastify({
          text: msg,
          classes: "error-toast"
        })
      }
    }
    function validator(formData, fields) {
      var keys = Object.keys(formData)
      for (let key of keys) {
        if (fields.indexOf(key) != -1) {
          if (!formData[key]) {
            Toast.error("Please Enter " + key)
            return false
          }
        }
      }
      return true
    }

    function serializeformData() {
      var formData = $("#form").serializeArray()
      var obj = {}
      for (var item of formData) {
        var key = item.name
        var val = item.value
        obj[key] = val
      }
      return obj
    }

    function addView (id, show) {
      if (!$("#" + id)[0]) {
        $("<div/>", {
          id: "remote_video_panel_" + id,
          class: "video-view",
        }).appendTo("#video")

        $("<div/>", {
          id: "remote_video_" + id,
          class: "video-placeholder",
        }).appendTo("#remote_video_panel_" + id)

        $("<div/>", {
          id: "remote_video_info_" + id,
          class: "video-profile " + (show ? "" :  "hide"),
        }).appendTo("#remote_video_panel_" + id)

        $("<div/>", {
          id: "video_autoplay_"+ id,
          class: "autoplay-fallback hide",
        }).appendTo("#remote_video_panel_" + id)
      }
    }
    function removeView (id) {
      if ($("#remote_video_panel_" + id)[0]) {
        $("#remote_video_panel_"+id).remove()
      }
    }

    function getDevices (next) {
      AgoraRTC.getDevices(function (items) {
        items.filter(function (item) {
          return ["audioinput", "videoinput"].indexOf(item.kind) !== -1
        })
        .map(function (item) {
          return {
          name: item.label,
          value: item.deviceId,
          kind: item.kind,
          }
        })
        var videos = []
        var audios = []
        for (var i = 0; i < items.length; i++) {
          var item = items[i]
          if ("videoinput" == item.kind) {
            var name = item.label
            var value = item.deviceId
            if (!name) {
              name = "camera-" + videos.length
            }
            videos.push({
              name: name,
              value: value,
              kind: item.kind
            })
          }
          if ("audioinput" == item.kind) {
            var name = item.label
            var value = item.deviceId
            if (!name) {
              name = "microphone-" + audios.length
            }
            audios.push({
              name: name,
              value: value,
              kind: item.kind
            })
          }
        }
        next({videos: videos, audios: audios})
      })
    }

    var rtc = {
      client: null,
      joined: false,
      published: false,
      localStream: null,
      remoteStreams: [],
      params: {}
    }

    function handleEvents (rtc) {
      // Occurs when an error message is reported and requires error handling.
      rtc.client.on("error", (err) => {
        console.log(err)
      })
      // Occurs when the peer user leaves the channel; for example, the peer user calls Client.leave.
      rtc.client.on("peer-leave", function (evt) {
        var id = evt.uid;
        console.log("id", evt)
        let streams = rtc.remoteStreams.filter(e => id !== e.getId())
        let peerStream = rtc.remoteStreams.find(e => id === e.getId())
        if(peerStream && peerStream.isPlaying()) {
          peerStream.stop()
        }
        rtc.remoteStreams = streams
        if (id !== rtc.params.uid) {
          removeView(id)
        }
        Toast.notice("peer leave")
        console.log("peer-leave", id)
      })
      // Occurs when the local stream is published.
      rtc.client.on("stream-published", function (evt) {
        Toast.notice("stream published success")
        console.log("stream-published")
      })
      // Occurs when the remote stream is added.
      rtc.client.on("stream-added", function (evt) {  
        var remoteStream = evt.stream
        var id = remoteStream.getId()
        Toast.info("stream-added uid: " + id)
        if (id !== rtc.params.uid) {
          rtc.client.subscribe(remoteStream, function (err) {
            console.log("stream subscribe failed", err)
          })
        }
        console.log("stream-added remote-uid: ", id)
      })
      // Occurs when a user subscribes to a remote stream.
      rtc.client.on("stream-subscribed", function (evt) {
        var remoteStream = evt.stream
        var id = remoteStream.getId()
        rtc.remoteStreams.push(remoteStream)
        //addView(id)
		
		if(admin == true)
			publish(rtc);
		
		if(streamApproved == true)
		{
			
			remoteStream.play("stream2");
			$("#stream2").css("position","relative");
			$("#stream2").insertBefore("#card_" + myid);
		}
		
		if(id != myid)
           remoteStream.play("local_stream_" + id)
	   
		
        Toast.info("stream-subscribed remote-uid: " + id)
        console.log("stream-subscribed remote-uid: ", id)
      })
      // Occurs when the remote stream is removed; for example, a peer user calls Client.unpublish.
      rtc.client.on("stream-removed", function (evt) {
        var remoteStream = evt.stream
        var id = remoteStream.getId()
        Toast.info("stream-removed uid: " + id)
        if(remoteStream.isPlaying()) {
          remoteStream.stop()
        }
        rtc.remoteStreams = rtc.remoteStreams.filter(function (stream) {
          return stream.getId() !== id
        })
        removeView(id)
        console.log("stream-removed remote-uid: ", id)
      })
      rtc.client.on("onTokenPrivilegeWillExpire", function(){
        // After requesting a new token
        // rtc.client.renewToken(token);
        Toast.info("onTokenPrivilegeWillExpire")
        console.log("onTokenPrivilegeWillExpire")
      })
      rtc.client.on("onTokenPrivilegeDidExpire", function(){
        // After requesting a new token
        // client.renewToken(token);
        Toast.info("onTokenPrivilegeDidExpire")
        console.log("onTokenPrivilegeDidExpire")
      })
    }

    /**
      * rtc: rtc object
      * option: {
      *  mode: string, "live" | "rtc"
      *  codec: string, "h264" | "vp8"
      *  appID: string
      *  channel: string, channel name
      *  uid: number
      *  token; string,
      * }
     **/
    function join (rtc, option) {
      if (rtc.joined) {
        Toast.error("Your already joined")
        return;
      }

      /**
       * A class defining the properties of the config parameter in the createClient method.
       * Note:
       *    Ensure that you do not leave mode and codec as empty.
       *    Ensure that you set these properties before calling Client.join.
       *  You could find more detail here. https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.clientconfig.html
      **/
      rtc.client = AgoraRTC.createClient({mode: option.mode, codec: option.codec})

      rtc.params = option

      // handle AgoraRTC client event
      handleEvents(rtc)

      // init client
      rtc.client.init(option.appID, function () {
        console.log("init success")

        /**
         * Joins an AgoraRTC Channel
         * This method joins an AgoraRTC channel.
         * Parameters
         * tokenOrKey: string | null
         *    Low security requirements: Pass null as the parameter value.
         *    High security requirements: Pass the string of the Token or Channel Key as the parameter value. See Use Security Keys for details.
         *  channel: string
         *    A string that provides a unique channel name for the Agora session. The length must be within 64 bytes. Supported character scopes:
         *    26 lowercase English letters a-z
         *    26 uppercase English letters A-Z
         *    10 numbers 0-9
         *    Space
         *    "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
         *  uid: number | null
         *    The user ID, an integer. Ensure this ID is unique. If you set the uid to null, the server assigns one and returns it in the onSuccess callback.
         *   Note:
         *      All users in the same channel should have the same type (number or string) of uid.
         *      If you use a number as the user ID, it should be a 32-bit unsigned integer with a value ranging from 0 to (232-1).
        **/
        rtc.client.join(option.token ? option.token : null, option.channel, option.uid ? +option.uid : null, function (uid) {
          Toast.notice("join channel: " + option.channel + " success, uid: " + uid)
          console.log("join channel: " + option.channel + " success, uid: " + uid)
          rtc.joined = true

          rtc.params.uid = uid

          // create local stream
          rtc.localStream = AgoraRTC.createStream({
            streamID: rtc.params.uid,
            audio: true,
            video: true,
            screen: false,
            microphoneId: option.microphoneId,
            cameraId: option.cameraId
          })

          // init local stream
          rtc.localStream.init(function () {
            console.log("init local stream success")
            // play stream with html element id "local_stream"
			
			
		//	if(admin == false)
        //         rtc.localStream.play("local_stream_" + rtc.params.uid)

            // publish local stream
           // publish(rtc)
		   
          }, function (err)  {
            Toast.error("stream init failed, please open console see more detail")
            console.error("init local stream failed ", err)
          })
        }, function(err) {
          Toast.error("client join failed, please open console see more detail")
          console.error("client join failed", err)
        })
      }, (err) => {
        Toast.error("client init failed, please open console see more detail")
        console.error(err)
      })
    }

    function publish (rtc) {
      if (!rtc.client) {
        Toast.error("Please Join Room First")
        return
      }
      if (rtc.published) {
        Toast.error("Your already published")
        return
      }
      var oldState = rtc.published

      // publish localStream
      rtc.client.publish(rtc.localStream, function (err) {
        rtc.published = oldState
        console.log("publish failed")
        Toast.error("publish failed")
        console.error(err)
      })
      Toast.info("publish")
      rtc.published = true
    }

    function unpublish (rtc) {
      if (!rtc.client) {
        Toast.error("Please Join Room First")
        return
      }
      if (!rtc.published) {
        Toast.error("Your didn't publish")
        return
      }
      var oldState = rtc.published
      rtc.client.unpublish(rtc.localStream, function (err) {
        rtc.published = oldState
        console.log("unpublish failed")
        Toast.error("unpublish failed")
        console.error(err)
      })
      Toast.info("unpublish")
      rtc.published = false
    }

    function leave (rtc) {
      if (!rtc.client) {
        Toast.error("Please Join First!")
        return
      }
      if (!rtc.joined) {
        Toast.error("You are not in channel")
        return
      }
      /**
       * Leaves an AgoraRTC Channel
       * This method enables a user to leave a channel.
       **/
      rtc.client.leave(function () {
        // stop stream
        if(rtc.localStream.isPlaying()) {
          rtc.localStream.stop()
        }
        // close stream
        rtc.localStream.close()
        for (let i = 0; i < rtc.remoteStreams.length; i++) {
          var stream = rtc.remoteStreams.shift()
          var id = stream.getId()
          if(stream.isPlaying()) {
            stream.stop()
          }
          removeView(id)
        }
        rtc.localStream = null
        rtc.remoteStreams = []
        rtc.client = null
        console.log("client leaves channel success")
        rtc.published = false
        rtc.joined = false
        Toast.notice("leave success")
      }, function (err) {
        console.log("channel leave failed")
        Toast.error("leave success")
        console.error(err)
      })
    }

    $(function () {
      getDevices(function (devices) {
        devices.audios.forEach(function (audio) {
          $("<option/>", {
            value: audio.value,
            text: audio.name,
          }).appendTo("#microphoneId")
        })
        devices.videos.forEach(function (video) {
          $("<option/>", {
            value: video.value,
            text: video.name,
          }).appendTo("#cameraId")
        })
        resolutions.forEach(function (resolution) {
          $("<option/>", {
            value: resolution.value,
            text: resolution.name
          }).appendTo("#cameraResolution")
        })
        M.AutoInit()
      })

      var fields = ["appID", "channel"]

      $("#join").on("click", function (e) {
        console.log("join")
        e.preventDefault()
        var params = serializeformData()
        if (validator(params, fields)) {
          join(rtc, params)
        }
      })

      $("#publish").on("click", function (e) {
        console.log("publish")
        e.preventDefault()
        var params = serializeformData()
        if (validator(params, fields)) {
          publish(rtc)
        }
      })

      $("#unpublish").on("click", function (e) {
        console.log("unpublish")
        e.preventDefault()
        var params = serializeformData()
        if (validator(params, fields)) {
          unpublish(rtc)
        }
      })

      $("#leave").on("click", function (e) {
        console.log("leave")
        e.preventDefault()
        var params = serializeformData()
        if (validator(params, fields)) {
          leave(rtc)
        }
      })
    })