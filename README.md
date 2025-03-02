# sistemasdistribuidos04

**Uma API com Endpoint Assíncrono e Message Broker utilizando Node.js, Redis e MongoDB**

---

## 🛠 Tecnologias Utilizadas
- **Node.js**: Plataforma JavaScript para criação da API.
- **Express.js**: Framework para desenvolvimento de aplicações web com Node.js.
- **Redis**: Message broker para processamento assíncrono.
- **MongoDB**: Banco de dados NoSQL para persistência de dados.
- **Docker** e **Docker Compose**: Ferramentas para containerização e orquestração de serviços.

---

## 📂 Estrutura do Projeto
- `index.js`: Arquivo principal da aplicação que inicia a API.
- `consume.js`: Script responsável por consumir as mensagens do Redis e processá-las no MongoDB.
- `Dockerfile`: Configuração do contêiner da API.
- `docker-compose.yml`: Orquestração dos serviços (API, Redis e MongoDB).
- `package.json`: Declaração das dependências e scripts para facilitar o uso.

---

## 🚀 Como Executar a API

### Pré-requisitos
1. Ter o **Docker** e **Docker Compose** instalados no sistema.
   - Docker: [Instalação](https://docs.docker.com/get-docker/)
   - Docker Compose: [Instalação](https://docs.docker.com/compose/install/)

### Passos
1. Clone este repositório:
   ```bash
   git clone https://github.com/eduardo-whitehurst/sistemasdistribuidos04.git
   cd sistemasdistribuidos04
2. Suba os contêineres do projeto:
   ```bash
   docker-compose up --build
3. Após a inicialização, a API estará disponível no endereço:
   ```bash
   URL: http://localhost:3000
4. Certifique-se de que os contêineres Redis e MongoDB também estão em execução.

---

## ✉️ Como Testar a API

### Testar o Endpoint `/task`
1. Utilize **Postman**, **curl** ou outra ferramenta para enviar uma requisição POST ao endpoint `/task`:
   ```bash
   curl -X POST http://localhost:3000/task \
   -H "Content-Type: application/json" \
   -d '{"action": "saveData", "data": {"id": 1, "name": "Exemplo"}}'
2. Resposta esperada da API (HTTP 202):
   ```bash
   {
  "message": "Tarefa enfileirada com sucesso!"
   }
### 🔍 Verificar o Processamento da Mensagem
1. O script `consume.js` será responsável por consumir a mensagem da fila Redis e salvar os dados no MongoDB.
2. Para confirmar, acesse o contêiner MongoDB:
   ```bash
   docker exec -it mongodb mongosh
3. Dentro do cliente MongoDB, visualize os dados salvos:
   ```bash
   use mydatabase
   db.datas.find()

---

## 📦 Scripts Adicionais

### Iniciar o Consumidor
Se necessário, o consumidor (`consume.js`) pode ser executado manualmente:
   ```bash
   npm run consume

### Parar os Contêineres
Quando terminar de usar a aplicação, você pode parar os contêineres com:
   ```bash
   docker-compose down

## 🗂 Licença

Este projeto é desenvolvido para fins acadêmicos, como parte da disciplina de Sistemas Distribuídos.
