import React, { Component } from 'react';
import { getAllMovies } from '../util/APIUtils';
import Movie from './Movie';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Button, Icon } from 'antd';
import { MOVIE_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './MovieList.css';
import { Row } from 'antd';
import { chunk } from 'lodash';

class MovieList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movies: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        };
        this.loadMovieList = this.loadMovieList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadMovieList(page = 0, size = MOVIE_LIST_SIZE) {
        let promise = getAllMovies(page, size);

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise
            .then(response => {
                const movies = this.state.movies.slice();

                this.setState({
                    movies: movies.concat(response.content),
                    page: response.page,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    last: response.last,
                    isLoading: false
                })
            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });

    }

    componentDidMount() {
        this.loadMovieList();
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                movies: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                currentVotes: [],
                isLoading: false
            });
            this.loadMovieList();
        }
    }

    handleLoadMore() {
        this.loadMovieList(this.state.page + 1);
    }

    render() {
        const movieViews = [];
        this.state.movies.forEach((movie, movieIndex) => {
            movieViews.push(<Movie
                key={movie.id}
                movie={movie}/>)
        });

        const movieSections = chunk(movieViews, 3);

        const rows = [];
        movieSections.forEach((movieSection, rowNum) => {
            rows.push(<Row key={rowNum} gutter={16}>{movieSection}</Row>)
        });


        return (
            <div className="movies-container">
                {rows}

                {
                    !this.state.isLoading && this.state.movies.length === 0 ? (
                        <div className="no-movies-found">
                            <span>No Movies Found.</span>
                        </div>
                    ): null
                }
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-movies">
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus" /> Load more
                            </Button>
                        </div>): null
                }
                {
                    this.state.isLoading ?
                        <LoadingIndicator />: null
                }
            </div>
        );
    }
}

export default withRouter(MovieList);