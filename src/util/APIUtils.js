import {
    API_BASE_URL,
    POLL_LIST_SIZE,
    ACCESS_TOKEN,
    CITY_LIST_SIZE,
    MOVIE_LIST_SIZE,
    LIST_SIZE,
    OMDB_URI
} from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function getAllPolls(page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/api/polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getAllMovies(page, size) {
    page = page || 0;
    size = size || MOVIE_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/api/movies?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getMovie(movieId) {
    return request({
        url: API_BASE_URL + "/api/movies/" + movieId,
        method: 'GET'
    });
}

export function getTheatersForMovieInCity(movieId, cityId, page, size) {
    page = page || 0;
    size = size || LIST_SIZE;
    return request({
        url: API_BASE_URL + "/api/theaters/" + movieId + "/" + cityId,
        method: 'GET'
    })
}

export function getMovieDetailsFromIMDB(movieImdbId) {
    return request({
       url: OMDB_URI + movieImdbId,
       method: 'GET'
    });
}

export function createPoll(pollData) {
    return request({
        url: API_BASE_URL + "/api/polls",
        method: 'POST',
        body: JSON.stringify(pollData)         
    });
}

export function getAllCitiesForCountry(page, size) {
    page = page || 0;
    size = size || CITY_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/api/cities?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function castVote(voteData) {
    return request({
        url: API_BASE_URL + "/api/polls/" + voteData.pollId + "/votes",
        method: 'POST',
        body: JSON.stringify(voteData)
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/api/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/api/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/api/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/api/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}


export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/api/user/me",
        method: 'GET'
    });
}

export function getUserProfile(username) {
    return request({
        url: API_BASE_URL + "/api/users/" + username,
        method: 'GET'
    });
}

export function getUserCreatedPolls(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/api/users/" + username + "/polls?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function getUserVotedPolls(username, page, size) {
    page = page || 0;
    size = size || POLL_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/api/users/" + username + "/votes?page=" + page + "&size=" + size,
        method: 'GET'
    });
}