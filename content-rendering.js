// render the API error message
function apiErrorMessage (errReturned) {
	// set up the error message
	$('.js-err-message').html(`
		<p>There was a problem loading data from the database.</p>
		<p>Please try again later.</p>
		<p>If the problem persists, just give up and watch the movie you just searched for. You like it any way!</p>
	`);
	// show the error screen
	$('.error-screen').prop('hidden', false);
}

// render the spelling / no-results error message
function spellingErrorMessage (searchedString) {
	// set up the error message
	$('.js-err-message').html(`
		<p>I couldn't find any results matching "<i>${searchedString}</i>"! Please go back and check your spelling or try again later.</p>
	`);
	// show the error screen
	$('.error-screen').prop('hidden', false);
}

// render the simplified movie card
function renderSimplifiedResult (currentMovie)  {
	// This will show if there was no data about the movie in the TMDB API
	$('.js-movie-card-list').append(`
		<li class="movie-card-list-item masonry-item">
			<div class="movie-card">
				<div class="movie-card-info">
					<h3>
						${currentMovie.Name}
					</h3>
					<p class="movie-year">Detailed information on this movie was not available.</p>
					<p class="movie-year">Here is a simplified version:</p>
					<p class="movie-plot">${currentMovie.wTeaser}</p>
					<p class="movie-link"><a href="https://www.imdb.com/find?q=${currentMovie.Name}" target="_blank">Search for ${currentMovie.Name} on IMDB</a></p>
				</div>
			</div>
		</li>
	`);
}

// render the detailed movie card
function renderDetailedResult (currentMovie, starString, specificInfo, releaseYear) {
	// If the TMDB API provided detailed information, this will show
	$('.js-movie-card-list').append(`
		<li class="movie-card-list-item masonry-item">
			<div class="movie-card" style="background-image: url('https://image.tmdb.org/t/p/w1280${specificInfo.backdrop_path}');">
				<div class="movie-card-info">
					<h3><a href="#" data-featherlight="https://image.tmdb.org/t/p/w500${specificInfo.poster_path}">
						${currentMovie.Name}
					</a></h3>
					<p class="movie-year">Released in ${releaseYear}</p>
					<p class="movie-plot">${specificInfo.overview}</p>
					<p class="movie-rating">${starString}</p>
					<p class="movie-link"><a href="https://www.imdb.com/title/${specificInfo.imdb_id}" target="_blank">See more about ${currentMovie.Name} on IMDB</a></p>
				</div>
			</div>
		</li>
	`);
}

//get the star string
function renderStarString (movieRating) {
	// set whole stars to the Math.floor of the rating
	let numOfWholeStars = Math.floor(movieRating);
	// get the remaining star value. without rounding was being weird, so I rounded to nearest tenth
	let remainingStarValue = Math.round(10 * (movieRating - numOfWholeStars))/10;
	// initiate whether there is a fraction star
	let fractionStar = false;
	// if the decimal following the rating is between .3 and .8, the rating should get a half star
	if (remainingStarValue >= .3 && remainingStarValue <= .8) {
		fractionStar = true;
	// if the remaining star value is quite high, just bump it to next whole star, and remove fraction star if it's there
	} else if (remainingStarValue > .8) {
		numOfWholeStars++;
		fractionStar = false;
	}
	// set the number of empty stars to 10 minus the whole stars
	let numOfEmptyStars = 10 - numOfWholeStars;
	if (fractionStar) {
		// remove one empty star for the fraction star
		numOfEmptyStars--;
	}
	// set up the whole star string
	let starString = `<i class="fa fa-star"></i>`.repeat(numOfWholeStars);
	if (fractionStar) {
		// add the fraction star
		starString += `<i class="fa fa-star-half-o"></i>`;
	}
	// add the empty stars
	starString += `<i class="fa fa-star-o"></i>`.repeat(numOfEmptyStars);
	//return the string
	return starString;
}