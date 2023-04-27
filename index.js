import express from 'express'
import WS_server from 'express-ws'

const app = express()
const aWss = WS_server(app).getWss()

const PORT = process.env.PORT || 5000

app.ws('/', (ws, req) => {
  ws.on('message', (msg) => {
    msg = JSON.parse(msg)
    switch (msg.method) {
      case "connection":
        connectionHandler(ws, msg)
        break
      case "draw":
        broadcastConnection(msg)
        break
    }
  })
})

app.listen(PORT, () => {
  console.log("Started SERVER on PORT: ", PORT);
})

const connectionHandler = (ws, msg) => {
  ws.id = msg.id
  broadcastConnection(msg)
}

const broadcastConnection = (msg) => {
  aWss.clients.forEach(client => {
    if(client.id === msg.id) {
      client.send(JSON.stringify(msg))
    }
  })
}