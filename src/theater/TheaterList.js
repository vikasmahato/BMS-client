import React, { Component } from 'react';
import { getTheatersForMovieInCity} from '../util/APIUtils';
import Theater from './Theater';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Button, Icon, notification } from 'antd';
import { LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './TheaterList.css';

class TheaterList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theaters: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        };
        this.loadTheaterList = this.loadTheaterList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadTheaterList(movieId, cityId, page = 0, size = LIST_SIZE) {
        let promise = getTheatersForMovieInCity(movieId, cityId);;

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise            
        .then(response => {
            const theaters = this.state.theaters.slice();

            this.setState({
                theaters: theaters.concat(response.content),
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
        const movieId = this.props.match.params.movieId;
        const cityId = this.props.match.params.cityId;
        this.loadTheaterList(movieId, cityId);
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                theaters: [],
                totalElements: 0,
                isLoading: false
            });    
            this.loadTheaterList();
        }
    }

    handleLoadMore() {
        this.loadTheaterList(this.state.page + 1);
    }


    render() {
        const theaterViews = [];
        this.state.theaters.forEach((theater, theaterIndex) => {
            theaterViews.push(<Theater 
                key={theater.id} 
                theater={theater}/>)
        });

        return (
            <div className="theaters-container">
                {theaterViews}
                {
                    !this.state.isLoading && this.state.theaters.length === 0 ? (
                        <div className="no-theaters-found">
                            <span>No Theaters Found.</span>
                        </div>    
                    ): null
                }  
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-theaters"> 
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

export default withRouter(TheaterList);