// Importa Express, CORS e FS
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

// No Render usa a porta fornecida pelo servidor.
// Localmente usa a porta 3000.
const PORT = process.env.PORT || 3000;

const FILE = 'data.json';


// ======================================
// MIDDLEWARES
// ======================================

// Libera o acesso do frontend
app.use(cors());

// Permite receber JSON
app.use(express.json());


// ======================================
// FUNÇÃO PARA LER AS NOTAS
// ======================================

function readNotes() {
  try {
    const data = fs.readFileSync(FILE, 'utf8');

    return JSON.parse(data);

  } catch (erro) {

    console.log('Erro ao ler arquivo:', erro.message);

    return [];
  }
}


// ======================================
// FUNÇÃO PARA SALVAR AS NOTAS
// ======================================

function saveNotes(notes) {
  fs.writeFileSync(
    FILE,
    JSON.stringify(notes, null, 2)
  );
}


// ======================================
// GET - LISTAR NOTAS
// ======================================

app.get('/api/notes', (req, res) => {

  const notes = readNotes();

  res.json(notes);

});


// ======================================
// POST - CRIAR NOTA
// ======================================

app.post('/api/notes', (req, res) => {

  const notes = readNotes();

  const novaNota = {
    id: Date.now().toString(),
    titulo: req.body.titulo,
    texto: req.body.texto,
    criadoEm: new Date().toISOString()
  };

  notes.push(novaNota);

  saveNotes(notes);

  res.status(201).json(novaNota);

});


// ======================================
// PUT - EDITAR NOTA
// ======================================

app.put('/api/notes/:id', (req, res) => {

  const notes = readNotes();

  const index = notes.findIndex(
    nota => nota.id === req.params.id
  );

  if (index >= 0) {

    notes[index].titulo = req.body.titulo;
    notes[index].texto = req.body.texto;

    saveNotes(notes);

    res.json(notes[index]);

  } else {

    res.status(404).json({
      erro: 'Nota não encontrada'
    });

  }

});


// ======================================
// DELETE - EXCLUIR NOTA
// ======================================

app.delete('/api/notes/:id', (req, res) => {

  const notes = readNotes();

  const notaExiste = notes.some(
    nota => nota.id === req.params.id
  );

  if (!notaExiste) {

    return res.status(404).json({
      erro: 'Nota não encontrada'
    });

  }

  const novasNotas = notes.filter(
    nota => nota.id !== req.params.id
  );

  saveNotes(novasNotas);

  res.json({
    mensagem: 'Nota removida com sucesso'
  });

});


// ======================================
// INICIA O SERVIDOR
// ======================================

app.listen(PORT, () => {

  console.log(
    `Servidor rodando na porta ${PORT}`
  );

});