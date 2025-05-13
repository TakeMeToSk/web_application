//redunt param will eat your value
function Film(title, favorite, watchdate, rating)
{
    this.title = title;
    this.favorite = favorite;
    this.watchdate = watchdate;
    this.rating = rating;
}

module.exports = Film;