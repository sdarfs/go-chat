package user

import (
	"context"
	"server/util"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// secretKey - ключ для подписи JWT-токена.
const (
	secretKey = "secret"
)

// service - структура, представляющая сервис для работы с пользователями.
type service struct {
	Repository
	timeout time.Duration
}

// NewService - функция создания нового сервиса с указанным репозиторием.
func NewService(repository Repository) Service {
	return &service{
		repository,
		time.Duration(2) * time.Second,
	}
}

// CreateUser - метод для создания нового пользователя.
func (s *service) CreateUser(c context.Context, req *CreateUserReq) (*CreateUserRes, error) {
	ctx, cancel := context.WithTimeout(c, s.timeout)
	defer cancel()
	// Хеширование пароля перед сохранением в базу данных.
	hashedPassword, err := util.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}
	// Создание нового пользователя на основе запроса.
	u := &User{
		Username: req.Username,
		Email:    req.Email,
		Password: hashedPassword,
	}
	// Сохранение пользователя
	r, err := s.Repository.CreateUser(ctx, u)
	if err != nil {
		return nil, err
	}
	// Формирование ответа на успешное создание пользователя.
	res := &CreateUserRes{
		ID:       strconv.Itoa(int(r.ID)),
		Username: r.Username,
		Email:    r.Email,
	}

	return res, nil
}

// MyJWTClaims - структура для хранения пользовательских данных в JWT-токене.
type MyJWTClaims struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// Login - метод для аутентификации пользователя и генерации JWT-токена.
func (s *service) Login(c context.Context, req *LoginUserReq) (*LoginUserRes, error) {
	ctx, cancel := context.WithTimeout(c, s.timeout)
	defer cancel()
	// Получение пользователя по email
	u, err := s.Repository.GetUserByEmail(ctx, req.Email)
	if err != nil {
		return &LoginUserRes{}, err
	}
	// Проверка пароля пользователя.
	err = util.CheckPassword(req.Password, u.Password)
	if err != nil {
		return &LoginUserRes{}, err
	}
	// Создание JWT-токена с пользовательскими данными.
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, MyJWTClaims{
		ID:       strconv.Itoa(int(u.ID)),
		Username: u.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    strconv.Itoa(int(u.ID)),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	})

	ss, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return &LoginUserRes{}, err
	}
	// Формирование ответа на успешную аутентификацию пользователя.
	return &LoginUserRes{accessToken: ss, Username: u.Username, ID: strconv.Itoa(int(u.ID))}, nil
}
