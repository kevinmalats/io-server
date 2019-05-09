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
	let pro= JSON.parse(req.body.resources);
	console.log(pro.data);
let id= pro.data.id;
let data=pro.data;
switch (req.body.triggered_by) {
	 case "product.updated":
	 console.log("update");
	 Moltin.Products.Update(id, data).then(product => {
		// Do something
	})
		break;
		case "product.create":
		console.log("create");
		Moltin.Products.Create(data).then(data => {
		  // Do something
		})
			break;
		case "product.delete":
		console.log("delete");
		Moltin.Products.Delete(id).then(response => {
			// Do something
		})
			break;
	default:

}

	res.send({success: true, message: "Ok"});
})
async function cretae(product){
	console.log("creando");
	Moltin.Products.Create(product).then(product => {
	  // Do something
	})
}
async function update(id,data){
	console.log("actualizando...");
	Moltin.Products.Update(id, data).then(product => {
	  // Do something
	})
}
async function deleted(id){
	console.log("eliminando...");
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
