package main

import (
	"collabdraw/server/internal/handlers"
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("Hello, World!")
	handlers.SetupRoutes()
	handlers.SetupWebsocket()
	log.Fatal(http.ListenAndServe(":3000", nil))
}
