package models

import (
	"fmt"
	"os"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func InitDB() error {
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "tala.db"
	}

	database, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	DB = database
	return nil
}

func AutoMigrate() error {
	return DB.AutoMigrate(
		&User{},
		&Capsule{},
		&Signature{},
		&AuditTrail{},
	)
}
