const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');


// Helper functions for reading and writing to the db.json file
const { readFromFile, writeToFile, readAndAppend } = require('../helper/fsUtils');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  readFromFile(path.join(__dirname, '../db/db.json')).then((data) => res.json(JSON.parse(data)));
});

// POST Route for submitting notes
notes.post('/', (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, path.join(__dirname, '../db/db.json'));

    res.json(`Note added successfully 🚀`);
  } else {
    res.error('Error in adding note');
  }
});

// DELETE Route for deleting notes
notes.delete('/:id', (req, res) => {
  const noteId = req.params.id;

  readFromFile(path.join(__dirname, '../db/db.json')).then((data) => {
    const notes = JSON.parse(data);
    const updatedNotes = notes.filter((note) => note.id !== noteId);

    writeToFile(path.join(__dirname, '../db/db.json'), updatedNotes);
    res.json(`Note with ID ${noteId} deleted 🚀`);
  });
});

module.exports = notes;
