# What Movie Should I Watch?

## Live Demo

[Hosted on GitHub Pages](https://alysebos.github.io/what-movie-should-i-watch)

## About this API Hack Capstone Project

### General Overview

This web app was designed to help you figure out what to watch. It will also give you detailed information about the movies, and provide a link to IMDB to see more.

### Screenshots of Pages Within the App

Landing Page:

![alt text](https://i.imgur.com/t5bxZLt.png "Screenshot of the landing page of the app")

Results Page:

![alt text](https://i.imgur.com/kmIECU8.png "Screenshot of the movie suggestions page of the app")

API Error Page:

![alt text](https://i.imgur.com/F9dWjlx.png "Screenshot of the API error page of the app")

Input Error Page:

![alt text](https://i.imgur.com/wCTHC9F.png "Screenshot of the input error page of the app")

### The App's User Stories

As a user...

1. I can see a landing page with a description of what the app does and I can clearly see how to interact with the app.
2. I can type a movie title into the search box and submit the search. I will immediately be notified if the text field was empty.
3. I can see an error screen if there is a problem with getting the data, or if there were no results. These will be two separate error screens.
	* **To trigger API error:** Type a valid movie into the search box, and mash "search" until the API kicks back an error.
	* **To trigger no-results error:** Enter gibberish into the search field.
4. If the search was valid, and returned results, I will see a page with twelve suggested movies the app has determined I may enjoy.
	* The movies will display on a responsive mosaic-style grid, which collapses from 3 to 2 to 1 columns at set screen-widths.
5. I can scroll through and read information about all twelve movies, including their plot, release year, and review rating.
6. If there is not detailed information available about the movie, I can still see a simplified version of the suggestion using data from the first source.
	* **To see this in action:** Search "Ponyo." Some of the results should be the simplified card.
7. I can click the title of the movie to see the movie's poster.
8. I can click a link to see the IMDB page for the movie.
9. I can start a new search by typing into the search box and resubmitting a new movie.
10. I can start a new search by clicking the button on the bottom of the suggestions.

### Built Using

To create this app I used the following:

* JavaScript
	* jQuery
* HTML & CSS