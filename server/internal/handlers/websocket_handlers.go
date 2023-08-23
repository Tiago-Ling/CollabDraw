package handlers

import (
	"collabdraw/server/internal/models"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// This should probably be handled elsewhere
var clients = make(map[*websocket.Conn]bool)
var clientsMu sync.Mutex

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}
	defer ws.Close()

	log.Println("Client Connected: ", ws.LocalAddr())

	clientsMu.Lock()
	clients[ws] = true
	clientsMu.Unlock()

	// Write back to client informing of successful connection
	err = ws.WriteMessage(1, []byte("Server Connection Successful"))
	if err != nil {
		log.Println(err)
	}

	// Listen indefinitely for new messages coming
	reader(ws)

	clientsMu.Lock()
	delete(clients, ws)
	clientsMu.Unlock()
}

func reader(conn *websocket.Conn) {
	for {
		var data models.DrawData
		err := conn.ReadJSON(&data)
		if err != nil {
			log.Println(err)
			return
		}

		log.Println("Received message:", data)

		broadcast(data, conn)
	}
}

func broadcast(data models.DrawData, sender *websocket.Conn) {
	clientsMu.Lock()
	defer clientsMu.Unlock()

	for conn := range clients {
		if conn != sender {
			if err := conn.WriteJSON(&data); err != nil {
				log.Println("Websocket write error: ", err)
			}
		}
	}
}

func SetupWebsocket() {
	http.HandleFunc("/ws", wsEndpoint)
}
