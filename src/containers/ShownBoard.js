import React from 'react';
import Thread from './board/Thread.js';

export default class ShownBoard extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      replying: false,
      replyingTo: undefined,
      deleting: false,
      deletingTo: undefined,
    }
    this.deleteToggle = this.deleteToggle.bind(this);
    this.replyToggle = this.replyToggle.bind(this);
  }
  componentWillMount()
  {
    this.setState({threads: this.props.board.threads});
  }
  deleteToggle(deletingTo)
  {
    console.log("toggling delete");
    if(!this.state.deleting || deletingTo != this.state.deletingTo)
      this.setState({replying: false, replyingTo: undefined,
                     deleting: true, deletingTo: deletingTo});
    else
      this.setState({deleting: false, deletingTo: undefined,
                     replying: false, replyingTo: undefined});
  }
  replyToggle(replyingTo)
  {
    if(!this.state.replying || replyingTo != this.state.replyingTo)
      this.setState({replying: true, replyingTo: replyingTo,
                     deleting: false, deletingTo: undefined});
    else
      this.setState({replying: false, replyingTo: undefined});
  }
  sortThreads(oldThreads)
  {
    
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
                if(a.bumped_on > b.bumped_on)
                  return -1;
                else
                  return 1;
             }).map((d,i)=>
              <Thread key={"thread" + i} 
                      thread={d} 
                      popThread={this.props.popThread}
                      currentBoard={this.props.currentBoard}
                      replyToggle = {this.replyToggle}
                      deleteToggle = {this.deleteToggle}
                      replying = {this.state.replying}
                      replyingTo = {this.state.replyingTo}
                      deleting = {this.state.deleting}
                      deletingTo = {this.state.deletingTo}
                      updateThread = {this.props.updateThread}
                      repliesOff={()=>this.setState({replyingTo: undefined, replying: false})}
                      clearAll={()=>this.setState({replyingTo: undefined, replying: false,
                                                   deletingTo: undefined, deleting: false})}/>                 
            )}
        </div>
    </div> 
        
    )
  }
}