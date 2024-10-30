// privateSocketHandlers.js
function privateSocketHandlers(io, socket) {
    const rooms = new Set();
  
    const joinPrivateChat = ({ username, room }) => {
      socket.join(room);
      rooms.add(room);
      console.log(`User ${username} joined private chat room: ${room}`);
    };
  
    const handlePrivateMessage = async (data) => {
      const { sendingUserName, receivingUserName, content } = data;
      const room = `${sendingUserName}-${receivingUserName}`;
      const reverseRoom = `${receivingUserName}-${sendingUserName}`;
  
      // Emit to both rooms to ensure both users receive the message
      io.to(room).to(reverseRoom).emit("privateMessage", {
        sender: { username: sendingUserName },
        receiver: { username: receivingUserName },
        content,
        createdAt: new Date().toISOString()
      });
    };
  
  
    // Socket event listeners
    socket.on("joinPrivateChat", joinPrivateChat);
    socket.on("sendPrivateMessage", handlePrivateMessage);
  
    // Cleanup on disconnect
    socket.on("disconnect", () => {
      rooms.forEach(room => {
        socket.leave(room);
      });
      rooms.clear();
      console.log("Client disconnected from private chat");
    });
  }
  
  module.exports = privateSocketHandlers;