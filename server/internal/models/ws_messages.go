package models

type Point struct {
	X float32 `json:"x"`
	Y float32 `json:"y"`
}

type DrawData struct {
	Points    []Point `json:"points"`
	LineWidth int     `json:"lineWidth"`
	Colour    string  `json:"colour"`
}

type Message[T any] struct {
	Type string `json:"type"`
	Data T      `json:"data"`
}
