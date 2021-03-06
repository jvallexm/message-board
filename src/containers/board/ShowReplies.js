import React from 'react';
import HandleDelete from './HandleDelete.js';
import PostReply from './PostReply.js';
import Flag from './HandleFlag.js';

export default class ShowReplies extends React.Component{
  constructor(props)
  {
    super(props)
    {
      this.state = {
        replyingTo: undefined,
        replying: false
      }
    }
  }
  render()
  {
   return(
    <div className="reply">
    {this.props.replies.map((d,i)=>
            <div className="text-left"
                 key = {d + " " + i}>
              {d.text}
              <div className="smol">
                <span> <Flag post = {d} 
                             flag = {()=>this.props.flagPost(d, 1)}/> </span>
                  {this.props.parseDate(d.posted_on)} <span className="green">#{d._id}</span>                
                <span className="red"
                      onClick={()=>this.props.deleteToggle(d)}> Delete</span>
                <span className="blue"
                      onClick={()=>this.props.replyToggle(d)}> Reply</span>
              </div>
              {this.props.deleting && this.props.deletingTo._id == d._id?
              
               <HandleDelete toDelete     = {d}
                             deleteToggle = {()=>this.props.deleteToggle(d)}
                             deletePost   = {()=>this.props.deletePost(d,1)}/>
                             
              :""}                    
              {d.replies.map((dd,i)=>
                      <div className="text-left reply"
                           key={d.name + "reply" + i}>
                        {dd.text}
                          <div className="smol">
                            <span> <Flag post = {dd} 
                                         flag = {()=>this.props.flagPost(dd, 2)}/> </span>
                              {this.props.parseDate(dd.posted_on)} <span className="green">#{dd._id}</span> 
                            <span className="red"
                                  onClick={()=>this.props.deleteToggle(dd)}> Delete</span>
                          </div>
                        {this.props.deleting && this.props.deletingTo._id == dd._id?
                                     <HandleDelete toDelete={dd}
                                                   deleteToggle={()=>this.props.deleteToggle(dd)}
                                                   deletePost={()=>this.props.deletePost(dd,2)}
                                                    />
                         :""}   
                      </div>
              )}
              {this.props.replying && this.props.replyingTo._id == d._id?
              
               <PostReply pushReply   =  {this.props.pushReply}
                          root        =  {false}
                          replyToggle =  {()=>this.props.replyToggle(d)}
                          replyingTo  =  {d}/>
              :""}
            </div>
    )}
    </div>  
  );
  }   
}