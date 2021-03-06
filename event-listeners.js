// listen for the search submit
function watchSubmit () {
	$('.js-input-form').submit(function (event) {
		// prevent the form from submitting
		event.preventDefault();
		// hide the results screen
		$('.results-screen').prop('hidden', true);
		// hide the error screen
		$('.error-screen').prop('hidden', true);
		// delete the results from the list
		$('.js-movie-card-list').html('');
		// get the information from the form and clear it
		const searchedMovie = $(this).find('.js-input-box').val();
		getDataFromTasteDive (searchedMovie, displayDataFromTasteDive);
	});
}

// listen for the restart button
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