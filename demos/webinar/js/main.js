
$(".messages").animate({ scrollTop: $(document).height() }, "fast");

$("#profile-img").click(function() {
  $("#status-options").toggleClass("active");
});

$(".expand-button").click(function() {
  $("#profile").toggleClass("expanded");
  $("#contacts").toggleClass("expanded");
});

$("#status-options ul li").click(function() {
  $("#profile-img").removeClass();
  $("#status-online").removeClass("active");
  $("#status-away").removeClass("active");
  $("#status-busy").removeClass("active");
  $("#status-offline").removeClass("active");
  $(this).addClass("active");

  if($("#status-online").hasClass("active")) {
    $("#profile-img").addClass("online");
  } else if ($("#status-away").hasClass("active")) {
    $("#profile-img").addClass("away");
  } else if ($("#status-busy").hasClass("active")) {
    $("#profile-img").addClass("busy");
  } else if ($("#status-offline").hasClass("active")) {
    $("#profile-img").addClass("offline");
  } else {
    $("#profile-img").removeClass();
  };

  $("#status-options").removeClass("active");
});

function newMessage() {
  message = $(".message-input input").val();
  if($.trim(message) == '') {
    return false;
  }
  $('<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
  $('.message-input input').val(null);
  $('.contact.active .preview').html('<span>You: </span>' + message);
  $(".messages").animate({ scrollTop: $(document).height() }, "fast");
};

$('.submit').click(function() {
  newMessage();
});

$(window).on('keydown', function(e) {
  if (e.which == 13) {
    newMessage();
    return false;
  }
});


if(Cookies.get("webnier-login") == undefined)
{
  window.location.replace("../login/index.html");
}

var user_details;

try {
  //console.log(Cookies.get("webnier-login"));
  user_details = JSON.parse(Cookies.get("webnier-login"));
  console.log(user_details);
} catch (e) {
  console.log("Error while parsing json");

}

function createUserDivElement(name,id)
{
   var newUser = $("#user").clone().appendTo("#userList");
   newUser.css("display","");
   newUser.attr("id","user_" + id);
   newUser.children().children().children().text(name);

}

function sendVideoRequest(e)
{
  connection.peers['techkilladmin'].addStream({
    video: true,
    audio: true,
    oneway: true
});


}

var connection = new RTCMultiConnection();



var _type = "user";
if(user_details.name == "Ashish Kumar")
      type = "keynotePresenter";
//connection.autoCloseEntireSession = true;
connection.dontCaptureUserMedia = true;
var stream = connection.getRemoteStreams('techkillahost');

connection.socketURL = "/";

connection.session = {
  data : true,
  oneway : true
}

connection.socketCustomEvent = 'onNewUser';


  $("#profileName").text(user_details.name);
 //connection.userid = user_details.uid;
 connection.extra = {
   uniqueId:user_details.uid,
   fullName:user_details.name,
   type:_type
 };


 connection.join("techkilla",function(isJoinedRoom, roomid, error)
 {
      if(error)
      {
           if(error === connection.errors.ROOM_NOT_AVAILABLE)
           {
               alert("STREAM NOT AVAILABLE");
               return;
          }
      }

    connection.socket.emit(connection.socketCustomEvent,{"userid":connection.userid,"extra":connection.extra});
         setTimeout(getAllUsers,1000);

 });

 function getAllUsers()
 {
   connection.getAllParticipants().forEach(function(participantId) {
    var user = connection.peers[participantId];

    if(user.userid === "techkillahost" || user.userid === "techkilladmin" || user.userid == "techkilladmin2") return;

    var fullName = user.extra.fullName;
    //var addButton = user.extra.uniqueId == user_details.uid ? true : false;
    createUserDivElement(fullName,user.userId);
  });

 }

   connection.onstream = function(event) {

      if (event.type === 'local')
           return;

    console.log(event.stream);
    var video = document.getElementById("video");
    video.srcObject = event.stream;
    video.width = innerWidth - 20;
    video.height = innerHeight - 20;

    setTimeout(function(){
      video.play();
    },1000);
 };

 connection.socket.on(connection.socketCustomEvent, function(user) {

   if(user.userid === "techkillahost" || user.userid === "techkilladmin" || user.userid == "techkilladmin2") return;

   createUserDivElement(user.extra.fullName,user.userid);
});

 connection.onleave = function(event) {
    var remoteUserId = event.userid;

    if(remoteUserId == "techkillahost" || remoteUserId == "techkilladmin") return;

    $("#user_" + event.userid).remove();
  };


$("#askButton").click(function(){

 $("#askButton").addClass("noHover");
 connection.send({"type":"request","id":"0"});

  Toastnotify.create({
  text:"Request has been sent. Please wait.",
  type:'success',
  important:true,
  animationIn:'fadeInLeft',
  animationOut:'fadeOutLeft'
});

});


$("#leaveButton").click(function(){

Cookies.remove("webnier-login");
window.location.replace("../login/index.html");

});

connection.onmessage = function(event) {
    var chatMesssge = event.data;

   if(event.data.type == "reset")
   {
     $("#askButton").removeClass("noHover");
     return;
   }

    if(event.data.type != "approval" || event.data.id != "item_"+connection.userid) return;

    Toastnotify.create({
    text:"Request has been Accepted. Now you can ask.",
    type:'success',
    important:true,
    animationIn:'fadeInLeft',
    animationOut:'fadeOutLeft'
  });

  connection.peers['techkilladmin'].addStream({
    video: true,
    audio: true,
    oneway: true
  });
};
