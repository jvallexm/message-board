import React from 'react';
import NewThread from './NewThread.js';
import ShownBoard from './ShownBoard.js';
import io from 'socket.io-client';
const socket=io();

export default class App extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      boards: [],
      currentBoardName: "b",
      currentBoard: undefined,
      gray: false,
      lockedOut: false,
      lockedOutIp: "",
      getBoards: ["b","c","p","d","m"],
      replying: false,
      replyingTo: undefined,
      deleting: false,
      deletingTo: undefined,
      admin: false
    };
    this.getCurrentBoard = this.getCurrentBoard.bind(this);
    this.pushThread = this.pushThread.bind(this);
    this.popThread = this.popThread.bind(this);
    this.setBoard = this.setBoard.bind(this);
    this.switchBoard = this.switchBoard.bind(this);
    this.updateThread = this.updateThread.bind(this);
    this.deleteToggle = this.deleteToggle.bind(this);
    this.replyToggle = this.replyToggle.bind(this);
  }
  componentWillMount()
  {
    socket.emit('need boards', {boards: this.state.getBoards});
    socket.on("send boards",(data)=>{
      console.log("getting boards from server..");
      //console.log(data.boards);
      this.setState({boards: data.boards});
      this.getCurrentBoard();
    });
    socket.on("send thread",(data)=>{
      this.pushThread(data.board,data.thread,false);
    });
    socket.on("send pop",(data)=>{
      this.popThread(data.board,data.thread,false);
    });
    socket.on("send update",(data)=>{
      this.updateThread(data.board,data.thread,false);
    });
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
  getCurrentBoard(board)
  {
    console.log("getting current board");
    let whichBoard = this.state.currentBoardName;
    if(board != undefined)
      whichBoard = board;
    for(let i=0;i<this.state.boards.length;i++)
    {
      if(this.state.boards[i]._id == whichBoard)
      {
        let currentBoard = this.state.boards[i];
        console.log(currentBoard.threads);
        this.setState({currentBoard: currentBoard});
        return;
      }  
    }
    console.log("after return");
  }
  popThread(board, thread, isNew)
  {
    let boards = this.state.boards;
    console.log("popping thread.. " + thread._id);
    for(let i=0;i<boards.length;i++)
    {
      if(boards[i]._id == board)
      {
        var threads = [];
        for(let j=0;j<boards[i].threads.length;j++)
        {
          if(boards[i].threads[j]._id != thread._id)
            threads.push(boards[i].threads[j]);
        }
        boards[i].threads = threads;
        console.log("new threads");
        console.log(boards[i].threads);
      }
    }
    if(isNew)
    {
      console.log("sending pop request to server..");
      socket.emit("pop thread",{
        board: board,
        thread: thread
      });
    }  
    this.setState({boards: boards});
    if(board == this.state.currentBoardName);
      this.getCurrentBoard();
  }
  pushThread(board,thread,isNew)
  {
    let boards = this.state.boards;
    console.log("pushing thread to " + board);
    console.log(thread);
    for(let i=0;i<boards.length;i++)
    {
      if(boards[i]._id == board)
      {
         boards[i].threads.push(thread);
      }
    }
    if(isNew)
    {
      console.log("sending thread to database");
      socket.emit("push thread",{
        board: board,
        thread: thread
      });
    }  
    this.setState({boards: boards});
    if(board == this.state.currentBoardName)
      this.getCurrentBoard();
  }
  setBoard(board)
  {
    this.setState({currentBoardName: board});
  }
  switchBoard(board)
  {
    this.setBoard(board);
    this.getCurrentBoard(board);
  }
  updateThread(board,thread,isNew)
  {
    let boards = this.state.boards;
    let index = 0;
    for(let i=0;i<boards.length;i++)
    {
      if(boards[i]._id == board)
        index = i;
    }
    for(let j=0;j<boards[index].threads.length;j++)
    {
      if(thread._id == boards[index].threads[j]._id)
      {
        thread.bumped_on = Math.round((new Date()).getTime() / 1000);
        boards[index].threads[j] = thread;
      }  
    }
    if(isNew)
    {
      socket.emit("post update",{
        board: board,
        thread: thread
      });
    }
    this.setState({boards: boards});
    if(board == this.state.currentBoardName)
      this.getCurrentBoard();
  }
  render()
  {
    return(
      <div>
        {this.state.gray ? 
          <div id="gray-out">
            <div className="text-center container-fluid new-thread">
              {!this.state.lockedOut?
              <NewThread cancel={()=>this.setState({gray: false})}
                         pushThread={this.pushThread}
                         board={this.state.currentBoardName}/>
              :""}  
            </div>                
          </div> : ""}  
        <NavBar boards={this.state.boards}
                switchBoard={this.switchBoard}/>
        {this.state.boards.length > 0 && this.state.currentBoard != undefined ?
          <div id='app' className="text-center container-fluid">     
          <ShownBoard board={this.state.currentBoard}
                      grayOut={()=>this.setState({gray: true})}
                      updateThread={this.updateThread}
                      lockedOut={this.state.lockedOut}
                      lock={()=>this.setState({lockedOut: true})}
                      popThread={this.popThread}
                      currentBoard={this.state.currentBoardName}
                      replyToggle = {this.replyToggle}
                      deleteToggle = {this.deleteToggle}
                      replying = {this.state.replying}
                      replyingTo = {this.state.replyingTo}
                      deleting = {this.state.deleting}
                      deletingTo = {this.state.deletingTo}
                      repliesOff={()=>this.setState({replyingTo: undefined, replying: false})}
                      clearAll={()=>this.setState({replyingTo: undefined, replying: false,
                                                   deletingTo: undefined, deleting: false})}/>
         </div>
        : "Loading..."} 
      </div>  
    );
  }
}

const NavBar = (props) => {
  return(
      <nav className="text-center container-fluid">
        <div className="row">
           <div className="col-lg-6 middle-text">
               A Message Board For Nice People
           </div>
           <div className="col-lg-6 middle-text">
              <div>
              {props.boards.sort((a,b)=>{
               if(a.name < b.name)
                 return -1;
               else 
                 return 1;
              }).map((d,i)=>
                <span key={d.name}
                      onClick={()=>props.switchBoard(d._id)}
                      className="pointer">
                   {d.name}{i<props.boards.length-1 ? " / " : ""}
                </span>       
              )}
              </div>
           </div>  
        </div>  
      </nav>
  );
};


