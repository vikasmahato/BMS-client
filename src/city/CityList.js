import React, { Component } from 'react';
import { getAllCitiesForCountry } from '../util/APIUtils';
import City from './City';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Button, Icon, notification } from 'antd';
import { CITY_LIST_SIZE} from '../constants';
import { withRouter } from 'react-router-dom';
import './CityList.css';

class CityList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cities: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        };
        this.loadCityList = this.loadCityList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadCityList(page = 0, size = POLL_LIST_SIZE) {
        let promise = getAllCitiesForCountry(page, size);

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise
            .then(response => {
                const polls = this.state.polls.slice();
                const currentVotes = this.state.currentVotes.slice();

                this.setState({
                    polls: polls.concat(response.content),
                    page: response.page,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    last: response.last,
                    currentVotes: currentVotes.concat(Array(response.content.length).fill(null)),
                    isLoading: false
                })
            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });

    }

    componentDidMount() {
        this.loadCityList();
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                polls: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                currentVotes: [],
                isLoading: false
            });
            this.loadCityList();
        }
    }

    handleLoadMore() {
        this.loadCityList(this.state.page + 1);
    }

    handleVoteChange(event, pollIndex) {
        const currentVotes = this.state.currentVotes.slice();
        currentVotes[pollIndex] = event.target.value;

        this.setState({
            currentVotes: currentVotes
        });
    }


    handleVoteSubmit(event, pollIndex) {
        event.preventDefault();
        if(!this.props.isAuthenticated) {
            this.props.history.push("/login");
            notification.info({
                message: 'Book My Show',
                description: "Please login to vote.",
            });
            return;
        }

        const poll = this.state.polls[pollIndex];
        const selectedChoice = this.state.currentVotes[pollIndex];

        const voteData = {
            pollId: poll.id,
            choiceId: selectedChoice
        };

        castVote(voteData)
            .then(response => {
                const polls = this.state.polls.slice();
                polls[pollIndex] = response;
                this.setState({
                    polls: polls
                });
            }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login to vote');
            } else {
                notification.error({
                    message: 'Book My Show',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            }
        });
    }

    render() {
        const pollViews = [];
        this.state.polls.forEach((poll, pollIndex) => {
            pollViews.push(<Poll
                key={poll.id}
                poll={poll}
                currentVote={this.state.currentVotes[pollIndex]}
                handleVoteChange={(event) => this.handleVoteChange(event, pollIndex)}
                handleVoteSubmit={(event) => this.handleVoteSubmit(event, pollIndex)} />)
        });

        return (
            <div className="polls-container">
                {pollViews}
                {
                    !this.state.isLoading && this.state.polls.length === 0 ? (
                        <div className="no-polls-found">
                            <span>No Polls Found.</span>
                        </div>
                    ): null
                }
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-polls">
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

export default withRouter(CityList);