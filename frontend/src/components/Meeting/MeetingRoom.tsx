import { JitsiMeeting } from "@jitsi/react-sdk";
import { useParams } from "react-router-dom";

export default function MeetingRoom() {
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) return <div>No Room Found</div>;

  return (
    <div style={{ height: "100vh" }}>
      <JitsiMeeting
        roomName={roomId}
        getIFrameRef={(node: HTMLDivElement) => {
          node.style.height = "100%";
        }}
      />
    </div>
  );
}