/*  UI to Join and Existing Meeting or Create a new Meeting */

import { useState } from "react";
import "./styles/Join.css";

function Join({ handleCreateMeeting, handleJoinMeeting }) {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");

  return (
    <div id="joinView">
      <div className="container">
        <div>
          <label>Name:</label>
          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            className="input-field"
            placeholder="Enter your name"
          />
        </div>

        {/* <div className="text-center font-bold">AND</div> */}

        <div>
          <label>Meeting ID</label>
          <div className="relative">
            <input
              value={roomName}
              onChange={(e) => {
                setRoomName(e.target.value);
              }}
              id="meetingId"
              type="text"
              placeholder="Meeting ID"
              className="input-field"
            />
            {/*  <button
              onClick={() => {
                handleJoinMeeting(roomName, username);
              }}
              className="button"
            >
              Join Existing Meeting
            </button> */}
          </div>
        </div>

        {/* <div className="text-center font-bold">OR</div> */}

        <div className="flex justify-center">
          <button
            onClick={() => {
              handleCreateMeeting(username);
            }}
            className="button"
          >
            Create a new meeting
          </button>
        </div>
      </div>
    </div>
  );
}

export default Join;
