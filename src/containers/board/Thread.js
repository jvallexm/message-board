import React from 'react';
import ShowReplies from './ShowReplies.js';
import HandleDelete from './HandleDelete.js';
import PostReply from './PostReply.js';
import Flag from './HandleFlag.js';

export default class Thread extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      replying    : false,
      replyingTo  : undefined,
      deleting    : false,
      deletingTo  : undefined
    };
    this.deletePost = this.deletePost.bind(this);
    this.getReplies = this.getReplies.bind(this);
    this.parseDate  = this.parseDate.bind(this);
    this.pushReply  = this.pushReply.bind(this);
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
    this.props.updateThread(this.props.currentBoard, thread, true);
  }
  deletePost(deletingTo,root)
  {
    console.log("trying to delete post.. " + root);
    if(root==0)
    {
      this.props.clearAll();
      this.props.popThread(this.props.currentBoard, deletingTo, true);
    }
    if(root==1)
    {
      let thread = this.props.thread;
      let newReplies = [];
      for(let i=0;i<thread.replies.length;i++)
      {
        if(thread.replies[i]._id != deletingTo._id)
          newReplies.push(thread.replies[i]);
      }
      thread.replies = newReplies;
      this.props.clearAll();
      this.props.updateThread(this.props.currentBoard, thread, true);
    }
    if(root==2)
    {
      let thread = this.props.thread;
      for(let i=0;i<thread.replies.length;i++)
      {
        let newReplies = []; 
        //console.log("old replies");
        //console.log(thread.replies[i].replies);
        //console.log("deletingTo _id: " + deletingTo._id);
        for(let j=0;j<thread.replies[i].replies.length;j++)
        {
          if(thread.replies[i].replies[j]._id != deletingTo._id)
            newReplies.push(thread.replies[i].replies[j]);
        }
        //console.log("New replies: " + newReplies.length)
        thread.replies[i].replies = newReplies;
      }
      this.props.clearAll();
      this.props.updateThread(this.props.currentBoard, thread, true, false);
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
                    <Flag post = {this.props.thread} />
                  </div>  
             </div>
          </div>  
        <div>
          <div className="text-left">
            <div>
              {this.props.thread.attachment != undefined && this.props.thread.attachment != "" ?
              <img className="img-reg" src={this.props.thread.attachment}/> : ""}
                   <div className={this.props.thread.attachment != undefined ? "wordwrap" : ""}>
                    {this.props.thread.text}
                   </div>  
            </div>
             <div className="smol">
               <span> <Flag post = {this.props.thread} /> </span>
                  {this.parseDate(this.props.thread.posted_on)}
               <span className="red"
                     onClick={()=>this.props.deleteToggle(this.props.thread)}> Delete </span>
               <span className="blue"
                     onClick={()=>this.props.replyToggle(this.props.thread)}> Reply</span>
             </div>
             {
              this.props.replying && this.props.replyingTo._id == this.props.thread._id 
              ?
              <PostReply pushReply={this.pushReply}
                         root={true}
                         replyToggle={()=>this.props.replyToggle(this.props.thread)}
                         replyingTo={this.state.thread}/>
              :
              ""
             }
             {
              this.props.deleting && this.props.deletingTo._id == this.props.thread._id 
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
                         deletingTo={this.props.deletingTo} 
                         deletePost={this.deletePost}/>
          </div>  
        </div>
      </div>   
     
    );
  }
}