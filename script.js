// Displays the data from the API ... This is the real guts of the app
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
				renderSimplifiedResult(currentMovie);
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
					renderDetailedResult(currentMovie, starString, specificInfo, releaseYear);
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

function loadPage () {
	watchSubmit();
	watchRestart();
}

$(loadPage);