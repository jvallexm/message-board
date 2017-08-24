import React from 'react';
import HandleDelete from './HandleDelete.js';
import PostReply from './PostReply.js';

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
                <span className="red"> <i className="fa fa-flag" 
                                          title={"Flag this post"}/> </span>
                  {this.props.parseDate(d.posted_on)}                
                <span className="red"
                      onClick={()=>this.props.deleteToggle(d)}> Delete</span>
                <span className="blue"
                      onClick={()=>this.props.replyToggle(d)}> Reply</span>
              </div>
              {this.props.replying && this.props.replyingTo == d?
               <PostReply pushReply={this.props.pushReply}
                          root={false}
                          replyToggle={()=>this.props.replyToggle(d)}
                          replyingTo={d}/>
              :""}
              {this.props.deleting && this.props.deletingTo == d?
               <HandleDelete toDelete={d}
                             deleteToggle={()=>this.props.deleteToggle(d)}/>
              :""}                    
              {d.replies.map((dd,i)=>
                      <div className="text-left reply"
                           key={d.name + "reply" + i}>
                        {dd.text}
                          <div className="smol">
                            <span className="red"
                                  > <i className="fa fa-flag" 
                                       title={"Flag this post"}/> </span>
                              {this.props.parseDate(dd.posted_on)}  
                            <span className="red"
                                  onClick={()=>this.props.deleteToggle(dd)}> Delete</span>
                          </div>
                        {this.props.deleting && this.props.deletingTo == dd?
                                     <HandleDelete toDelete={dd}
                                                   deleteToggle={()=>this.props.deleteToggle(dd)}
                                                    />
                         :""}   
                      </div>
              )}
            </div>
    )}
    </div>  
  );
  }   
}