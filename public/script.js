$(document).ready(function() {
var videoClient;
var activeRoom;
var previewMedia;
var identity;
var roomName;

// Check for WebRTC
if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
  alert('WebRTC is not available in your browser.');
}

// When we are about to transition away from this page, disconnect
// from the room, if joined.
window.addEventListener('beforeunload', leaveRoomIfJoined);

$.getJSON('/token', function (data) {
  identity = data.identity;

  // Create a Video Client and connect to Twilio
  videoClient = new Twilio.Video.Client(data.token);
  document.getElementById('room-controls').style.display = 'block';

  // Bind button to join room
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

  // Bind button to leave room
  document.getElementById('button-leave').onclick = function () {
    log('Leaving room...');
    activeRoom.disconnect();
  };
});

// Successfully connected!
function roomJoined(room) {
  activeRoom = room;

  log("Joined as '" + identity + "'");
  document.getElementById('button-join').style.display = 'none';
  document.getElementById('button-leave').style.display = 'inline';

  // Draw local video, if not already previewing
  if (!previewMedia) {
    room.localParticipant.media.attach('#local-media');
  }

  room.participants.forEach(function(participant) {
    log("Already in Room: '" + participant.identity + "'");
    participant.media.attach('#remote-media');
  });

  // When a participant joins, draw their video on screen
  room.on('participantConnected', function (participant) {
    log("Joining: '" + participant.identity + "'");
    participant.media.attach('#remote-media');
  });

  // When a participant disconnects, note in log
  room.on('participantDisconnected', function (participant) {
    log("Participant '" + participant.identity + "' left the room");
    participant.media.detach();
  });

  // When we are disconnected, stop capturing local video
  // Also remove media for all remote participants
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

//  Local video preview
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

// Activity log
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

// You can call getUserMedia and add the resulting MediaStream to localMedia.
Video.getUserMedia().then(mediaStream => {
  localMedia.addStream(mediaStream);
});

// Or you can add the microphone and camera independently.
localMedia.addMicrophone().then(() => {
  return localMedia.addCamera();
});

// Remove the microphone.
localMedia.removeMicrophone();

// Remove the camera.
localMedia.removeCamera();

// Remove any tracks on the localMedia.
localMedia.tracks.forEach(track => {
  localMedia.removeTrack(track);
});

// Stop localMedia and all Tracks on it.
localMedia.stop();

client.connect({
  to: 'my-room',
  localMedia: localMedia
}).then(room => {
  console.log('Connected to the Room "%s"', room.name);
}, error => {
  console.error('Failed to connect to the Room', error);
});

// Log your Client's LocalParticipant in the Room
const localParticipant = room.localParticipant;
console.log('Connected to the Room as LocalParticipant "%s"', localParticipant.identity);

// Log any Participants already connected to the Room
room.participants.forEach(participant => {
  console.log('Participant "%s" is connected to the Room', participant.identity);
});

// Log new Participants as they connect to the Room
room.once('participantConnected', participant => {
  console.log('Participant "%s" has connected to the Room', participant.identity);
});

// Log Participants as they disconnect from the Room
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

// You can attach a Participant's Media directly to a DOM element,
participant.media.attach(document.getElementById('#my-view'));

// You can pass the query selector directly,
participant.media.attach('#media-view');

// Or you can create a default element.
const element = participant.media.attach();
document.body.appendChild(element);

// In all three of these scenarios, as Tracks are added and removed, the
// attached element will be updated with the appropriate <audio> and <video>
// tags. If you would like to manage Track attachment yourself, you can always
// attach them manually. For example,
participant.media.tracks.forEach(track => {
  track.attach('#track-view');
});



// We use jQuery to make an Ajax request to the server to retrieve our
// Access Token
$.getJSON('/token', function(data) {
    // The data sent back from the server should contain a long string - this is
    // the JWT token you need to initialize the SDK. Read more about JWT
    // (JSON Web Token) at http://jwt.io
    console.log(data.token);

    // Since the quickstart app doesn't implement authentication, the server
    // sends back a randomly generated username for the current client, which is
    // how they will be identified when sending and receiving Conversation
    // invites. If your app has an existing authentication system, you can use
    // the e-mail address or username that uniquely identifies a user instead.
    console.log(data.identity);
});

