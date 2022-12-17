export const ClientToServerEventType = {
  hostCreateRoom: "host-create-room",
  joinRoom: "join-room",
  leaveRoom: "leave-room",
  hostStartSlide: "host-start-slide",
  hostStopPresentation: "host-stop-presentation",
  memberVote: "member-vote",
};

export const ServerToClientEventType = {
  waitHostCreateRoom: "wait-host-create-room",
  waitJoinRoom: "wait-join-room",
  waitInRoom: "wait-in-room",
  privateMessage: "private-message",
};

export const WaitInRoomType = {
  info: "info",
  newSlide: "new-slide",
  newVote: "new-vote",
};
