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
	$.ajax ({
		url: tasteDiveURL,
		data: query,
		dataType: 'jsonp',
		success: callback,
	});
}

// Delete this eventually -- uses dummy data so I'm not pulling my API constantly
// const tasteDiveData = tasteSample;

// Delete this eventually -- loads the dummy data similarly to how the getJSON will work
// function getDataFromTasteDive (uselessArg, callback) {
// 	console.log('getting data');
// 	callback(tasteDiveData);
// }

// Displays the data from the API
function displayDataFromTasteDive (data) {
	// check if there is are no results
	if (data.error) {
		// set up error screen
		$('.js-err-message').html(`
			<p>There was a problem loading data. The following error message was displayed:</p>
			<p>${data.error}</p>
			<p>Please try again later, or if the problem persists just give up and watch the movie you just searched for. You like it any way!</p>
			<button class="restart-button js-error-go-back-button">
				Go back and try again
			</button>
		`);
		// hide the search screen
		$('.search-screen').prop('hidden', true);
		// show the error screen
		$('.error-screen').prop('hidden', false);
	} else if (data.Similar.Results.length == 0) {
		console.log(data);
		// set up error screen stating no matches found
		$('.js-err-message').html(`
			<p>I couldn't find any results matching ${data.Similar.Info[0].Name}! Please go back and check your spelling or try again later.</p>
			<button class="restart-button js-error-go-back-button">
				Go back and try again
			</button>
		`);
		// hide the search screen
		$('.search-screen').prop('hidden', true);
		// show the error screen
		$('.error-screen').prop('hidden', false);
	} else {
		// set up the results variable and start the function to map through each item of the array I need within the API results
		const results = data.Similar.Results.map(item => {
			// return the string which will be used for each list item
			return `
			<li class="col-6 movie-card">
				<embed src="https://www.youtube.com/embed/${item.yID}">
				<h3>${item.Name}</h3>
				<p class="release-year">Release Year</p>
				<p class="movie-plot">Movie plot</p>
				<p class="movie-rating">IMDB Rating:</p>
				<p class="rating-stars"><i>fa fa-star fa-star-half-o fa-star-o</i></p>
				<p class="imdb-link">IMDB link</p>
			</li>
		`;
		});
		// insert the results into the card list
		$('.js-movie-card-list').html(results);
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