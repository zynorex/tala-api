package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/zynorex/tala-api/models"
)

func GetDashboardStats(c *gin.Context) {
	var totalCapsules int64
	var totalUsers int64
	var unlawkedCapsules int64

	models.DB.Model(&models.Capsule{}).Count(&totalCapsules)
	models.DB.Model(&models.User{}).Count(&totalUsers)
	models.DB.Model(&models.Capsule{}).Where("is_locked = ?", false).Count(&unlawkedCapsules)

	c.JSON(200, gin.H{
		"pilot_exam_windows":   totalCapsules,
		"active_tender_rounds": totalUsers / 3, // Placeholder
		"evidence_capsules":    totalCapsules * 2, // Placeholder
	})
}

func GetPublicStats(c *gin.Context) {
	var totalCapsules int64
	var totalUsers int64

	models.DB.Model(&models.Capsule{}).Count(&totalCapsules)
	models.DB.Model(&models.User{}).Count(&totalUsers)

	c.JSON(200, gin.H{
		"pilot_exam_windows":   totalCapsules,
		"active_tender_rounds": totalUsers,
		"evidence_capsules":    totalCapsules * 2,
	})
}
