const mongoose = require('mongoose');

const { Schema } = mongoose;

const NoteSchema = Schema({
    title: String,
    subtitle: String,
    description: String
}, { timestamps: true });

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;