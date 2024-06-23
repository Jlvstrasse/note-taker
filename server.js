const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes' });
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  if (!title || !text) {
    return res.status(400).json({ error: 'Please provide a title and text for the note' });
  }

  const newNote = { id: uuidv4(), title, text };

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes' });
    }

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save note' });
      }

      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes' });
    }

    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== id);

    fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete note' });
      }

      res.json({ message: 'Note deleted' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
