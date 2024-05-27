package util

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

// HashPassword хеширует пароль с использованием bcrypt и
// возвращает хешированный пароль и ошибку, если таковая возникла.
func HashPassword(password string) (string, error) {
	// Генерируем хешированный пароль с использованием bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}

	return string(hashedPassword), nil
}

// CheckPassword проверяет соответствие пароля и его хешированной версии
// и возвращает ошибку, если они не совпадают.
func CheckPassword(password string, hashedPassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
