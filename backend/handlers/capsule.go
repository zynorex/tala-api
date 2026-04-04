package handlers

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/zynorex/tala-api/models"
	"github.com/zynorex/tala-api/utils"
)

type CreateCapsuleRequest struct {
	Title      string `json:"title" binding:"required"`
	Description string `json:"description"`
	FileHash   string `json:"file_hash" binding:"required"`
	UnlockTime int64  `json:"unlock_time" binding:"required"`
}

type CapsuleResponse struct {
	ID             string `json:"id"`
	Title          string `json:"title"`
	Description    string `json:"description"`
	Status         string `json:"status"`
	CreatedAt      int64  `json:"created_at"`
	UnlockTime     int64  `json:"unlock_time"`
	IsLocked       bool   `json:"is_locked"`
	TimeRemaining  int64  `json:"time_remaining"`
	SignatureCount int64  `json:"signature_count"`
}

func CreateCapsule(c *gin.Context) {
	var req CreateCapsuleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetString("userID")

	capsule := models.Capsule{
		ID:             utils.GenerateID(),
		UserID:         userID,
		Title:          req.Title,
		Description:    req.Description,
		FileHash:       req.FileHash,
		EncryptionType: "AES-256-GCM",
		Status:         "CREATED",
		CreatedAt:      time.Now().Unix(),
		UpdatedAt:      time.Now().Unix(),
		UnlockTime:     req.UnlockTime,
		IsLocked:       true,
	}

	if err := models.DB.Create(&capsule).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create capsule"})
		return
	}

	// Create audit trail
	audit := models.AuditTrail{
		ID:        utils.GenerateID(),
		CapsuleID: capsule.ID,
		Action:    "CREATE",
		Actor:     userID,
		Details:   "Capsule created",
		Timestamp: time.Now().Unix(),
		CreatedAt: time.Now().Unix(),
	}
	models.DB.Create(&audit)

	c.JSON(201, gin.H{
		"id":    capsule.ID,
		"title": capsule.Title,
		"status": capsule.Status,
		"created_at": capsule.CreatedAt,
		"unlock_time": capsule.UnlockTime,
		"is_locked": capsule.IsLocked,
	})
}

func GetCapsules(c *gin.Context) {
	userID := c.GetString("userID")

	var capsules []models.Capsule
	if err := models.DB.Where("user_id = ?", userID).Find(&capsules).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch capsules"})
		return
	}

	var responses []CapsuleResponse
	for _, capsule := range capsules {
		timeRemaining := capsule.UnlockTime - time.Now().Unix()
		if timeRemaining < 0 {
			timeRemaining = 0
		}

		var sigCount int64
		models.DB.Model(&models.Signature{}).Where("capsule_id = ?", capsule.ID).Count(&sigCount)

		responses = append(responses, CapsuleResponse{
			ID:             capsule.ID,
			Title:          capsule.Title,
			Description:    capsule.Description,
			Status:         capsule.Status,
			CreatedAt:      capsule.CreatedAt,
			UnlockTime:     capsule.UnlockTime,
			IsLocked:       capsule.IsLocked,
			TimeRemaining:  timeRemaining,
			SignatureCount: sigCount,
		})
	}

	c.JSON(200, responses)
}

func GetCapsuleByID(c *gin.Context) {
	id := c.Param("id")
	userID := c.GetString("userID")

	var capsule models.Capsule
	if err := models.DB.Where("id = ? AND user_id = ?", id, userID).First(&capsule).Error; err != nil {
		c.JSON(404, gin.H{"error": "Capsule not found"})
		return
	}

	timeRemaining := capsule.UnlockTime - time.Now().Unix()
	if timeRemaining < 0 {
		timeRemaining = 0
	}

	var sigCount int64
	models.DB.Model(&models.Signature{}).Where("capsule_id = ?", capsule.ID).Count(&sigCount)

	c.JSON(200, gin.H{
		"id":              capsule.ID,
		"title":           capsule.Title,
		"description":     capsule.Description,
		"file_hash":       capsule.FileHash,
		"status":          capsule.Status,
		"created_at":      capsule.CreatedAt,
		"unlock_time":     capsule.UnlockTime,
		"is_locked":       capsule.IsLocked,
		"time_remaining":  timeRemaining,
		"signature_count": sigCount,
	})
}

func UpdateCapsule(c *gin.Context) {
	id := c.Param("id")
	userID := c.GetString("userID")

	var req CreateCapsuleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var capsule models.Capsule
	if err := models.DB.Where("id = ? AND user_id = ?", id, userID).First(&capsule).Error; err != nil {
		c.JSON(404, gin.H{"error": "Capsule not found"})
		return
	}

	capsule.Title = req.Title
	capsule.Description = req.Description
	capsule.UnlockTime = req.UnlockTime
	capsule.UpdatedAt = time.Now().Unix()

	if err := models.DB.Save(&capsule).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to update capsule"})
		return
	}

	c.JSON(200, gin.H{"message": "Capsule updated successfully"})
}

func DeleteCapsule(c *gin.Context) {
	id := c.Param("id")
	userID := c.GetString("userID")

	var capsule models.Capsule
	if err := models.DB.Where("id = ? AND user_id = ?", id, userID).First(&capsule).Error; err != nil {
		c.JSON(404, gin.H{"error": "Capsule not found"})
		return
	}

	if err := models.DB.Delete(&capsule).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to delete capsule"})
		return
	}

	c.JSON(200, gin.H{"message": "Capsule deleted successfully"})
}
