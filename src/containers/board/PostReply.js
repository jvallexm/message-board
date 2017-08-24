import React from 'react';

export default class PostReply extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      reply: {
          text: "",
          posted_on: 0,
          delete_password: "",
          replies: [],
          flagged: false
      },
      message: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e)
  {
    let reply = this.state.reply;
    if(e.target.name == "text" && e.target.value.length > 500)
    {
      this.setState({message: "Sorry, posts can't be longer than 500 characters"});
      return false;
    }
    if(e.target.name == "delete_password" && e.target.value.length > 20)
    {
      this.setState({message: "Sorry, detele keys can't be longer than 20 characters"});
      return false;
    }
    reply[e.target.name] = e.target.value;
    reply.posted_on = Math.round((new Date()).getTime() / 1000);
    reply._id = Math.round((new Date()).getTime() / 1000);
    this.setState({thread: reply, message: ""});
  }
  handleSubmit()
  {
    let reply = this.state.reply;
    if(reply.text.length < 5)
    {
      this.setState({message: "Posts must be at least 5 characters long"});
      return false;
    }
    if(reply.delete_password.length < 5)
    {
      this.setState({message: "Delete keys must be at least 5 characters long"});
      return false;
    }
    reply.posted_on = Math.round((new Date()).getTime() / 1000);
    reply._id = Math.round((new Date()).getTime() / 1000);
    this.props.pushReply(this.props.replyingTo,this.props.root,reply);
    this.props.replyToggle();
  }
  render()
  {
    return(    
      <div className="text-center container-fluid">
        <div className="red error">{this.state.message}</div>        
        <div className="row">
          <div className="col-md-2 col-left lil middle-text">
            Reply
          </div>  
          <div className="col-md-10 col-right">
            <textarea className="width-100 smol lefty"
                      onChange={this.handleChange}
                      name={"text"}
                      value={this.state.reply.text}/>
          </div>
          <div className="col-md-2 col-left lil middle-text">
            Delete Key
          </div>  
          <div className="col-md-6 col-right col-left">
            <input className="width-100 smol lefty"
                   onChange={this.handleChange}
                   name={"delete_password"}
                   value={this.state.reply.delete_password}/>
          </div>  
          <div className="col-md-2 col-left col-right post">
            <button className="btn btn-smol smol width-100"
                    onClick={this.handleSubmit}>
              Post
            </button>  
          </div>
          <div className="col-md-2 col-right post ">
            <button className="btn btn-smol smol width-100 cancel"
                    onClick={this.props.replyToggle}>
              Cancel
            </button>  
          </div>  
        </div>  
      </div>
      
    );
  }
}