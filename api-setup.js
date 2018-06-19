// function to pull data from TasteD!ve
function getDataFromTasteDive (movieTitle, callback) {
	// set up the query
	const query = {
		q: `${movieTitle}`,
		type: 'movies',
		info: 1,
		limit: 12,
		k: '310324-SchoolPr-806Y2U29',
	}
	// now actually pull the data from the query, and run the callback...
	$.ajax({
		url: 'https://tastedive.com/api/similar',
		data: query,
		dataType: 'jsonp',
		success: callback,
		error: apiErrorMessage,
	});
}

// function to get data from TMDB
function getDataFromTMDB (movieTitle, callback) {
	// set up the query
	const query = {
		query: `${movieTitle}`,
		api_key: 'f502398e5f11045021445204a2e34722',
	}

	// pull the data
	$.ajax({
		url: 'https://api.themoviedb.org/3/search/movie',
		data: query,
		dataType: 'jsonp',
		success: callback,
		error: apiErrorMessage,
	});
}

// function get specific data from TMDB
function getSpecificDataFromTMDB (movieID, callback) {
	// set up the query
	const query = {
		api_key: 'f502398e5f11045021445204a2e34722',
	}
	// pull the data
	$.ajax({
		url: `https://api.themoviedb.org/3/movie/${movieID}`,
		data: query,
		dataType: 'jsonp',
		success: callback,
		error: apiErrorMessage,
	});
}