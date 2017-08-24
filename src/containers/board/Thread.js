import React from 'react';
import ShowReplies from './ShowReplies.js';
import HandleDelete from './HandleDelete.js';
import PostReply from './PostReply.js';

export default class Thread extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      replying: false,
      replyingTo: undefined,
      deleting: false,
      deletingTo: undefined
    }
    this.deletePost = this.deletePost.bind(this);
    this.getReplies = this.getReplies.bind(this);
    this.parseDate = this.parseDate.bind(this);
    this.pushReply = this.pushReply.bind(this);
  }
  componentWillMount()
  {
  }
  getReplies()
  {
    let replies = this.props.thread.replies.length;
    for(let i=0;i<this.props.thread.replies.length;i++)
    {
      replies += this.props.thread.replies[i].replies.length;
    }
    return replies;
  }
  parseDate(date)
  {
    let returnDate = new Date(date*1000);
    let dateString = returnDate.getMonth()+1
                   + "/"
                   + returnDate.getDate()
                   + "/"
                   + returnDate.getFullYear()
                   + " @ "
                   + returnDate.getHours()
                   + ":";
    if(returnDate.getMinutes() < 10)
    {
      dateString += "0";
    }
    dateString+=returnDate.getMinutes();
    return dateString;
  }
  pushReply(replyingTo,root,reply)
  {
    let thread = this.props.thread;
    if(root)
    {
      thread.replies.push(reply);
    }
    else
    {
      for(let i=0;i<thread.replies.length;i++)
      {
        if(thread.replies[i]._id == replyingTo._id)
        {
          thread.replies[i].replies.push(reply);
        }
      }
    }
    //thread.bumped_on = Math.round((new Date()).getTime() / 1000);
    this.props.repliesOff();
    this.props.updateThread(thread);
  }
  deletePost(deletingTo,root)
  {
    console.log("trying to delete post.. " + root);
    if(root==0)
    {
      this.props.clearAll();
      this.props.popThread(deletingTo);
    }
  }
  render()
  {
    return(      
      <div className="thread">
          <div className="thread-head middle-text">
            <div className="row">
                 <div className="col-md-9 text-left col-left">
                    <div>
                      {this.props.thread.name}
                    </div>  
                  </div> 
                  <div className="col-md-2 middle-text col-left col-right">
                    <span> {this.getReplies()} <i className="fa fa-comments" /></span>
                  </div>
                  <div className="col-md-1 middle-text col-right">
                    <i className="fa fa-flag red"
                       title={"Flag This Post"} />
                  </div>  
             </div>
          </div>  
        <div>
          <div className="text-left">
            {this.props.thread.text}
             <div className="smol">
               <span className="red"> <i className="fa fa-flag" 
                                         title={"Flag This Post"}/> </span>
                  {this.parseDate(this.props.thread.posted_on)}
               <span className="red"
                     onClick={()=>this.props.deleteToggle(this.props.thread)}> Delete </span>
               <span className="blue"
                     onClick={()=>this.props.replyToggle(this.props.thread)}> Reply</span>
             </div>
             {
              this.props.replying && this.props.replyingTo == this.props.thread 
              ?
              <PostReply pushReply={this.pushReply}
                         root={true}
                         replyToggle={()=>this.props.replyToggle(this.props.thread)}
                         replyingTo={this.state.thread}/>
              :
              ""
             }
             {
              this.props.deleting && this.props.deletingTo == this.props.thread 
              ?
              <HandleDelete toDelete={this.props.thread}
                            deleteToggle={()=>this.props.deleteToggle(this.props.thread)}
                            deletePost={()=>this.deletePost(this.props.thread,0)}/>
              :
              ""
             }
          </div>
          <div className="replies">
            <ShowReplies replies={this.props.thread.replies} 
                         replyToggle={this.props.replyToggle}
                         replying={this.props.replying}
                         replyingTo={this.props.replyingTo}
                         pushReply={this.pushReply}
                         parseDate={this.parseDate}
                         deleteToggle={this.props.deleteToggle}
                         deleting={this.props.deleting}
                         deletingTo={this.props.deletingTo} />
          </div>  
        </div>
      </div>   
     
    );
  }
}