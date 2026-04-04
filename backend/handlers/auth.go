package handlers

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/zynorex/tala-api/models"
	"github.com/zynorex/tala-api/utils"
)

type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
	Name     string `json:"name"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type WalletLoginRequest struct {
	WalletAddr string `json:"wallet_addr" binding:"required"`
	Signature  string `json:"signature" binding:"required"`
	Message    string `json:"message" binding:"required"`
}

type AuthResponse struct {
	Token  string `json:"token"`
	UserID string `json:"user_id"`
	Email  string `json:"email"`
}

func Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Check if user already exists
	var existingUser models.User
	if err := models.DB.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		c.JSON(409, gin.H{"error": "User already exists"})
		return
	}

	// Hash password
	passwordHash, err := utils.HashPassword(req.Password)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to hash password"})
		return
	}

	// Create user
	user := models.User{
		ID:           utils.GenerateID(),
		Email:        req.Email,
		PasswordHash: passwordHash,
		CreatedAt:    time.Now().Unix(),
		UpdatedAt:    time.Now().Unix(),
	}

	if err := models.DB.Create(&user).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create user"})
		return
	}

	// Generate token
	token, err := utils.GenerateToken(user.ID, user.Email)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(201, AuthResponse{
		Token:  token,
		UserID: user.ID,
		Email:  user.Email,
	})
}

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := models.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(401, gin.H{"error": "Invalid credentials"})
		return
	}

	if !utils.VerifyPassword(user.PasswordHash, req.Password) {
		c.JSON(401, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := utils.GenerateToken(user.ID, user.Email)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(200, AuthResponse{
		Token:  token,
		UserID: user.ID,
		Email:  user.Email,
	})
}

func LoginWithWallet(c *gin.Context) {
	var req WalletLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// In production, verify the signature with the wallet address
	// For now, we'll create/get the user by wallet address

	var user models.User
	result := models.DB.Where("wallet_addr = ?", req.WalletAddr).First(&user)

	if result.Error != nil {
		// Create new user
		user = models.User{
			ID:         utils.GenerateID(),
			WalletAddr: req.WalletAddr,
			CreatedAt:  time.Now().Unix(),
			UpdatedAt:  time.Now().Unix(),
		}
		if err := models.DB.Create(&user).Error; err != nil {
			c.JSON(500, gin.H{"error": "Failed to create user"})
			return
		}
	}

	token, err := utils.GenerateToken(user.ID, user.Email)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(200, AuthResponse{
		Token:  token,
		UserID: user.ID,
		Email:  user.Email,
	})
}
