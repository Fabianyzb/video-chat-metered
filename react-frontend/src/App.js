import axios from "axios";
import { useEffect, useState } from "react";
import Join from "./Join";
import Meeting from "./Meeting";
import MeetingEnded from "./MeetingEnded";
import "./App.css"; // Asegúrate de importar el archivo CSS

const meteredMeeting = new window.Metered.Meeting();
const API_LOCATION = "http://localhost:5000";

function App() {
  const [meetingJoined, setMeetingJoined] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [remoteTracks, setRemoteTracks] = useState([]);
  const [username, setUsername] = useState("");
  const [localVideoStream, setLocalVideoStream] = useState(null);
  const [micShared, setMicShared] = useState(false);
  const [cameraShared, setCameraShared] = useState(false);
  const [screenShared, setScreenShared] = useState(false);
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [roomName, setRoomName] = useState(null);
  const [meetingInfo, setMeetingInfo] = useState({});

  useEffect(() => {
    meteredMeeting.on("remoteTrackStarted", (trackItem) => {
      remoteTracks.push(trackItem);
      setRemoteTracks([...remoteTracks]);
    });

    meteredMeeting.on("remoteTrackStopped", (trackItem) => {
      for (let i = 0; i < remoteTracks.length; i++) {
        if (trackItem.streamId === remoteTracks[i].streamId) {
          remoteTracks.splice(i, 1);
        }
      }
      setRemoteTracks([...remoteTracks]);
    });

    meteredMeeting.on("participantJoined", (localTrackItem) => {});

    meteredMeeting.on("participantLeft", (localTrackItem) => {});

    meteredMeeting.on("onlineParticipants", (onlineParticipants) => {
      setOnlineUsers([...onlineParticipants]);
    });

    meteredMeeting.on("localTrackUpdated", (item) => {
      const stream = new MediaStream(item.track);
      setLocalVideoStream(stream);
    });

    return () => {
      meteredMeeting.removeListener("remoteTrackStarted");
      meteredMeeting.removeListener("remoteTrackStopped");
      meteredMeeting.removeListener("participantJoined");
      meteredMeeting.removeListener("participantLeft");
      meteredMeeting.removeListener("onlineParticipants");
      meteredMeeting.removeListener("localTrackUpdated");
    };
  });

  async function handleCreateMeeting(username) {
    const { data } = await axios.post(API_LOCATION + "/api/create/room");
    const response = await axios.get(API_LOCATION + "/api/metered-domain");
    const METERED_DOMAIN = response.data.METERED_DOMAIN;
    const roomName = data.roomName;

    const joinResponse = await meteredMeeting.join({
      name: username,
      roomURL: METERED_DOMAIN + "/" + roomName,
    });

    setUsername(username);
    setRoomName(roomName);
    setMeetingInfo(joinResponse);
    setMeetingJoined(true);
  }

  async function handleJoinMeeting(roomName, username) {
    const response = await axios.get(
      API_LOCATION + "/api/validate-meeting?roomName=" + roomName
    );

    if (response.data.roomFound) {
      const { data } = await axios.get(API_LOCATION + "/api/metered-domain");
      const METERED_DOMAIN = data.METERED_DOMAIN;

      const joinResponse = await meteredMeeting.join({
        name: username,
        roomURL: METERED_DOMAIN + "/" + roomName,
      });

      setUsername(username);
      setRoomName(roomName);
      setMeetingInfo(joinResponse);
      setMeetingJoined(true);
    } else {
      alert("Invalid roomName");
    }
  }

  async function handleMicBtn() {
    if (micShared) {
      await meteredMeeting.stopAudio();
      setMicShared(false);
    } else {
      await meteredMeeting.startAudio();
      setMicShared(true);
    }
  }

  async function handleCameraBtn() {
    if (cameraShared) {
      await meteredMeeting.stopVideo();
      setLocalVideoStream(null);
      setCameraShared(false);
    } else {
      await meteredMeeting.startVideo();
      var stream = await meteredMeeting.getLocalVideoStream();
      setLocalVideoStream(stream);
      setCameraShared(true);
    }
  }

  async function handelScreenBtn() {
    if (!screenShared) {
      await meteredMeeting.startScreenShare();
      setScreenShared(false);
    } else {
      await meteredMeeting.stopVideo();
      setCameraShared(false);
      setScreenShared(true);
    }
  }

  async function handleLeaveBtn() {
    await meteredMeeting.leaveMeeting();
    setMeetingEnded(true);
  }

  return (
    <div className="App">
      {meetingJoined ? (
        meetingEnded ? (
          <MeetingEnded />
        ) : (
          <Meeting
            handleMicBtn={handleMicBtn}
            handleCameraBtn={handleCameraBtn}
            handelScreenBtn={handelScreenBtn}
            handleLeaveBtn={handleLeaveBtn}
            localVideoStream={localVideoStream}
            onlineUsers={onlineUsers}
            remoteTracks={remoteTracks}
            username={username}
            roomName={roomName}
            meetingInfo={meetingInfo}
          />
        )
      ) : (
        <Join
          handleCreateMeeting={handleCreateMeeting}
          handleJoinMeeting={handleJoinMeeting}
        />
      )}

      {/* Botones con Iconos */}
      <div className="control-buttons">
        <button onClick={handleMicBtn}>
          <i className={`fas fa-microphone${micShared ? "" : "-slash"}`}></i>
        </button>
        <button onClick={handleCameraBtn}>
          <i className={`fas fa-video${cameraShared ? "" : "-slash"}`}></i>
        </button>
        <button onClick={handelScreenBtn}>
          <i className="fas fa-desktop"></i>
        </button>
        <button onClick={handleLeaveBtn} className="exit-button">
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
}

export default App;
