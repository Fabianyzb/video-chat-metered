/* Main container of the application */

import { useEffect, useState } from "react";
import Join from "./Join";
import Meeting from "./Meeting";

// Initializing the SDK
const meteredMeeting = new window.Metered.Meeting();

function App() {
  // Will set it to true when the user joins the meeting
  // and update the UI.
  const [meetingJoined, setMeetingJoined] = useState(false);
  // Storing onlineUsers, updating this when a user joins
  // or leaves the meeting
  const [onlineUsers, setOnlineUsers] = useState([]);

  // This useEffect hooks will contain all
  // event handler, like participantJoined, participantLeft etc.
  useEffect(() => {}, []);

  // Will call the API to create a new
  // room and join the user.
  async function handleCreateMeeting(username) {
    // Calling API to create room
    const { data } = await axios.post(API_LOCATION + "/api/create/room");
    // Calling API to fetch Metered Domain
    const response = await axios.get(API_LOCATION + "/api/metered-domain");
    // Extracting Metered Domain and Room Name
    // From responses.
    const METERED_DOMAIN = response.data.METERED_DOMAIN;
    const roomName = data.roomName;

    // Calling the join() of Metered SDK
    const joinResponse = await meteredMeeting.join({
      name: username,
      roomURL: METERED_DOMAIN + "/" + roomName,
    });

    // Updating the state meetingJoined to true
    setMeetingJoined(true);
  }

  // Will call th API to validate the room
  // and join the user
  function handleJoinMeeting(roomName, username) {}

  return (
    <div className="App">
      {meetingJoined ? (
        <Meeting onlineUsers={onlineUsers} />
      ) : (
        <Join
          handleCreateMeeting={handleCreateMeeting}
          handleJoinMeeting={handleJoinMeeting}
        />
      )}
    </div>
  );
}

export default App;
