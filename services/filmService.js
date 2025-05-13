const dayjs = require('dayjs');

const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

function FilmService(filmDao) {
  this.filmDao = filmDao;


  this.isValidDate = function(dateStr) {
    return dayjs(dateStr, 'YYYY-MM-DD', true).isValid();
  };

  this.validateTitle = function(title) {
    if (typeof title !== 'string' || title.trim() === '') {
      throw new Error('Title must be a non-empty string');
    }
  };

  this.validateFavorite = function(favorite) {
    if (typeof favorite !== 'number' || !Number.isInteger(favorite)) {
      throw new Error('Favorite must be an integer');
    }
    if (favorite !== 0 && favorite !== 1) {
      throw new Error('Favorite can only be 0 or 1');
    }
  };

  this.validateRating = function(rating) {
    if (typeof rating !== 'number' || !Number.isInteger(rating)) {
      throw new Error('Rating must be an integer');
    }
    if (!(rating > 0 && rating < 6)) {
      throw new Error('Rating must between 1 and 5');
    }
  };

  this.validateWatchDate = function(dateStr) {
    const valid = dayjs(dateStr, 'YYYY-MM-DD', true).isValid();
    if (!valid) {
      throw new Error(`Invalid watchdate format: ${dateStr}. Expected format: YYYY-MM-DD`);
    }
  };

  this.getFilmList = async function(filter) {
    try {
      const result = await filmDao.getByFilter(filter);
      if (!Array.isArray(result)) {
        throw new Error('Invalid result from DAO');
      }
      return result;
    } catch (err) {
      console.error('Error getting film list:', err.message);
      throw err;
    }
  };

  this.getFilmById = async function(id) {
    try {
      const result = await filmDao.getFilmById(id);
      if (result.length === 0) {
        throw new Error('Film does not exist');
      }
      return result;
    } catch (err) {
      console.error('Error getting film by ID:', err.message);
      throw err;
    }
  };

  this.addFilm = async function(film) {
    console.log(film);
    try {
      this.validateTitle(film.title);

      if (film.favorite === undefined) {
        film.favorite = 0;
      } else {
        this.validateFavorite(film.favorite);
      }
      if (!film.watchDate || film.watchDate.trim() === '') {
        film.watchDate = null;
      } else {
        this.validateWatchDate(film.watchDate);
      }

      if (film.rating === undefined) {
        film.rating = null;
      } else {
        this.validateRating(film.rating);
      }

      const result = await filmDao.addFilm(film);
      if (result.changes !== 1) {
        throw new Error('Failed to add film');
      }

      return true;
    } catch (err) {
      console.error('Error adding film:', err.message);
      throw err;
    }
  };

  this.updateFavorite = async function(id, favorite) {
    console.log(favorite);
    try {
      if (favorite === undefined) {
        throw new Error('please specify if favorite');
      } else {
        this.validateFavorite(favorite);
      }

      const result = await filmDao.updateFilmFavorite(id, favorite);
      if (result.changes !== 1) {
        throw new Error('Failed to update favorite');
      }

      return true;
    } catch (err) {
      console.error('Error updating favorite:', err.message);
      throw err;
    }
  };


  this.updateFilm = async function(id, updates) {
    console.log(updates);
    try {
      if ('title' in updates) {
        this.validateTitle(updates.title);
      }

      if ('favorite' in updates) {
        if (updates.favorite === undefined) {
          updates.favorite = 0;
        } else {
          this.validateFavorite(updates.favorite);
        }
      }

      if ('watchDate' in updates) {
        if (updates.watchDate === undefined) {
          updates.watchDate = null;
        } else {
          this.validateWatchDate(updates.watchDate);
        }
      }

      if ('rating' in updates) {
        if (updates.rating === undefined) {
          updates.rating = null;
        } else {
          this.validateRating(updates.rating);
        }
      }
      
      const result = await filmDao.updateFilm(id, updates);
      if (result.changes !== 1) {
        throw new Error('Failed to update film');
      }

      return true;
    } catch (err) {
      console.error('Error updating film:', err.message);
      throw err;
    }
  };

  this.updateRating = async function(id, deltaRating) {
    
    try {
      const result = await filmDao.getFilmRatingById(id);
      if (result.length === 0) {
        throw new Error('Film does not exist');
      }

      const currentRating = result[0].rating;
      let finalRating = currentRating === null ? deltaRating : currentRating + deltaRating;
      if (finalRating > 5) finalRating = 5;
      else if (finalRating < 0) finalRating = 1;

      const result1 = await filmDao.updateFilmRating(id, finalRating);
      if (result1.changes !== 1) {
        throw new Error('Failed to update rating');
      }

      return true;
    } catch (err) {
      console.error('Error updating rating:', err.message);
      throw err;
    }
  };

  this.deleteFilm = async function(id) {
    try {
      const result = await filmDao.deleteFilm(id);
      if (result.changes !== 1) {
        throw new Error(`Film with ID ${id} not found or could not be deleted`);
      }
      return true;
    } catch (err) {
      console.error('Error deleting film:', err.message);
      throw err;
    }
  };
}

module.exports = FilmService;
