package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Handler обрабатывает HTTP-запросы, связанные с пользователями.
type Handler struct {
	Service
}

// NewHandler создает новый экземпляр Handler с указанной сервисной службой.
func NewHandler(s Service) *Handler {
	return &Handler{
		Service: s,
	}
}

// CreateUser обрабатывает запрос на создание нового пользователя.
func (h *Handler) CreateUser(c *gin.Context) {
	var u CreateUserReq
	if err := c.ShouldBindJSON(&u); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := h.Service.CreateUser(c.Request.Context(), &u)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, res)
}

// Login обрабатывает запрос на аутентификацию пользователя.
func (h *Handler) Login(c *gin.Context) {
	var user LoginUserReq
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	u, err := h.Service.Login(c.Request.Context(), &user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.SetCookie("jwt", u.accessToken, 60*60*24, "/", "localhost", false, true)
	c.JSON(http.StatusOK, u)
}

// Logout обрабатывает запрос на выход пользователя из системы.
func (h *Handler) Logout(c *gin.Context) {
	c.SetCookie("jwt", "", -1, "", "", false, true)
	c.JSON(http.StatusOK, gin.H{"message": "logout successful"})
}
