// function to pull data from TasteD!ve
function getDataFromTasteDive (movieTitle, callback) {
	// set up the query
	const query = {
		q: `${movieTitle}`,
		type: 'movies',
		info: 1,
		limit: 8,
		k: '310324-SchoolPr-806Y2U29',
	}
	// now actually pull the data from the query, and run the callback...
	$.ajax({
		url: 'https://tastedive.com/api/similar',
		data: query,
		dataType: 'jsonp',
		success: callback,
	});
}

// function to get data from TMDB
function getDataFromTMDB (movieTitle, callback) {
	const query = {
		query: `${movieTitle}`,
		api_key: 'f502398e5f11045021445204a2e34722',
	}
	$.ajax({
		url: 'https://api.themoviedb.org/3/search/movie',
		data: query,
		dataType: 'jsonp',
		success: callback,
	});
}

// function get specific data from TMDB
function getSpecificDataFromTMDB (movieID, callback) {
	const query = {
		api_key: 'f502398e5f11045021445204a2e34722',
	}
	$.ajax({
		url: `https://api.themoviedb.org/3/movie/${movieID}`,
		data: query,
		dataType: 'jsonp',
		success: callback,
	});
}

function apiErrorMessage (errReturned) {
	$('.js-err-message').html(`
		<p>There was a problem loading data. The following error message was displayed:</p>
		<p>${errReturned}</p>
		<p>Please try again later, or if the problem persists just give up and watch the movie you just searched for. You like it any way!</p>
	`);
	// show the error screen
	$('.error-screen').prop('hidden', false);
}

function spellingErrorMessage (searchedString) {
	$('.js-err-message').html(`
		<p>I couldn't find any results matching ${searchedString}! Please go back and check your spelling or try again later.</p>
	`);
	// show the error screen
	$('.error-screen').prop('hidden', false);
}

//get the star string
function renderStarString (movieRating) {
	// whole stars should be the floor of the rating
	let numOfWholeStars = Math.floor(movieRating);
	// getting the remaining star value without rounding was being weird, so I rounded to nearest tenth
	let remainingStarValue = Math.round(10 * (movieRating - numOfWholeStars))/10;
	// initiate whether there is a fraction star
	let fractionStar = false;
	// set the values to determine whether there's a fraction star
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

// Displays the data from the API
function displayDataFromTasteDive (data) {
	// check if there is are no results
	if (data.error) {
		// set up error screen
		apiErrorMessage(data.error);
	} else if (data.Similar.Results.length == 0) {
		// set up error screen stating no matches found
		spellingErrorMessage(data.Similar.Info[0].Name);
	} else {
		// results screen header
		$('.results-screen').find('h2').html(`If you like ${data.Similar.Info[0].Name}, then you might also like...`);
		// Get this movie's data from TMDB
		// First, set up the next movie we're checking in the queue, while removing it from the queue
		let currentMovie = data.Similar.Results.shift();
		// get basic data from TMDB (this api requires two calls to get the data I want, grrrr)
		getDataFromTMDB(currentMovie.Name, function (movieInfo) {
			// if there is very lmited data in TMDB for the movie, make a simplified card
			if (movieInfo.results.length == 0 || movieInfo.results[0].poster_path == null || movieInfo.results[0].backdrop_path == null || movieInfo.results[0].vote_count == 0) {
				// create and store the simplified card in the array
				$('.js-movie-card-list').append(`
					<li class="col-6 movie-card-list-item">
						<div class="movie-card">
							<div class="movie-card-info">
								<h3>
									${currentMovie.Name}
								</h3>
								<p class="movie-year">Detailed information on this movie was not available.</p>
								<p class="movie-year">Here is a simplified version:</p>
								<p class="movie-plot">${currentMovie.wTeaser}</p>
								<p class="movie-link"><a href="https://www.imdb.com/find?q=${currentMovie.Name}" target="_blank">See more about ${currentMovie.Name} on IMDB</a></p>
							</div>
						</div>
					</li>
				`);
				// Check if there is still something in the queue
				if (data.Similar.Results.length) {
					// go back and run it all over again if there is something in the queue
					displayDataFromTasteDive(data);
				}
			} else {
			// store the TMDB ID in a variable
				const tmdbID = movieInfo.results[0].id;
				// get the specific data I want from TMDB
				getSpecificDataFromTMDB(tmdbID, function (specificInfo) {
					// I only want to use the year from the date
					const releaseYear = specificInfo.release_date.substring(0,4);
					// grab the star string using the vote average
					const starString = renderStarString(specificInfo.vote_average);
					// append data to the <li> - the youtube thumbnail should open in a lightbox
					$('.js-movie-card-list').append(`
						<li class="col-6 movie-card-list-item">
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
				});
				// Check if there is still something in the queue
				if (data.Similar.Results.length) {
					// go back and run it all over again if there is something in the queue
					displayDataFromTasteDive(data);
				}
			}
		});
		// since the queue is empty, the function will end
		// show the results screen
		$('.results-screen').prop('hidden', false);
	}
}

function watchSubmit () {
	$('.js-input-form').submit(function (event) {
		// hide the results screen
		$('.results-screen').prop('hidden', true);
		// hide the error screen
		$('.error-screen').prop('hidden', true);
		// delete the results from the list
		$('.js-movie-card-list').html('');
		// prevent the form from submitting
		event.preventDefault();
		// get the information from the form and clear it
		const searchedMovie = $(this).find('.js-input-box').val();
		getDataFromTasteDive (searchedMovie, displayDataFromTasteDive);
	});
}

function watchRestart () {
	$('.js-restart-button').click(function (event) {
		// prevent default behavior of restart button
		event.preventDefault();
		// reset the value in the search box
		$('.js-input-box').val('');
		// hide the results screen
		$('.results-screen').prop('hidden', true);
		// delete the results from the list
		$('.js-movie-card-list').html('');
	})
}

function loadPage () {
	watchSubmit();
	watchRestart();
}

$(loadPage);