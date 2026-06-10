const mysql = require('mysql2/promise');

// Todas as configurações do banco ficam aqui.
// Os valores reais vêm das variáveis de ambiente (.env),
// com um valor padrão de fallback para desenvolvimento local.
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'colorjorge',
  waitForConnections: true,
  connectionLimit: 10,   // máximo de conexões simultâneas
  queueLimit: 0,         // fila ilimitada
});

// Testa a conexão ao inicializar, só para garantir que está tudo certo
pool.getConnection()
  .then(conn => {
    console.log('✅ Conectado ao banco de dados MySQL com sucesso!');
    conn.release(); // devolve a conexão para o pool
  })
  .catch(err => {
    console.error('❌ Erro ao conectar com o MySQL:', err.message);
  });

module.exports = pool;
