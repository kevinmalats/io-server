var app = require('express')();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);
var PORT = process.env.PORT || 9000;
var array = [];

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/testNotification', (req, res) => {
	io.emit('notification', {message: "Test data"});
	res.send({message: 'notification sent'})
})

app.post('/webhook', (req, res) => {
console.log("req.resources");
	console.log(req);
	res.send({success: true, message: "Ok"});
})

io.on('connection', (socket) => {
	console.log(socket.id);
	console.log('a user connected');
	socket.emit('status', "Connected");

	array.push(socket.id);
	console.log(array);

	socket.on('chat message', (msg) => {
		io.emit('chat message', `${socket.id}: ${msg}`);
	})

	socket.on('disconnect', () => {
		let filtered = array.filter((x) => x != socket.id);
		array = filtered;
		console.log('user disconnected');
	});
});

server.listen(PORT, () => {
	console.log('listening on *:9000');
});
