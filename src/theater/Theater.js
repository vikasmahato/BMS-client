import React, { Component } from 'react';
import './Theater.css';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';

class Theater extends Component {

    render() {

        return (
            <div className="theater-content">
                <div className="theater-header">
                    <div className="theater-creator-info">
                        <Link className="creator-link" to={`/users/${this.props.theater.id}`}>
                            <Avatar className="theater-creator-avatar" 
                                style={{ backgroundColor: getAvatarColor(this.props.theater.name)}} >
                                {this.props.theater.name.toUpperCase()}
                            </Avatar>
                            <span className="theater-creator-name">
                              Span
                            </span>
                            <span className="theater-creator-username">
                                Span
                            </span>
                            <span className="theater-creation-date">
                                Span
                            </span>
                        </Link>
                    </div>
                    <div className="theater-question">

                    </div>
                </div>
                <div className="theater-footer">

                    <span className="separator">Footer</span>

                </div>
            </div>
        );
    }
}

export default Theater;