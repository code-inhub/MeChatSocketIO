import { Server } from "socket.io";

const io = new Server({
  cors: {
    // origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    origin: '*',
  },
});
io.listen(process.env.PORT || 9000);

let users = [];


const addUser = (userData, socketId) => {
  !users.some((user) => user.sub === userData.sub) &&
    users.push({ ...userData, socketId });
};

const getUser = (userId) => {
  return users.find((user) => user.sub === userId);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};


io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("addUsers", (userData)=> {
    addUser(userData, socket.id);
    io.emit("getUsers", users);
  })

  socket.on("sendMessage", (data) => {
    const user = getUser(data.receiverId);
    io.to(user.socketId).emit("getMessage", data);
  })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        removeUser(socket.id);
        io.emit('getUsers', users); 

           })
});

