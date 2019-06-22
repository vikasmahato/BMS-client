import React, { Component } from 'react';
import { getMovie } from '../../util/APIUtils';
import { Avatar, Tabs } from 'antd';
import { getAvatarColor } from '../../util/Colors';
import { formatDate } from '../../util/Helpers';
import LoadingIndicator  from '../../common/LoadingIndicator';
import './MovieDetail.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import Button from "antd/es/button";
import {Link} from "react-router-dom";

const TabPane = Tabs.TabPane;

class MovieDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movie: null,
            isLoading: false,
            cityid: 3
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
        this.loadMovie(movieId);
    }

    componentDidUpdate(nextProps) {
        if(this.props.match.params.movieId !== nextProps.match.params.movieId) {
            this.loadMovie(nextProps.match.params.movieId);
        }
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
                        <div className="user-profile">
                            <div className="user-details">
                                <div className="user-avatar">
                                    <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.movie.title)}}>

                                    </Avatar>
                                </div>
                                <div className="user-summary">
                                    <div className="full-name">{this.state.movie.title}</div>
                                    <div className="username">@{this.state.movie.title}</div>
                                    <div className="user-joined">

                                    </div>
                                </div>
                            </div>
                            <div>
                                <Link className="movie-link" to={`/api/theaters/${this.state.movie.id}/${this.state.cityid}`}>
                                    <Button type="primary" block>
                                        Book Tickets
                                    </Button>
                                </Link>

                            </div>
                            <div className="user-poll-details">
                                <Tabs defaultActiveKey="1"
                                      animated={false}
                                      tabBarStyle={tabBarStyle}
                                      size="large"
                                      className="profile-tabs">
                                    <TabPane tab="Details" key="1">
                                        Details go here
                                    </TabPane>
                                    <TabPane tab="Reviews"  key="2">
                                        Reviews go here
                                    </TabPane>
                                </Tabs>
                            </div>
                        </div>
                    ): null
                }
            </div>
        );
    }
}

export default MovieDetail;