const express = require('express');
const port = process.env.PORT || 4000;
const cors = require('cors');
const indexRouter = require('./routes/index');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/',indexRouter);
app.listen(port, () => console.log(`listening on http://localhost:${port}`));

let http = require("http").Server(app);
let io = require("socket.io")(http);

io.on("connection", socket => {
    // Log whenever a user connects
    console.log("user connected");
  
    // Log whenever a client disconnects from our websocket server
    socket.on("disconnect", function() {
      console.log("user disconnected");
    });
  
    // When we receive a 'message' event from our client, print out
    // the contents of that message and then echo it back to our client
    // using `io.emit()`
    socket.on("message", message => {
      console.log("Message Received: " + message);
      io.emit("message", { type: "new-message", text: message });
    });
});
  


module.exports = indexRouter