import React from 'react';

export default class NewThread extends React.Component{
  constructor(props)
  {
    super(props)
    this.state = {
      thread: {
        _id: undefined,
        name: "",
        text: "",
        delete_password: "",
        replies: [],
        bumped_on: 10,
        posted_on: "1",
      },
      message: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e)
  {
    let thread = this.state.thread;
    if(e.target.name == "name" && e.target.value.length > 50)
    {
      this.setState({message: "Sorry, titles can't be longer than 50 characters"});
      return false;
    }
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
    thread[e.target.name] = e.target.value;
    this.setState({thread: thread, message: ""});
  }
  handleSubmit()
  {
    let thread = this.state.thread;
    if(thread.name.length < 5)
    {
      this.setState({message: "Thread titles must be at least 5 characters long"});
      return false;
    }
    if(thread.text.length < 5)
    {
      this.setState({message: "Posts must be at least 5 characters long"});
      return false;
    }
    if(thread.delete_password.length < 5)
    {
      this.setState({message: "Delete keys must be at least 5 characters long"});
      return false;
    }  
    thread.posted_on = Math.round((new Date()).getTime() / 1000);
    thread.bumped_on = Math.round((new Date()).getTime() / 1000);
    thread._id = Math.round((new Date()).getTime() / 1000);
    this.props.pushThread(this.props.board,thread,true);
    this.props.cancel();
  }
  render()
  {
    return(
      <div className="thread">
        <div className="thread-head">
          New Thread
        </div>
        <div className="red from-top error">
          {this.state.message}
        </div>  
        <div className="replies from-top">
          <div className="row">
             <div className="col-md-3 col-left">
                Title
             </div>
             <div className="col-md-9 col-right">
                <input className="width-100" 
                       placeholder={"New Thread Title"}
                       name={"name"}
                       onChange={this.handleChange}
                       value={this.state.thread.name}/>
             </div>  
          </div>
          <div className="row">
             <div className="col-md-3 col-left middle-text">
                Post
             </div>
             <div className="col-md-9 col-right">
                <textarea className="width-100" 
                       placeholder={"What your thread is all about"}
                       name={"text"}
                       onChange={this.handleChange}
                       value={this.state.thread.text} />
             </div>  
          </div>
          <div className="row">
             <div className="col-md-3 col-left">
                Image (Optional)
             </div>
             <div className="col-md-9 col-right">
                <input className="width-100" 
                       placeholder={"Image URL (optional)"}
                       name={"attachment"}
                       onChange={this.handleChange}
                       value={this.state.thread.attachment}/>
             </div>  
          </div>
          <div className="row">
          <div className="col-md-3 col-left">
                Delete Key
             </div>
             <div className="col-md-9 col-right">
                <input className="width-100" 
                       placeholder={"Your password to delete this post"}
                       name={"delete_password"}
                       onChange={this.handleChange}
                       value={this.state.thread.delete_password}/>
             </div>  
          </div>
          <div>
          <button className="thread-head board-head btn from-top"
                  onClick={this.handleSubmit}>
            Submit
          </button>  
          <button className="lil-space thread-head board-head btn from-top cancel"
                  onClick={this.props.cancel}>
            Cancel
          </button>     
          </div>  
        </div>  
      </div>  
    );    
  }
}