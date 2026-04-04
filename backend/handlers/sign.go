package handlers

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/zynorex/tala-api/models"
	"github.com/zynorex/tala-api/utils"
)

type SignRequest struct {
	Signature string `json:"signature" binding:"required"`
	Message   string `json:"message"`
}

func SignCapsule(c *gin.Context) {
	id := c.Param("id")
	userID := c.GetString("userID")

	var req SignRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var capsule models.Capsule
	if err := models.DB.Where("id = ?", id).First(&capsule).Error; err != nil {
		c.JSON(404, gin.H{"error": "Capsule not found"})
		return
	}

	// Create signature record
	signature := models.Signature{
		ID:        utils.GenerateID(),
		CapsuleID: capsule.ID,
		SignedBy:  userID,
		Signature: req.Signature,
		Checksum:  utils.GenerateChecksum(req.Signature),
		SignedAt:  time.Now().Unix(),
		CreatedAt: time.Now().Unix(),
	}

	if err := models.DB.Create(&signature).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to sign capsule"})
		return
	}

	// Update capsule status
	capsule.Status = "SIGNED"
	capsule.UpdatedAt = time.Now().Unix()
	models.DB.Save(&capsule)

	// Create audit trail
	audit := models.AuditTrail{
		ID:        utils.GenerateID(),
		CapsuleID: capsule.ID,
		Action:    "SIGN",
		Actor:     userID,
		Details:   "Capsule signed - Wallet signs the unlock schedule, contract records checksums and IPFS pin occurs",
		Timestamp: time.Now().Unix(),
		CreatedAt: time.Now().Unix(),
	}
	models.DB.Create(&audit)

	c.JSON(201, gin.H{
		"signature_id": signature.ID,
		"checksum":     signature.Checksum,
		"signed_at":    signature.SignedAt,
		"message":      "Capsule signed successfully",
	})
}
