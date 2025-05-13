'use strict';
const express = require('express');
const router = express.Router();

const FilmService = require('../services/filmService');
const FilmDao = require('../dao/filmDao');
const filmService = new FilmService(new FilmDao());


router.get('/films', async(req, res) => {
  try {
    const filter = req.query.filter;
    const result = await filmService.getFilmList(filter);
    res.json(result);
  }
  catch(err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/films/:id', async(req, res) => {
  try {
    const filmId = req.params.id;
    const result = await filmService.getFilmById(filmId);
    res.json(result);
  }
  catch(err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/films', async(req, res) => {
  const body = req.body;
  try{
    const result = await filmService.addFilm(body);
    res.json(result);
  }
  catch(err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/films/:id/favorite', async(req, res) => {
  const filmId = req.params.id;
  const body = req.body;
  try {
    const result = await filmService.updateFavorite(filmId, body.favorite);
    res.json(result);
  }
  catch(err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/films/:id/rating', async(req, res) => {
  const filmId = req.params.id;
  const body = req.body;
  try {
    const result = await filmService.updateRating(filmId, body.deltaRating);
    res.json(result);
  }
  catch(err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/films/:id', async(req, res) => {
  const filmId = req.params.id;
  const body = req.body;
  try {
    const result = await filmService.updateFilm(filmId, body);
    res.json(result);
  }
  catch(err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/films/:id', async(req, res) => {
  const filmId = req.params.id;
    try {
    const result = await filmService.deleteFilm(filmId);
    res.json(result);
  }
  catch(err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;