# Backend Makefile
.PHONY: help build run test clean install

help:
	@echo "TALA Backend Commands"
	@echo "===================="
	@echo "make install   - Install dependencies"
	@echo "make build     - Build the binary"
	@echo "make run       - Run the server"
	@echo "make test      - Run tests"
	@echo "make clean     - Clean build artifacts"

install:
	go mod download

build:
	go build -o tala-api

run:
	go run main.go

test:
	go test -v ./...

clean:
	rm -f tala-api tala.db
