const express = require('express')
const { Server } = require('socket.io')
const path = require('path');
const http = require('http')
const Product = require('./models/products')
const upload = require('./middlewares/file');
const { engine } = require('express-handlebars');
const fetch = require('node-fetch')
const cors = require('cors');

const app = express();
const server = http.createServer(app)
const PORT = process.env.PORT | 8080
const io = new Server(server)
const productModel = new Product();

user={}
users = []

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.engine('handlebars', engine({
  layoutsDir: path.join(__dirname, './views'),
  defaultLayout: 'index'
}));

app.set('view engine', 'handlebars')
app.use("/static", express.static(path.join(__dirname, 'public')))


app.get("/", async (req, res) => {
  res.render(path.join(__dirname, './views/index.handlebars'))
});


app.post("/", upload.single("thumbnail"), async (req, res) =>{
    const { title, price} = req.body;
    const thumbnail = path.join("static/img/" + req.file.filename)
    await productModel.save(title, price+"$", thumbnail).then(id =>{return id});
    res.end()
  })

io.on("connection", (socket) => {
  console.log(`Nuevo usuario conectado: ${socket.id}`)

  io.sockets.emit('index', null)

  socket.on('reload', ()=> {
    io.sockets.emit('refresh')
  })

  socket.on('new-User', (userName) => {
    user = {
      name: userName,
      id: socket.id
    }
    users.push(user)
    io.sockets.emit('user', user)
  })
 



})

server.listen(PORT, () => console.log(`listening on port: ${PORT}`))