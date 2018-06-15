const tasteDiveURL = 'https://tastedive.com/api/similar';

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
		url: tasteDiveURL,
		data: query,
		dataType: 'jsonp',
		success: callback,
	});
}

/*
// Delete this eventually -- uses dummy data so I'm not pulling my API constantly
const tasteDiveData = tasteSample;

// Delete this eventually -- loads the dummy data similarly to how the getJSON will work
function getDataFromTasteDive (uselessArg, callback) {
	callback(tasteDiveData);
}
*/

// set up the OMDB URL
const omdbURL = 'https://www.omdbapi.com';

// get data from OMDB
function getDataFromOMDB (movieTitle, callback) {
	const query = {
		t: `${movieTitle}`,
		type: 'movie',
		apikey: '8d8c7d25',
	}
	$.ajax({
		url: omdbURL,
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

// Display data from OMDB
function displayDataFromOMDB (data){

}

// Displays the data from the API
function displayDataFromTasteDive (data) {
	console.log(data);
	// check if there is are no results
	if (data.error) {
		// set up error screen
		apiErrorMessage(data.error);
	} else if (data.Similar.Results.length == 0) {
		// set up error screen stating no matches found
		spellingErrorMessage(data.Similar.Info[0].Name);
	} else {
		// set up the results variable and start the function to map through each item of the array I need within the API results
		// const results = data.Similar.Results.forEach(item => {
			// Get this movie's data from OMDB
			let currentMovie = data.Similar.Results.shift();
			getDataFromOMDB(currentMovie.Name, function (movieInfo) {
				//append all data into the <ul>
				$('.js-movie-card-list').append(`
					<li class="col-6 movie-card">
						<p>${currentMovie.yID}</p>
						<h3>${currentMovie.Name}</h3>
						<p class="movie-year">${movieInfo.Year}</p>
						<p class="movie-plot">${movieInfo.Plot}</p>
						<p class="movie-rating">${movieInfo.imdbRating}</p>
						<p class="movie-link">${movieInfo.imdbID}</p>
					</li>
				`);
				if (data.Similar.Results.length) {
					displayDataFromTasteDive(data);
				}
			});
		// });
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