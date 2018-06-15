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
		<button class="restart-button js-error-go-back-button">
			Go back and try again
		</button>
	`);
	// hide the search screen
	$('.search-screen').prop('hidden', true);
	// show the error screen
	$('.error-screen').prop('hidden', false);
}

function spellingErrorMessage (searchedString) {
	$('.js-err-message').html(`
		<p>I couldn't find any results matching ${searchedString}! Please go back and check your spelling or try again later.</p>
		<button class="restart-button js-error-go-back-button">
			Go back and try again
		</button>
	`);
	// hide the search screen
	$('.search-screen').prop('hidden', true);
	// show the error screen
	$('.error-screen').prop('hidden', false);
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
		// Get this movie's data from TMDB
		// First, set up the next movie we're checking in the queue, while removing it from the queue
		let currentMovie = data.Similar.Results.shift();
		// get basic data from TMDB (this api requires two calls to get the data I want, grrrr)
		getDataFromTMDB(currentMovie.Name, function (movieInfo) {
			// store the TMDB ID in a variable
			let tmdbID = movieInfo.results[0].id;
			// get the specific data I want from TMDB
			getSpecificDataFromTMDB(tmdbID, function (specificInfo) {
				// append data to the <li>
				$('.js-movie-card-list').append(`
					<li class="col-6 movie-card">
						<img src="http://i3.ytimg.com/vi/${currentMovie.yID}/hqdefault.jpg" alt="Click this image to watch the ${currentMovie.Name} trailer">
						<h3>${currentMovie.Name}</h3>
						<p class="movie-year">${specificInfo.release_date}</p>
						<p class="movie-plot">${specificInfo.overview}</p>
						<p class="movie-rating">${specificInfo.vote_average}</p>
						<p class="movie-link">${specificInfo.imdb_id}</p>
					</li>
				`);
			});
			// Check if there is still something in the queue
			if (data.Similar.Results.length) {
				// go back and run it all over again if there is something in the queue
				displayDataFromTasteDive(data);
			}
			// since the queue is empty, the function will end
		});
		// hide the search screen
		$('.search-screen').prop('hidden', true);
		// show the results screen
		$('.results-screen').prop('hidden', false);
	}
}

function watchSubmit () {
	$('.js-input-form').submit(function (event) {
		// prevent the form from submitting
		event.preventDefault();
		// get the information from the form and clear it
		const searchedMovie = $(this).find('.js-input-box').val();
		$(this).find('.js-input-box').val("");
		getDataFromTasteDive (searchedMovie, displayDataFromTasteDive);
	});
}

function watchRestart () {
	$('.js-restart-button').click(function (event) {
		// prevent default behavior of restart button
		event.preventDefault();
		// hide the results screen
		$('.results-screen').prop('hidden', true);
		// delete the results from the list
		$('.js-movie-card-list').html('');
		// show the search screen
		$('.search-screen').prop('hidden', false);
	})
}

function watchErrorRestart () {
	$('.js-err-message').on('click', '.js-error-go-back-button', function (event) {
		// prevent default behavior
		event.preventDefault();
		// hide the error screen
		$('.error-screen').prop('hidden', true);
		// reset the error message
		$('.js-err-message').html('');
		// show the search screen
		$('.search-screen').prop('hidden', false);
	})
}

function loadPage () {
	$('.js-input-box').focus();
	watchSubmit();
	watchRestart();
	watchErrorRestart();
}

$(loadPage);