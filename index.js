var app = require('express')();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server);
var PORT = process.env.PORT || 9000;
var bodyParser = require('body-parser');
const MoltinGateway = require('@moltin/sdk').gateway
var array = [];
const Moltin = MoltinGateway({
  client_id: '91DLPpeHqlgEwYI5fcnCF0ks9eKpWe5ujMCu7MdKe2',
  client_secret: 'Bx4ir66LgpoaeZseE42nhgIFWNqD2oWmrdATiztU18'
})


app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/testNotification', (req, res) => {
	io.emit('notification', {message: "Test data"});
	res.send({message: 'notification sent'})
})

app.post('/webhook', (req, res) => {

	console.log("req.triggered_by");
	console.log(req.body.triggered_by);

  console.log("req.resources");
	console.log(req.body.resources);
	console.log("id");
	console.log(req.body.resources.data.id);
let id= req.body.resources.data.id;
let data=req.body.resources.data;
switch (req.body.triggered_by) {
	 case "product.updated":
	   update(id);
		break;
		case "product.create":
		 create(data);
			break;
		case "product.delete":
		 deleted(id);
			break;
	default:

}

	res.send({success: true, message: "Ok"});
})
function cretae(product){
	Moltin.Products.Create(product).then(product => {
	  // Do something
	})
}
function update(id,data){
	Moltin.Products.Update(id, data).then(product => {
	  // Do something
	})
}
function deleted(id){
	Moltin.Products.Delete(id).then(response => {
	  // Do something
	})
}
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
