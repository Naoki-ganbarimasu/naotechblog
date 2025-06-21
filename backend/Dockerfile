# 開発用
FROM golang:1.21-alpine AS development

WORKDIR /app

# 依存関係をインストール
COPY go.mod go.sum ./
RUN go mod download

# Air (ホットリロード) をインストール
RUN go install github.com/cosmtrek/air@latest

# ソースコードをコピー
COPY . .

# 開発サーバーを起動
CMD ["air", "-c", ".air.toml"]

# プロダクション用ビルド
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main cmd/server/main.go

# プロダクション用最終イメージ
FROM alpine:latest AS production

RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /app/main .

CMD ["./main"]