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

//createUserDivElement(user_details.name,true);

function createUserDivElement(name,button=false)
{
  var element = document.getElementById("userdiv").cloneNode(true);
  element.id = "user" + name;
  element.style.display = "";
  element.childNodes[1].innerHTML = name;

  if(button == true)
  {
      element.childNodes[3].onclick = sendVideoRequest;
  }else {

      element.childNodes[3].style.display = "none";
  }
  document.getElementById("userlist").appendChild(element);
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
//connection.autoCloseEntireSession = true;
connection.dontCaptureUserMedia = true;
var stream = connection.getRemoteStreams('techkilla-host');

connection.socketURL = "/";


 //connection.userid = user_details.uid;
 connection.extra = {
   uniqueId:user_details.uid,
   fullName:user_details.name

 };


 connection.join("techkilla",function(isJoinedRoom, roomid, error)
 {
      if(error)
      {
           if(error === connection.errors.ROOM_NOT_AVAILABLE)
               alert("STREAM NOT AVAILABLE");
      }


         setTimeout(getAllUsers,1000);

 });

 function getAllUsers()
 {
   connection.getAllParticipants().forEach(function(participantId) {
    var user = connection.peers[participantId];

    if(user.userid === "techkillahost" || user.userid === "techkilladmin") return;

    var fullName = user.extra.fullName;
    //var addButton = user.extra.uniqueId == user_details.uid ? true : false;
    createUserDivElement(fullName);
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
