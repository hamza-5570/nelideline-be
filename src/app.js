const express = require('express');
var cors = require('cors');
const app = express();
const routes = require('./routers/routes');
const socketio = require('socket.io');

/*******AdminBro Dependencies */
const { buildAdminRouter } = require('./adminBro/adminRouter');
const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const options = require('./adminBro/adminOptions');
const admin = new AdminJS(options);
const router = buildAdminRouter(admin);

app.use(express.json({ urlencoded: true }));

app.use(cors());
app.use(admin.options.rootPath, router);

const PORT = process.env.PORT || 3800;

/***Route binding*/
app.use('/', routes);

/*******MongoDB Connectivity */
const connectDB = require('./config/database');

connectDB();

const server = app.listen(PORT, () => {
  console.log(
    'The project is running on PORT 3800 AdminJS is under http://localhost:3800/admin'
  );
});

const io = new socketio.Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let users = [];

io.on('connection', function (socket) {
  socket.on('joinUser', (user) => {
    if (users.find((x) => x.id === user)) {
      let replaceUser = users.findIndex((x) => {
        return x.id === user;
      });
      users[replaceUser] = {
        id: user,
        socketId: socket.id,
      };
    } else {
      users.push({
        id: user,
        socketId: socket.id,
      });
    }
  });
  socket.on('sendNotificationToDriver', (data) => {
    users.forEach((x) => {
      if (x?.id === data?.to) {
        socket.to(x.socketId).emit('acceptNotificationFromBuyer', data);
      }
    });
  });
  socket.on('disconnect', () => {
    users.find((user) => user.socketId === socket.id);
    users = users.filter((user) => user.socketId !== socket.id);
  });
});
