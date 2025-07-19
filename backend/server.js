const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Array para armazenar as pessoas
let pessoas = [];

// Rota de teste
app.get('/', (req, res) => {
    res.json({ 
        message: '🚀 API Cadastro de Pessoas funcionando!',
        version: '1.0.0',
        endpoints: {
            listar: 'GET /api/pessoas',
            cadastrar: 'POST /api/pessoas',
            deletar: 'DELETE /api/pessoas/:id'
        },
        total_pessoas: pessoas.length,
        timestamp: new Date().toISOString()
    });
});

// Listar pessoas
app.get('/api/pessoas', (req, res) => {
    res.json(pessoas);
});

// Cadastrar pessoa
app.post('/api/pessoas', (req, res) => {
    const { nome, email } = req.body;
    
    if (!nome || !email) {
        return res.status(400).json({ 
            erro: 'Nome e email são obrigatórios' 
        });
    }
    
    const emailExiste = pessoas.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (emailExiste) {
        return res.status(400).json({ 
            erro: 'Este email já está cadastrado' 
        });
    }
    
    const novaPessoa = {
        id: Date.now(),
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        dataCadastro: new Date().toISOString()
    };
    
    pessoas.push(novaPessoa);
    console.log(`✅ Nova pessoa: ${nome} (${email})`);
    
    res.status(201).json({ 
        sucesso: true, 
        pessoa: novaPessoa,
        total: pessoas.length
    });
});

// Deletar pessoa
app.delete('/api/pessoas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const indice = pessoas.findIndex(p => p.id === id);
    
    if (indice === -1) {
        return res.status(404).json({ erro: 'Pessoa não encontrada' });
    }
    
    const pessoaRemovida = pessoas[indice];
    pessoas.splice(indice, 1);
    console.log(`🗑️ Pessoa removida: ${pessoaRemovida.nome}`);
    
    res.json({ 
        sucesso: true,
        total: pessoas.length
    });
});

app.listen(PORT, () => {
    console.log(`🚀 API rodando na porta ${PORT}`);
    console.log(`⏰ ${new Date().toLocaleString('pt-BR')}`);
});
