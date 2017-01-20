$(document).ready(function() {
var videoClient;
var activeRoom;
var previewMedia;
var identity;
var roomName;


if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
  alert('WebRTC is not available in your browser.');
}


window.addEventListener('beforeunload', leaveRoomIfJoined);

$.getJSON('/token', function (data) {
  identity = data.identity;


  videoClient = new Twilio.Video.Client(data.token);
  document.getElementById('room-controls').style.display = 'block';


  document.getElementById('button-join').onclick = function () {
    roomName = document.getElementById('room-name').value;
    if (roomName) {
      log("Joining room '" + roomName + "'...");

      videoClient.connect({ to: roomName}).then(roomJoined,
        function(error) {
          log('Could not connect to Twilio: ' + error.message);
        });
    } else {
      alert('Please enter a room name.');
    }
  };


  document.getElementById('button-leave').onclick = function () {
    log('Leaving room...');
    activeRoom.disconnect();
  };
});


function roomJoined(room) {
  activeRoom = room;

  log("Joined as '" + identity + "'");
  document.getElementById('button-join').style.display = 'none';
  document.getElementById('button-leave').style.display = 'inline';


  if (!previewMedia) {
    room.localParticipant.media.attach('#local-media');
  }

  room.participants.forEach(function(participant) {
    log("Already in Room: '" + participant.identity + "'");
    participant.media.attach('#remote-media');
  });


  room.on('participantConnected', function (participant) {
    log("Joining: '" + participant.identity + "'");
    participant.media.attach('#remote-media');
  });


  room.on('participantDisconnected', function (participant) {
    log("Participant '" + participant.identity + "' left the room");
    participant.media.detach();
  });


  room.on('disconnected', function () {
    log('Left');
    room.localParticipant.media.detach();
    room.participants.forEach(function(participant) {
      participant.media.detach();
    });
    activeRoom = null;
    document.getElementById('button-join').style.display = 'inline';
    document.getElementById('button-leave').style.display = 'none';
  });
}


document.getElementById('button-preview').onclick = function () {
  if (!previewMedia) {
    previewMedia = new Twilio.Video.LocalMedia();
    Twilio.Video.getUserMedia().then(
    function (mediaStream) {
      previewMedia.addStream(mediaStream);
      previewMedia.attach('#local-media');
    },
    function (error) {
      console.error('Unable to access local media', error);
      log('Unable to access Camera and Microphone');
    });
  };
};


function log(message) {
  var logDiv = document.getElementById('log');
  logDiv.innerHTML += '<p>&gt;&nbsp;' + message + '</p>';
  logDiv.scrollTop = logDiv.scrollHeight;
}

function leaveRoomIfJoined() {
  if (activeRoom) {
    activeRoom.disconnect();
  }
}
})

const Video = Twilio.Video;

const client = new Video.Client(accessToken);

const localMedia = new Video.LocalMedia();


Video.getUserMedia().then(mediaStream => {
  localMedia.addStream(mediaStream);
});


localMedia.addMicrophone().then(() => {
  return localMedia.addCamera();
});


localMedia.removeMicrophone();


localMedia.removeCamera();


localMedia.tracks.forEach(track => {
  localMedia.removeTrack(track);
});


localMedia.stop();

client.connect({
  to: 'my-room',
  localMedia: localMedia
}).then(room => {
  console.log('Connected to the Room "%s"', room.name);
}, error => {
  console.error('Failed to connect to the Room', error);
});


const localParticipant = room.localParticipant;
console.log('Connected to the Room as LocalParticipant "%s"', localParticipant.identity);


room.participants.forEach(participant => {
  console.log('Participant "%s" is connected to the Room', participant.identity);
});


room.once('participantConnected', participant => {
  console.log('Participant "%s" has connected to the Room', participant.identity);
});


room.once('participantDisconnected', participant => {
  console.log('Participant "%s" has disconnected from Room', participant.identity);
});

participant.on('trackAdded', track => {
  if (track.kind === 'audio') {
    console.log('Added an AudioTrack %s', track.id);
  } else {
    console.log('Added a VideoTrack %s', track.id);
  }
});

participant.on('trackRemoved', track => {
  if (track.kind === 'audio') {
    console.log('Removed an AudioTrack %s', track.id);
  } else {
    console.log('Removed a VideoTrack %s', track.id);
  }
});

participant.on('trackEnabled', track => {
  if (track.kind === 'audio') {
    console.log('Enabled AudioTrack %s', track.id);
  } else {
    console.log('Enabled VideoTrack %s', track.id);
  }
});

participant.on('trackDisabled', track => {
  if (track.kind === 'audio') {
    console.log('Disabled AudioTrack %s', track.id);
  } else {
    console.log('Disabled VideoTrack %s', track.id);
  }
});


participant.media.attach(document.getElementById('#my-view'));


participant.media.attach('#media-view');


const element = participant.media.attach();
document.body.appendChild(element);


participant.media.tracks.forEach(track => {
  track.attach('#track-view');
});




$.getJSON('/token', function(data) {

    console.log(data.token);


    console.log(data.identity);
});

