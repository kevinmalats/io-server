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

 app.post('/webhook',async (req, res) => {


	console.log("req.triggered_by");
	console.log(req.body.triggered_by);

  console.log("req.resources");
	console.log(req.body.resources);
	let pro;
  let id;
  let data;
  let body;
switch (req.body.triggered_by) {
	 case "product.updated":
    pro= JSON.parse(req.body.resources);
 	console.log(pro.data);
  id= pro.data.id;
 //let data=pro.data;

	 console.log("update");
   const data = {
  'name': 'Updated product name',
  'type': 'product',
  'id': id
}
	 try {
     console.log("actualizando...");
      console.log(data);
		  body = await Moltin.Products.Update(id, data).then(product => {
	 	 // Do something
	  })

} catch (e) {
 console.error(`try/catch(${e})`);
}

		break;
		case "product.created":
     pro= JSON.parse(req.body.resources);
  	console.log(pro.data);
      id= pro.data.id;
     const product=pro.data;
		console.log("create");
    product.meta.variations.id=id;
		try {
		 body = await	Moltin.Products.Create(product).then(product => {
			  // Do something
				console.log(product);
			})
 } catch (e) {

 }

			break;
		case "product.deleted":
    id= req.body.resources.id;
		console.log("delete "+id);
		try {
		 body = await	Moltin.Products.Delete(id).then(res => {
				// Do something
			})
 } catch (e) {

 }

			break;
	default:

}

	res.send({success: true, message: "Ok", body: body });
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
