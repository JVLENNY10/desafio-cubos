import app from './app';

const PORT = 3000;

app.listen(PORT, () => console.log(`Server rodando em: http://localhost:${PORT} ou http://localhost:${PORT}/api-docs para o Swagger`));
