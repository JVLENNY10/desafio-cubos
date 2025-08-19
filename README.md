# desafio-cubos

Desafio técnico para criar uma API FINANCEIRA

Para executar o projeto é simples:

- Preencha as variáveis de ambiente no arquivo .env (Os exemplos estão em .env.exemple)
  - A variável COMPLIANCE_API deve receber a API que foi passada para a integração
  - As variáveis EMAIL e PASSWORD devem ser para acessar essa API
  - As demais variáveis são para se conectar no PostgreSQL
- Execute npm install na sua máquina
- Execute o comando para gerar as migrations: npx sequelize db:migrate
- Execute npm run dev
