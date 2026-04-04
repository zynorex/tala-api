package handlers

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/zynorex/tala-api/models"
	"github.com/zynorex/tala-api/utils"
)

func CheckUnlockTime(c *gin.Context) {
	id := c.Param("id")
	userID := c.GetString("userID")

	var capsule models.Capsule
	if err := models.DB.Where("id = ? AND user_id = ?", id, userID).First(&capsule).Error; err != nil {
		c.JSON(404, gin.H{"error": "Capsule not found"})
		return
	}

	now := time.Now().Unix()
	canUnlock := now >= capsule.UnlockTime
	timeRemaining := capsule.UnlockTime - now

	if timeRemaining < 0 {
		timeRemaining = 0
	}

	c.JSON(200, gin.H{
		"can_unlock":      canUnlock,
		"time_remaining":  timeRemaining,
		"unlock_time":     capsule.UnlockTime,
		"current_time":    now,
	})
}

func UnlockCapsule(c *gin.Context) {
	id := c.Param("id")
	userID := c.GetString("userID")

	var capsule models.Capsule
	if err := models.DB.Where("id = ? AND user_id = ?", id, userID).First(&capsule).Error; err != nil {
		c.JSON(404, gin.H{"error": "Capsule not found"})
		return
	}

	now := time.Now().Unix()
	if now < capsule.UnlockTime {
		timeRemaining := capsule.UnlockTime - now
		c.JSON(403, gin.H{
			"error":            "Capsule cannot be unlocked yet",
			"time_remaining":   timeRemaining,
			"unlock_time":      capsule.UnlockTime,
		})
		return
	}

	// Unlock the capsule
	capsule.IsLocked = false
	capsule.Status = "UNLOCKED"
	capsule.UpdatedAt = time.Now().Unix()
	models.DB.Save(&capsule)

	// Create audit trail
	audit := models.AuditTrail{
		ID:        utils.GenerateID(),
		CapsuleID: capsule.ID,
		Action:    "UNLOCK",
		Actor:     userID,
		Details:   "Capsule unlocked - $maj is displayed to user",
		Timestamp: time.Now().Unix(),
		CreatedAt: time.Now().Unix(),
	}
	models.DB.Create(&audit)

	c.JSON(200, gin.H{
		"message":     "Capsule unlocked successfully",
		"capsule_id":  capsule.ID,
		"status":      capsule.Status,
		"is_locked":   capsule.IsLocked,
		"unlocked_at": time.Now().Unix(),
	})
}
