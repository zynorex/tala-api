package models

import (
	"gorm.io/gorm"
)

var DB *gorm.DB

type User struct {
	ID           string `gorm:"primaryKey"`
	Email        string `gorm:"uniqueIndex"`
	WalletAddr   string `gorm:"uniqueIndex"`
	PasswordHash string
	CreatedAt    int64
	UpdatedAt    int64
}

type Capsule struct {
	ID             string `gorm:"primaryKey"`
	UserID         string
	User           User         `gorm:"foreignKey:UserID"`
	Title          string
	Description    string
	FileHash       string
	EncryptionType string // AES-256-GCM
	Status         string // CREATED, SIGNED, UNLOCKED, AUDITED
	CreatedAt      int64
	UpdatedAt      int64
	UnlockTime     int64 // Unix timestamp
	IsLocked       bool
	Signatures     []Signature     `gorm:"foreignKey:CapsuleID"`
	AuditTrails    []AuditTrail    `gorm:"foreignKey:CapsuleID"`
}

type Signature struct {
	ID          string `gorm:"primaryKey"`
	CapsuleID   string
	Capsule     Capsule `gorm:"foreignKey:CapsuleID"`
	SignedBy    string
	Signature   string
	Checksum    string
	IPFSHash    string
	SignedAt    int64
	CreatedAt   int64
}

type AuditTrail struct {
	ID          string `gorm:"primaryKey"`
	CapsuleID   string
	Capsule     Capsule `gorm:"foreignKey:CapsuleID"`
	Action      string // CREATE, SIGN, UNLOCK, VERIFY
	Actor       string
	Details     string
	Timestamp   int64
	IPFSHash    string
	CreatedAt   int64
}

type DashboardStats struct {
	PilotExamWindows   int64
	ActiveTenderRounds int64
	EvidenceCapsules   int64
	TotalUsers         int64
}
