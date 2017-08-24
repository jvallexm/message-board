import React from 'react';
import Thread from './board/Thread.js';

export default class ShownBoard extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
    }
  }
  componentWillMount()
  {
    this.setState({threads: this.props.board.threads});
  }
  render()
  {
    return(
      
    <div className="text-center container-fluid">  
        <div className="board">
            <center>
            <div className="thread-head board-head">
              <h1>{this.props.board.name}</h1>
            </div>  
            </center>
            <button className="btn thread-head board-head from-top"
                    onClick={this.props.grayOut}>
              New Thread
            </button>
            {this.props.board.threads.sort((a,b)=>{
               if(!this.props.deleting && !this.props.repllying)
               {
                  if(a.bumped_on > b.bumped_on)
                    return -1;
                  else
                    return 1;
               }    
             }).map((d,i)=>
              <Thread key={"thread" + i} 
                      thread={d} 
                      popThread={this.props.popThread}
                      currentBoard={this.props.currentBoard}
                      replyToggle = {this.props.replyToggle}
                      deleteToggle = {this.props.deleteToggle}
                      replying = {this.props.replying}
                      replyingTo = {this.props.replyingTo}
                      deleting = {this.props.deleting}
                      deletingTo = {this.props.deletingTo}
                      updateThread = {this.props.updateThread}
                      repliesOff = {this.props.repliesOff}
                      clearAll = {this.props.clearAll}/>                 
            )}
        </div>
    </div> 
        
    )
  }
}