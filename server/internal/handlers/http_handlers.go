package handlers

import (
	"fmt"
	"net/http"
)

func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Home Page")
}

func SetupRoutes() {
	http.HandleFunc("/", homePage)
}
