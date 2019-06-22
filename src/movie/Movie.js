import React, { Component } from 'react';
import './Movie.css';
import { Card, Col, Radio } from 'antd';
import {Link} from "react-router-dom";
import {OMDB_URI} from "../constants";

const { Meta } = Card;

class Movie extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            movie: {
                Title: null,
                Year: null,
                Rated: null,
                Released: null,
                Runtime: null,
                Genre: null,
                Director: null,
                Writer: null,
                Actors: null,
                Plot: null,
                Poster: null,
                Ratings: [],
                Production: null
            }
        }
    }

    componentDidMount() {
        fetch(OMDB_URI+this.props.movie.imdbId )
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoading: false,
                        movie: result
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoading: false,
                        error
                    });
                }
            )
    }

    render() {
        return (
            <Col span={8} style={{marginBottom: '20px'}}>
                <Link className="movie-link" to={`/api/movies/${this.props.movie.id}`}>
            <Card
                hoverable
                style={{ width: 260, height: 450 }}
                loading={this.state.isLoading}
                cover={<img alt={this.props.movie.id} src={this.state.movie.Poster} style={{height:350}}/>}
            >
                <Meta
                    title={this.state.movie.Title}
                    description={this.state.movie.Genre}
                />
            </Card>
                </Link>
            </Col>
        );
    }
}

export default Movie;