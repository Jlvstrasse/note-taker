document.addEventListener('DOMContentLoaded', () => {
    const noteList = document.getElementById('list-group');
    const noteTitle = document.querySelector('.note-title');
    const noteText = document.querySelector('.note-textarea');
    const saveNoteBtn = document.querySelector('.save-note');
    const newNoteBtn = document.querySelector('.new-note');
    const clearFormBtn = document.querySelector('.clear-btn');
    let activeNote = {};

    // Fetch notes from the server
    const getNotes = async () => {
        const response = await fetch('/api/notes');
        const notes = await response.json();
        return notes;
    };

    // Render notes to the sidebar
    const renderNoteList = async () => {
        const notes = await getNotes();
        noteList.innerHTML = '';
        notes.forEach(note => {
            const li = document.createElement('li');
            li.textContent = note.title;
            li.classList.add('list-group-item');
            li.setAttribute('data-id', note.id);
            li.addEventListener('click', () => setActiveNote(note));
            noteList.appendChild(li);
        });
    };

    // Set active note and display it in the input fields
    const setActiveNote = (note) => {
        activeNote = note;
        noteTitle.value = note.title;
        noteText.value = note.text;
        saveNoteBtn.style.display = 'none';
        clearFormBtn.style.display = 'inline';
        newNoteBtn.style.display = 'inline';
    };

    // Save the note
    const saveNote = async () => {
        const newNote = {
            title: noteTitle.value,
            text: noteText.value,
        };

        if (activeNote.id) {
            newNote.id = activeNote.id;
        }

        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newNote),
        });

        const savedNote = await response.json();
        activeNote = savedNote;
        renderNoteList();
        clearForm();
    };

    // Clear the input fields
    const clearForm = () => {
        noteTitle.value = '';
        noteText.value = '';
        activeNote = {};
        saveNoteBtn.style.display = 'inline';
        clearFormBtn.style.display = 'none';
        newNoteBtn.style.display = 'none';
    };

    // Event listeners
    saveNoteBtn.addEventListener('click', saveNote);
    clearFormBtn.addEventListener('click', clearForm);
    newNoteBtn.addEventListener('click', clearForm);

    // Initial rendering of notes
    renderNoteList();
});

