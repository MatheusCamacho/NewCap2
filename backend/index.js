const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3004;
const JWT_SECRET = process.env.JWT_SECRET || "capitulo2_chave_secreta_2026";

app.use(cors());
app.use(express.json());

async function initDB() {
  try {
    const verificaAdmin = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'admins' AND column_name = 'senha'
    `);

    if (verificaAdmin.rows.length === 0) {
      await pool.query(`
        DROP TABLE IF EXISTS propostas CASCADE;
        DROP TABLE IF EXISTS livros CASCADE;
        DROP TABLE IF EXISTS clientes CASCADE;
        DROP TABLE IF EXISTS admins CASCADE;
        DROP TABLE IF EXISTS generos CASCADE;
      `);
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS generos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(50) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS admins (
        id VARCHAR(36) PRIMARY KEY,
        nome VARCHAR(80) NOT NULL,
        email VARCHAR(80) UNIQUE NOT NULL,
        senha VARCHAR(120) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS clientes (
        id VARCHAR(36) PRIMARY KEY,
        nome VARCHAR(80) NOT NULL,
        email VARCHAR(80) UNIQUE NOT NULL,
        senha VARCHAR(120) NOT NULL,
        cidade VARCHAR(60) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS livros (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(120) NOT NULL,
        autor VARCHAR(80) NOT NULL,
        ano INT NOT NULL,
        preco NUMERIC(10, 2) NOT NULL,
        paginas INT DEFAULT 250,
        conservacao VARCHAR(60) DEFAULT 'Novo - Lacrado',
        foto TEXT NOT NULL,
        sinopse_ia TEXT,
        destaque BOOLEAN DEFAULT true,
        genero_id INT REFERENCES generos(id) ON DELETE RESTRICT,
        admin_id VARCHAR(36) REFERENCES admins(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS propostas (
        id SERIAL PRIMARY KEY,
        cliente_id VARCHAR(36) REFERENCES clientes(id) ON DELETE CASCADE,
        livro_id INT REFERENCES livros(id) ON DELETE CASCADE,
        descricao TEXT NOT NULL,
        resposta TEXT,
        admin_id VARCHAR(36) REFERENCES admins(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const { rows: countGeneros } = await pool.query("SELECT COUNT(*) FROM generos");
    if (Number(countGeneros[0].count) === 0) {
      const g1 = await pool.query("INSERT INTO generos (nome) VALUES ('Ficção Científica') RETURNING id");
      const g2 = await pool.query("INSERT INTO generos (nome) VALUES ('Fantasia') RETURNING id");
      const g3 = await pool.query("INSERT INTO generos (nome) VALUES ('Literatura Brasileira') RETURNING id");
      const g4 = await pool.query("INSERT INTO generos (nome) VALUES ('Suspense e Mistério') RETURNING id");

      const senhaAdmin = bcrypt.hashSync("123456", 10);
      const adminId = crypto.randomUUID();
      await pool.query(
        "INSERT INTO admins (id, nome, email, senha) VALUES ($1, $2, $3, $4)",
        [adminId, "Andre Santos", "admin@capitulo2.com", senhaAdmin]
      );

      const senhaCliente = bcrypt.hashSync("123456", 10);
      const c1 = crypto.randomUUID();
      const c2 = crypto.randomUUID();
      const c3 = crypto.randomUUID();
      const c4 = crypto.randomUUID();

      await pool.query(
        `INSERT INTO clientes (id, nome, email, senha, cidade) VALUES
        ($1, 'Silvana Santos', 'sil@gmail.com', $5, 'Pelotas'),
        ($2, 'Maria Souza', 'maria@gmail.com', $5, 'Pelotas'),
        ($3, 'Isabela de Nóbrega', 'isabela@gmail.com', $5, 'Rio Grande'),
        ($4, 'Pedro Moraes', 'pedro@gmail.com', $5, 'Bagé')`,
        [c1, c2, c3, c4, senhaCliente]
      );

      const l1 = await pool.query(
        `INSERT INTO livros (titulo, autor, ano, preco, paginas, conservacao, foto, destaque, genero_id, admin_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [
          "Duna - Edição Especial Capa Dura",
          "Frank Herbert",
          2021,
          89.90,
          680,
          "Capa Dura • Acompanha sobrecapa e marcador",
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
          true,
          g1.rows[0].id,
          adminId
        ]
      );

      const l2 = await pool.query(
        `INSERT INTO livros (titulo, autor, ano, preco, paginas, conservacao, foto, destaque, genero_id, admin_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [
          "O Senhor dos Anéis: A Sociedade do Anel",
          "J.R.R. Tolkien",
          2019,
          74.50,
          576,
          "Capa Dura • Ilustrado por Alan Lee",
          "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?auto=format&fit=crop&w=800&q=80",
          true,
          g2.rows[0].id,
          adminId
        ]
      );

      const l3 = await pool.query(
        `INSERT INTO livros (titulo, autor, ano, preco, paginas, conservacao, foto, destaque, genero_id, admin_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [
          "Dom Casmurro - Edição Comentada",
          "Machado de Assis",
          2020,
          45.00,
          320,
          "Brochura • Papel Pólen Soft 80g",
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
          true,
          g3.rows[0].id,
          adminId
        ]
      );

      const l4 = await pool.query(
        `INSERT INTO livros (titulo, autor, ano, preco, paginas, conservacao, foto, destaque, genero_id, admin_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
        [
          "A Torre Negra: O Pistoleiro",
          "Stephen King",
          2017,
          58.00,
          288,
          "Brochura • Excelente estado de conservação",
          "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=800&q=80",
          true,
          g2.rows[0].id,
          adminId
        ]
      );

      await pool.query(
        `INSERT INTO livros (titulo, autor, ano, preco, paginas, conservacao, foto, destaque, genero_id, admin_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          "1984 - Edição de Colecionador",
          "George Orwell",
          2022,
          62.00,
          416,
          "Capa Dura • Tradução direta e posfácio inédito",
          "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=800&q=80",
          false,
          g1.rows[0].id,
          adminId
        ]
      );

      await pool.query(
        `INSERT INTO livros (titulo, autor, ano, preco, paginas, conservacao, foto, destaque, genero_id, admin_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          "O Silêncio dos Inocentes",
          "Thomas Harris",
          2018,
          52.90,
          384,
          "Capa Dura • Corte lateral pintado",
          "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80",
          true,
          g4.rows[0].id,
          adminId
        ]
      );

      await pool.query(
        `INSERT INTO propostas (cliente_id, livro_id, descricao, resposta, admin_id) VALUES
        ($1, $2, 'Ofereço R$ 75,00 à vista no PIX ou troco por box Fundação.', NULL, NULL),
        ($3, $4, 'Pago R$ 65,00 à vista e retiro hoje na loja.', 'Ok. Venha conversar conosco. Proposta boa.', $7),
        ($5, $6, 'Faço proposta de R$ 40,00 à vista.', 'Ok. Aceitamos. Fica reservado até sábado.', $7)`,
        [c1, l1.rows[0].id, c3, l2.rows[0].id, c4, l3.rows[0].id, adminId]
      );
    }
  } catch (err) {
    console.error("Erro ao inicializar banco:", err.message);
  }
}

initDB();

function verificaToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ erro: "Token não informado" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ erro: "Token inválido" });
  }
}

async function obterDadosIA(livro) {
  const prompt = `Gere uma sinopse e ficha de leitura em português sobre o livro "${livro.titulo}" de "${livro.autor}" (Gênero: ${livro.genero_nome}, ${livro.paginas} páginas).
Responda apenas um JSON válido no formato:
{
  "sinopse": "Sinopse completa do livro em 3 a 4 frases.",
  "pontosFortes": [
    "Ponto forte 1",
    "Ponto forte 2",
    "Ponto forte 3",
    "Ponto forte 4"
  ],
  "pontosAtencao": [
    "Ponto de atenção ou complexidade 1",
    "Ponto de atenção ou complexidade 2"
  ],
  "tempoCidade": "8 a 10 horas",
  "publico": "Leitores de ${livro.genero_nome}"
}`;

  try {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const limpo = rawText.replace(/```json|```/g, "").trim();
        const json = JSON.parse(limpo);
        if (json.sinopse) return json;
      }
    }
  } catch (e) {}

  const horas = Math.max(3, Math.round((livro.paginas || 280) / 35));
  return {
    sinopse: `"${livro.titulo}", escrito por ${livro.autor}, é uma obra marcante de ${livro.genero_nome} que acompanha conflitos profundos, dilemas morais e reviravoltas intensas ao longo de suas ${livro.paginas || 280} páginas. A narrativa constrói um universo imersivo onde cada decisão dos personagens altera de forma definitiva o rumo da história.`,
    pontosFortes: [
      `Construção de mundo detalhada e narrativa envolvente característica de ${livro.autor}`,
      "Personagens complexos com forte desenvolvimento psicológico ao longo dos capítulos",
      `Excelente edição de ${livro.ano} com ${livro.paginas || 280} páginas e ótimo acabamento editorial`,
      `Obra de referência dentro do gênero de ${livro.genero_nome}`
    ],
    pontosAtencao: [
      "Ritmo de leitura denso em capítulos descritivos que exigem maior atenção aos detalhes",
      "Trama com múltiplas camadas e subtramas interligadas"
    ],
    tempoCidade: `${horas} a ${horas + 2} horas (cerca de ${Math.ceil((livro.paginas || 280) / 25)} dias lendo 30 min/dia)`,
    publico: `Apreciadores de ${livro.genero_nome} e leitores que buscam narrativas imersivas`
  };
}

app.get("/generos", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM generos ORDER BY nome");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get("/livros", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT l.*, g.nome AS genero_nome
      FROM livros l
      JOIN generos g ON l.genero_id = g.id
      ORDER BY l.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get("/livros/destaques", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT l.*, g.nome AS genero_nome
      FROM livros l
      JOIN generos g ON l.genero_id = g.id
      WHERE l.destaque = true
      ORDER BY l.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get("/livros/pesquisa/:termo", async (req, res) => {
  const { termo } = req.params;
  const num = Number(termo);
  try {
    if (!isNaN(num)) {
      const { rows } = await pool.query(
        `SELECT l.*, g.nome AS genero_nome
         FROM livros l
         JOIN generos g ON l.genero_id = g.id
         WHERE l.ano = $1 OR l.preco <= $2
         ORDER BY l.id DESC`,
        [num, num]
      );
      return res.json(rows);
    }

    const { rows } = await pool.query(
      `SELECT l.*, g.nome AS genero_nome
       FROM livros l
       JOIN generos g ON l.genero_id = g.id
       WHERE l.titulo ILIKE $1 OR l.autor ILIKE $1 OR g.nome ILIKE $1
       ORDER BY l.id DESC`,
      [`%${termo}%`]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get("/livros/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT l.*, g.nome AS genero_nome
       FROM livros l
       JOIN generos g ON l.genero_id = g.id
       WHERE l.id = $1`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ erro: "Livro não encontrado" });
    }

    const livro = rows[0];
    let dadosIA = null;

    if (livro.sinopse_ia) {
      try {
        dadosIA = JSON.parse(livro.sinopse_ia);
      } catch (e) {
        dadosIA = null;
      }
    }

    if (!dadosIA) {
      dadosIA = await obterDadosIA(livro);
      await pool.query("UPDATE livros SET sinopse_ia = $1 WHERE id = $2", [
        JSON.stringify(dadosIA),
        livro.id
      ]);
    }

    res.json({ ...livro, dadosIA });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post("/livros", verificaToken, async (req, res) => {
  const { titulo, autor, ano, preco, paginas, conservacao, foto, genero_id } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO livros (titulo, autor, ano, preco, paginas, conservacao, foto, genero_id, admin_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        titulo,
        autor,
        Number(ano),
        Number(preco),
        Number(paginas || 250),
        conservacao || "Novo - Lacrado",
        foto,
        Number(genero_id),
        req.adminId
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

app.delete("/livros/:id", verificaToken, async (req, res) => {
  try {
    await pool.query("DELETE FROM livros WHERE id = $1", [req.params.id]);
    res.json({ mensagem: "Livro removido com sucesso" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

app.patch("/livros/destacar/:id", verificaToken, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT destaque FROM livros WHERE id = $1", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ erro: "Não encontrado" });

    const novoStatus = !rows[0].destaque;
    const atualizado = await pool.query(
      "UPDATE livros SET destaque = $1 WHERE id = $2 RETURNING *",
      [novoStatus, req.params.id]
    );
    res.json(atualizado.rows[0]);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

app.post("/clientes", async (req, res) => {
  const { nome, email, senha, cidade } = req.body;
  if (!nome || !email || !senha || !cidade) {
    return res.status(400).json({ erro: "Preencha todos os campos" });
  }
  try {
    const hash = bcrypt.hashSync(senha, 10);
    const id = crypto.randomUUID();
    const { rows } = await pool.query(
      "INSERT INTO clientes (id, nome, email, senha, cidade) VALUES ($1, $2, $3, $4, $5) RETURNING id, nome, email, cidade",
      [id, nome, email, hash, cidade]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ erro: "E-mail já cadastrado ou dados inválidos" });
  }
});

app.post("/clientes/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const { rows } = await pool.query("SELECT * FROM clientes WHERE email = $1", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ erro: "E-mail ou senha incorretos" });
    }
    const cliente = rows[0];
    if (!bcrypt.compareSync(senha, cliente.senha)) {
      return res.status(400).json({ erro: "E-mail ou senha incorretos" });
    }
    res.json({
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      cidade: cliente.cidade
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get("/clientes/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, nome, email, cidade FROM clientes WHERE id = $1",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ erro: "Cliente não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get("/clientes", verificaToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.id, c.nome, c.email, c.cidade, c.created_at,
       COUNT(p.id) AS total_propostas
       FROM clientes c
       LEFT JOIN propostas p ON p.cliente_id = c.id
       GROUP BY c.id
       ORDER BY c.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.delete("/clientes/:id", verificaToken, async (req, res) => {
  try {
    await pool.query("DELETE FROM clientes WHERE id = $1", [req.params.id]);
    res.json({ mensagem: "Cliente excluído" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

app.get("/propostas", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*,
             l.titulo AS livro_titulo, l.autor AS livro_autor, l.ano AS livro_ano, l.preco AS livro_preco, l.foto AS livro_foto,
             c.nome AS cliente_nome, c.email AS cliente_email
      FROM propostas p
      JOIN livros l ON p.livro_id = l.id
      JOIN clientes c ON p.cliente_id = c.id
      ORDER BY p.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get("/propostas/cliente/:clienteId", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*,
              l.titulo AS livro_titulo, l.autor AS livro_autor, l.ano AS livro_ano, l.preco AS livro_preco, l.foto AS livro_foto
       FROM propostas p
       JOIN livros l ON p.livro_id = l.id
       WHERE p.cliente_id = $1
       ORDER BY p.id DESC`,
      [req.params.clienteId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post("/propostas", async (req, res) => {
  const { cliente_id, livro_id, descricao } = req.body;
  if (!cliente_id || !livro_id || !descricao) {
    return res.status(400).json({ erro: "Dados incompletos" });
  }
  try {
    const { rows } = await pool.query(
      "INSERT INTO propostas (cliente_id, livro_id, descricao) VALUES ($1, $2, $3) RETURNING *",
      [cliente_id, Number(livro_id), descricao]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

app.patch("/propostas/:id", verificaToken, async (req, res) => {
  const { resposta } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE propostas SET resposta = $1, admin_id = $2 WHERE id = $3 RETURNING *",
      [resposta, req.adminId, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

app.delete("/propostas/:id", verificaToken, async (req, res) => {
  try {
    await pool.query("DELETE FROM propostas WHERE id = $1", [req.params.id]);
    res.json({ mensagem: "Proposta removida" });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

app.post("/admins/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const { rows } = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ erro: "Credenciais inválidas" });
    }
    const admin = rows[0];
    if (!bcrypt.compareSync(senha, admin.senha)) {
      return res.status(400).json({ erro: "Credenciais inválidas" });
    }
    const token = jwt.sign({ id: admin.id, nome: admin.nome }, JWT_SECRET, { expiresIn: "12h" });
    res.json({
      id: admin.id,
      nome: admin.nome,
      email: admin.email,
      token
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get("/dashboard/gerais", async (req, res) => {
  try {
    const c = await pool.query("SELECT COUNT(*) FROM clientes");
    const l = await pool.query("SELECT COUNT(*) FROM livros");
    const p = await pool.query("SELECT COUNT(*) FROM propostas");
    res.json({
      clientes: Number(c.rows[0].count),
      livros: Number(l.rows[0].count),
      propostas: Number(p.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get("/dashboard/livrosGenero", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT g.nome AS genero, COUNT(l.id) AS num
      FROM generos g
      LEFT JOIN livros l ON l.genero_id = g.id
      GROUP BY g.nome
      HAVING COUNT(l.id) > 0
    `);
    res.json(rows.map(r => ({ genero: r.genero, num: Number(r.num) })));
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get("/dashboard/clientesCidade", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT cidade, COUNT(id) AS num
      FROM clientes
      GROUP BY cidade
    `);
    res.json(rows.map(r => ({ cidade: r.cidade, num: Number(r.num) })));
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});