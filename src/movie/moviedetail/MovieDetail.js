import React, { Component } from 'react';
import { getMovie } from '../../util/APIUtils';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './MovieDetail.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import { PageHeader, Typography, Row, Col, Button } from 'antd';
import {OMDB_URI} from "../../constants";
import {Link} from "react-router-dom";


const { Paragraph } = Typography;

const Description = ({ term, children, span = 12 }) => (
    <Col span={span}>
        <div className="description">
            <b>{term}:</b> {children}
        </div>
    </Col>
);

class MovieDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movie: null,
            isLoading: false,
            cityid: 3,
            movieImdb: {
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
        this.loadMovie = this.loadMovie.bind(this);
    }

    loadMovie(movieId) {
        this.setState({
            isLoading: true
        });

        getMovie(movieId)
            .then(response => {
                this.setState({
                    movie: response,
                    isLoading: false
                });
            }).catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
    }

    componentDidMount() {
        const movieId = this.props.match.params.movieId;
        const imdbId = this.props.match.params.imdbId;
        this.loadMovie(movieId);
        fetch(OMDB_URI+imdbId )
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoading: false,
                        movieImdb: result
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
        if(this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        const tabBarStyle = {
            textAlign: 'center'
        };

        return (
            <div className="profile">
                {
                    this.state.movie ? (
                        <PageHeader
                            onBack={() => window.history.back()}
                            title={this.state.movieImdb.Title}
                            subTitle={this.state.movieImdb.Genre}
                            style={{marginTop:'100px'}}
                            extra={[
                                <Link className="movie-link" to={`/api/theaters/${this.state.movie.id}/${this.state.cityid}`}>
                                    <Button type="primary" block>
                                        Book Tickets
                                    </Button>
                                </Link>

                            ]}
                        >

                            <div className="wrap">
                                    <div className="content">
                                        <Paragraph>
                                            {this.state.movieImdb.Plot}
                                        </Paragraph>
                                        <Row>
                                            <Description term="Rated">{this.state.movieImdb.Rated}</Description>
                                            <Description term="Release Date">{this.state.movieImdb.Released}</Description>
                                            <Description term="RunTime">{this.state.movieImdb.Runtime}</Description>
                                            <Description term="Director">{this.state.movieImdb.Director}</Description>
                                            <Description term="Actors">{this.state.movieImdb.Actors}</Description>
                                            <Description term="Production">{this.state.movieImdb.Production}</Description>
                                        </Row>
                                    </div>
                                <div className="extraContent">
                                    <Row>
                                    <img
                                        src={this.state.movieImdb.Poster}
                                        alt=""
                                    />
                                    </Row>

                                </div>
                            </div>
                        </PageHeader>
                    ): null
                }
            </div>
        );
    }
}

export default MovieDetail;