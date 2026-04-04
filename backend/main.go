package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/zynorex/tala-api/handlers"
	"github.com/zynorex/tala-api/middleware"
	"github.com/zynorex/tala-api/models"
)

func init() {
	godotenv.Load()
}

func main() {
	// Initialize database
	if err := models.InitDB(); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	// Create tables
	if err := models.AutoMigrate(); err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	router := gin.Default()

	// Middleware
	router.Use(middleware.CORS())

	// Health check
	router.GET("/health", handlers.HealthCheck)

	// Auth routes
	authGroup := router.Group("/api/v1/auth")
	{
		authGroup.POST("/register", handlers.Register)
		authGroup.POST("/login", handlers.Login)
		authGroup.POST("/login-wallet", handlers.LoginWithWallet)
	}

	// Protected routes
	protected := router.Group("/api/v1")
	protected.Use(middleware.AuthMiddleware())
	{
		// Capsule routes
		protected.POST("/capsules", handlers.CreateCapsule)
		protected.GET("/capsules", handlers.GetCapsules)
		protected.GET("/capsules/:id", handlers.GetCapsuleByID)
		protected.PUT("/capsules/:id", handlers.UpdateCapsule)
		protected.DELETE("/capsules/:id", handlers.DeleteCapsule)

		// Sign routes
		protected.POST("/capsules/:id/sign", handlers.SignCapsule)

		// Unlock routes
		protected.GET("/capsules/:id/unlock", handlers.CheckUnlockTime)
		protected.POST("/capsules/:id/unlock", handlers.UnlockCapsule)

		// Audit trail
		protected.GET("/capsules/:id/audit", handlers.GetAuditTrail)
		protected.GET("/audit", handlers.GetAllAudits)

		// Dashboard stats
		protected.GET("/dashboard/stats", handlers.GetDashboardStats)
	}

	// Public routes
	router.GET("/api/v1/public/stats", handlers.GetPublicStats)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server starting on port %s\n", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Server error:", err)
	}
}
