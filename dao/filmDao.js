'use strict';

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

function FilmDao() {
  const dbPath = 'db/films.db';

  const db = new sqlite.Database(dbPath, (err) => {
    if (err) throw err;
    else console.log('Database connected.');
  });

  // --- Public Methods ---

  this.getByFilter = function (filter) {
    let sql;
    switch (filter) {
      case 'favorite':
        sql = 'SELECT * FROM films WHERE favorite = 1';
        break;
      case 'best':
        sql = 'SELECT * FROM films WHERE rating = 5';
        break;
      case 'unseen':
        sql = 'SELECT * FROM films WHERE watchdate IS NULL';
        break;
      case 'lastmonth':
        sql = "SELECT * FROM films WHERE watchdate >= date('now', '-30 days') AND watchdate IS NOT NULL";
        break;
      default:
        sql = 'SELECT * FROM films';
    }
    return queryDb(sql);
  };

  this.getFilmById = function (filmId) {
    const sql = 'SELECT * FROM films WHERE id = ?';
    return queryDb(sql, [filmId]);
  };

  this.getFilmRatingById = function (id) {
    const sql = 'SELECT rating FROM films WHERE id = ?';
    return queryDb(sql, [id]);
  };

  this.addFilm = function (film) {
    const sql = 'INSERT INTO films (title, favorite, watchdate, rating) VALUES (?, ?, ?, ?)';
    const params = [
      film.title,
      film.favorite,
      film.watchdate ? dayjs(film.watchdate).format('YYYY-MM-DD') : null,
      film.rating
    ];
    return executeSql(sql, params);
  };

  this.updateFilmFavorite = function (id, favorite) {
    const sql = 'UPDATE films SET favorite = ? WHERE id = ?';
    return executeSql(sql, [favorite, id]);
  };

  this.updateFilmRating = function (id, rating) {
    const sql = 'UPDATE films SET rating = ? WHERE id = ?';
    return executeSql(sql, [rating, id]);
  };

  this.updateFilm = function (id, updatedFields) {
    const keys = Object.keys(updatedFields);
    if (keys.length === 0) {
      return Promise.resolve(); // No update needed
    }

    const setClause = keys.map((key) => `${key} = ?`).join(', ');
    const values = keys.map((key) =>
      updatedFields[key] === undefined ? null : updatedFields[key]
    );

    const sql = `UPDATE films SET ${setClause} WHERE id = ?`;
    values.push(id);
    return executeSql(sql, values);
  };

  this.deleteFilm = function (id) {
    const sql = 'DELETE FROM films WHERE id = ?';
    return executeSql(sql, [id]);
  };

  // --- Private Methods ---

  function queryDb(sql, params = []) {
    console.log('Running SQL:', sql, params);
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  function executeSql(sql, params = []) {
    console.log('Running SQL:', sql, params);
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }
}

module.exports = FilmDao;
