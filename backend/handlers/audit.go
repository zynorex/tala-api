package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/zynorex/tala-api/models"
)

type AuditTrailResponse struct {
	ID        string `json:"id"`
	CapsuleID string `json:"capsule_id"`
	Action    string `json:"action"`
	Actor     string `json:"actor"`
	Details   string `json:"details"`
	Timestamp int64  `json:"timestamp"`
}

func GetAuditTrail(c *gin.Context) {
	id := c.Param("id")
	userID := c.GetString("userID")

	var capsule models.Capsule
	if err := models.DB.Where("id = ? AND user_id = ?", id, userID).First(&capsule).Error; err != nil {
		c.JSON(404, gin.H{"error": "Capsule not found"})
		return
	}

	var audits []models.AuditTrail
	if err := models.DB.Where("capsule_id = ?", id).Order("timestamp DESC").Find(&audits).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch audit trail"})
		return
	}

	var responses []AuditTrailResponse
	for _, audit := range audits {
		responses = append(responses, AuditTrailResponse{
			ID:        audit.ID,
			CapsuleID: audit.CapsuleID,
			Action:    audit.Action,
			Actor:     audit.Actor,
			Details:   audit.Details,
			Timestamp: audit.Timestamp,
		})
	}

	c.JSON(200, responses)
}

func GetAllAudits(c *gin.Context) {
	userID := c.GetString("userID")

	// Get all capsules for this user first
	var capsuleIDs []string
	if err := models.DB.Where("user_id = ?", userID).Pluck("id", &capsuleIDs).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch capsules"})
		return
	}

	var audits []models.AuditTrail
	if err := models.DB.Where("capsule_id IN ?", capsuleIDs).Order("timestamp DESC").Find(&audits).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch audit trail"})
		return
	}

	var responses []AuditTrailResponse
	for _, audit := range audits {
		responses = append(responses, AuditTrailResponse{
			ID:        audit.ID,
			CapsuleID: audit.CapsuleID,
			Action:    audit.Action,
			Actor:     audit.Actor,
			Details:   audit.Details,
			Timestamp: audit.Timestamp,
		})
	}

	c.JSON(200, responses)
}
