package handlers

import (
	"testing"

	"github.com/zynorex/tala-api/utils"
)

func TestHashPassword(t *testing.T) {
	password := "testpassword123"
	hash, err := utils.HashPassword(password)

	if err != nil {
		t.Fatalf("Failed to hash password: %v", err)
	}

	if hash == "" {
		t.Fatal("Hash is empty")
	}

	if !utils.VerifyPassword(hash, password) {
		t.Fatal("Password verification failed")
	}
}

func TestGenerateToken(t *testing.T) {
	userID := utils.GenerateID()
	email := "test@example.com"

	token, err := utils.GenerateToken(userID, email)

	if err != nil {
		t.Fatalf("Failed to generate token: %v", err)
	}

	if token == "" {
		t.Fatal("Token is empty")
	}
}

func TestGenerateID(t *testing.T) {
	id1 := utils.GenerateID()
	id2 := utils.GenerateID()

	if id1 == "" || id2 == "" {
		t.Fatal("Generated ID is empty")
	}

	if id1 == id2 {
		t.Fatal("Generated IDs are not unique")
	}
}

func TestHashFile(t *testing.T) {
	data := []byte("test data")
	hash := utils.HashFile(data)

	if hash == "" {
		t.Fatal("Hash is empty")
	}

	if len(hash) != 64 {
		t.Fatal("Hash length is not 64")
	}
}
