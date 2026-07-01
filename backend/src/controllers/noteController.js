const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');

exports.getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json({ success: true, count: notes.length, data: notes });
});

exports.getNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: note });
});

exports.createNote = asyncHandler(async (req, res) => {
  const note = await Note.create({ ...req.body, createdBy: req.user?.id });
  res.status(201).json({ success: true, data: note });
});

exports.updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!note) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: note });
});

exports.deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ success: false, message: 'Not found' });
  await note.remove();
  res.json({ success: true, message: 'Deleted' });
});
