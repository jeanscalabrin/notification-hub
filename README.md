# Notification Hub

Notification Hub é uma aplicação backend desenvolvida para gerenciamento e processamento assíncrono de notificações.

O projeto foi criado com foco em arquitetura backend moderna utilizando NestJS, autenticação baseada em JWT, filas distribuídas com BullMQ e testes automatizados.

## Tecnologias

### Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- BullMQ
- Redis
- JWT

### Testes

- Jest
- Supertest

### Ferramentas

- Bruno
- Docker
- Prisma Migrations

---

## Funcionalidades

### Autenticação

- Cadastro de usuários
- Login com JWT
- Endpoint protegido `/auth/me`
- Guards e Strategies

### Notificações

- Criar notificação
- Listar notificações do usuário autenticado
- Buscar notificação por ID
- Validação de ownership

### Processamento Assíncrono

- Integração com BullMQ
- Redis para gerenciamento de filas
- Processor dedicado para consumo de jobs

---

## Endpoints

### Auth

```http
POST /auth/signup
POST /auth/signin
GET  /auth/me
```

### Notifications

```http
POST /notifications
GET  /notifications
GET  /notifications/:id
```

---

## Conceitos Explorados

- Arquitetura modular com NestJS
- Autenticação baseada em JWT
- Prisma ORM
- PostgreSQL
- Processamento assíncrono com BullMQ
- Redis como broker de filas
- Workers e Processors
- Testes de Integração
- Testes End-to-End (E2E)

---

## Executando o Projeto

### Instalar dependências

```bash
npm install
```

### Configurar variáveis de ambiente

```bash
cp .env.example .env
```

### Executar migrations

```bash
npx prisma migrate dev
```

### Subir PostgreSQL e Redis

```bash
docker compose up -d
```

### Iniciar aplicação

```bash
npm run start:dev
```

---

## Executando os Testes

### Integration Tests

```bash
npm run test
```

### End-to-End Tests

```bash
npm run test:e2e
```

---

## Roadmap

### Concluído

- [x] NestJS
- [x] Prisma ORM
- [x] PostgreSQL
- [x] JWT Authentication
- [x] Users Module
- [x] Auth Module
- [x] Notifications Module
- [x] BullMQ
- [x] Redis
- [x] Workers e Processors
- [x] Integration Tests
- [x] End-to-End Tests

### Em desenvolvimento

- [ ] Notification Lifecycle (`PROCESSING`, `DELIVERED`, `FAILED`)
- [ ] Retry Strategy
- [ ] Dead Letter Queue (DLQ)
- [ ] Bull Board
- [ ] WebSockets
- [ ] Swagger
- [ ] Health Check
- [ ] Logging Estruturado
- [ ] Métricas e Observabilidade

---

## Objetivo

Este projeto foi desenvolvido com o objetivo de aprofundar conhecimentos em desenvolvimento backend utilizando NestJS, autenticação segura, processamento assíncrono, filas distribuídas e testes automatizados, simulando cenários encontrados em aplicações modernas de produção.
