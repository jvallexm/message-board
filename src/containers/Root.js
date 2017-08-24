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
      getBoards: ["b","c"]
    }
    this.getCurrentBoard = this.getCurrentBoard.bind(this);
    this.pushThread = this.pushThread.bind(this);
    this.popThread = this.popThread.bind(this);
    this.updateThread = this.updateThread.bind(this);
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
  }
  getCurrentBoard()
  {
    console.log("getting current board");
    for(let i=0;i<this.state.boards.length;i++)
    {
      if(this.state.boards[i]._id == this.state.currentBoardName)
      {
        let currentBoard = this.state.boards[i];
        console.log(currentBoard.threads);
        this.setState({currentBoard: currentBoard});
        return;
      }  
    }
    console.log("after return");
  }
  popThread(thread)
  {
    let boards = this.state.boards;
    console.log("popping thread.. " + thread._id);
    for(let i=0;i<boards.length;i++)
    {
      if(boards[i]._id == this.state.currentBoardName)
      {
        var threads = []
        for(let j=0;j<boards[i].threads.length;j++)
        {
          if(boards[i].threads[j]._id != thread._id)
            threads.push(boards[i].threads[j])
        }
        boards[i].threads = threads;
        console.log("new threads");
        console.log(boards[i].threads);
      }
    }
    this.setState({boards: boards});
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
  updateThread(board,thread)
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
        boards[index].threads[j] = thread;
      }  
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
        <NavBar boards={this.state.boards}/>
        {this.state.boards.length > 0 && this.state.currentBoard != undefined ?
          <div id='app' className="text-center container-fluid">     
          <ShownBoard board={this.state.currentBoard}
                      grayOut={()=>this.setState({gray: true})}
                      updateThread={this.updateThread}
                      lockedOut={this.state.lockedOut}
                      lock={()=>this.setState({lockedOut: true})}
                      popThread={this.popThread}/>
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
           <div className="col-lg-4 middle-text">
               A Message Board For Nice People
           </div>
           <div className="col-lg-8 middle-text">
              {props.boards.map((d,i)=>
                <span key={d.name}>
                   {d.name}{i<props.boards.length-1 ? " / " : ""}
                </span>       
              )}
           </div>  
        </div>  
      </nav>
  );
}


