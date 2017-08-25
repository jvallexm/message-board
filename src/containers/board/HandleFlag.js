import React from 'react';

export default class Flag extends React.Component{
    render()
    {
        return(
            <i className = {this.props.post.flagged ? "fa fa-flag red" : "fa fa-flag flag-this"}
               title     = {this.props.post.flagged ? "This post has been flagged for removal." : "Flag this post as inappropriate"}
               onClick   = {this.props.post.flagged ? "" : this.props.flag }/>
        );
    }
}