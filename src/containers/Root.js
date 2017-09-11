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
      
      boards            : [],
      currentBoardName  : "b",
      currentBoard      : undefined,
      gray              : false,
      lockedOut         : false,
      lockedOutIp       : "",
      getBoards         : ["b","c","p","d","m"],
      replying          : false,
      replyingTo        : undefined,
      deleting          : false,
      deletingTo        : undefined,
      admin             : false,
      about             : false
      
    };
    this.getCurrentBoard  =  this.getCurrentBoard.bind(this);
    this.pushThread       =  this.pushThread.bind(this);
    this.pushReply        =  this.pushReply.bind(this);
    this.popThread        =  this.popThread.bind(this);
    this.setBoard         =  this.setBoard.bind(this);
    this.switchBoard      =  this.switchBoard.bind(this);
    this.updateThread     =  this.updateThread.bind(this);
    this.deleteToggle     =  this.deleteToggle.bind(this);
    this.replyToggle      =  this.replyToggle.bind(this);
  }
  componentWillMount()
  {
    socket.emit('need boards', {boards: this.state.getBoards});
    
    socket.on("send boards",(data)=>{
      
        var urlHere = window.location.href.split('/');
        let whichBoard = this.state.currentBoardName;
        if(urlHere.indexOf('board')!=-1)
        {
          whichBoard = urlHere[urlHere.length-2];
        }
        console.log("getting boards from server..");
        this.setState({boards: data.boards, currentBoardName: whichBoard});
        this.getCurrentBoard(whichBoard);
        
    });
    
    socket.on("send thread",(data)=>{
      this.pushThread(data.board,data.thread,false);
    });
    
    socket.on("send pop",(data)=>{
      console.log("incoming data " + JSON.stringify(data));
      this.popThread(data.board,data.thread,false);
    });
    
    socket.on("send update",(data)=>{
      this.updateThread(data.board,data.thread,false);
    });
    
    socket.on("send reply",(data)=>{
       this.pushReply(data.board,data.thread,data.reply);
    });
    
    socket.on("console log",(data)=>{
      console.log(data.log);
    });
    
  }
  deleteToggle(deletingTo)
  {

    if(!this.state.deleting || deletingTo != this.state.deletingTo)
      this.setState( { replying   : false, 
                       replyingTo : undefined,
                       deleting   : true, 
                       deletingTo : deletingTo } );
    else
      this.setState( { deleting   : false, 
                       deletingTo : undefined,
                       replying   : false, 
                       replyingTo : undefined } );
  }
  replyToggle(replyingTo)
  {
    if(!this.state.replying || replyingTo != this.state.replyingTo)
      this.setState( { replying   : true, 
                       replyingTo : replyingTo,
                       deleting   : false, 
                       deletingTo : undefined } );
    else
      this.setState( { replying   : false, 
                       replyingTo : undefined } );
  }
  getCurrentBoard(board)
  {
    let whichBoard = this.state.currentBoardName;
    if(board != undefined)
      whichBoard = board;
    console.log("getting current board " + whichBoard);  
    for(let i=0;i<this.state.boards.length;i++)
    {
      if(this.state.boards[i]._id == whichBoard)
      {
        let currentBoard = this.state.boards[i];
        //console.log(currentBoard.threads);
        this.setState({currentBoard: currentBoard});
        return;
      }  
    }
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
    if(board == this.state.currentBoardName)
      this.getCurrentBoard();
  }
  pushReply(board,thread,reply)
  {
    let boards = this.state.boards;
    console.log("pushing a reply to " + board);
    for(let i=0;i<boards.length;i++)
    {
      if(boards[i]._id == board)
      {
         for(let j=0;j<boards[i].threads.length;j++)
         {
           if(boards[i].threads[j]._id == thread)
           {
             boards[i].threads[j].replies.push(reply);
             this.setState({boards: boards});
             if(board == this.state.currentBoardName)
               this.getCurrentBoard();
             return;
           }   
         }
      }
    }
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
  updateThread(board,thread,isNew,isFlagged)
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
        if(!isFlagged)
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
              <NewThread cancel      = { ()=>this.setState( {gray: false} ) }
                         pushThread  = { this.pushThread }
                         board       = { this.state.currentBoardName }/>
              :""}  
            </div>                
          </div> : ""}  
          
        <NavBar boards       = { this.state.boards }
                switchBoard  = { this.switchBoard }
                board        = { this.state.currentBoardName } 
                about        = { this.state.about ? ()=> this.setState({about: false}) : ()=> this.setState({about: true}) }/>
                
        {this.state.about ? <About close={()=>this.setState({about: false})}/> : ""}        
        {this.state.boards.length > 0 && this.state.currentBoard != undefined ?
        
          <div id='app' className="text-center container-fluid">  
          
          <ShownBoard board         = { this.state.currentBoard }
                      grayOut       = { ()=>this.setState( {gray: true} ) }
                      updateThread  = { this.updateThread }
                      lockedOut     = { this.state.lockedOut }
                      lock          = { ()=>this.setState( {lockedOut: true} ) }
                      popThread     = { this.popThread }
                      currentBoard  = { this.state.currentBoardName }
                      replyToggle   = { this.replyToggle }
                      deleteToggle  = { this.deleteToggle }
                      replying      = { this.state.replying }
                      replyingTo    = { this.state.replyingTo }
                      deleting      = { this.state.deleting }
                      deletingTo    = { this.state.deletingTo }
                      repliesOff    = { ()=>this.setState( { replyingTo  : undefined, 
                                                             replying    : false      } ) } 
                      clearAll      = { ()=>this.setState( { replyingTo  : undefined, 
                                                             replying    : false,
                                                             deletingTo  : undefined, 
                                                             deleting    : false      } ) } />
                                                             
         </div>
        : "Loading..."} 
      </div>  
    );
  }
}

const About = (props) =>{
  return(
    <div className="aboot text-center">
      <div className="aboot-x">
        <i className="fa fa-close pointer"
           onClick={props.close}/>
      </div>  
      <div className="thread-head">
        About This Project
      </div>  
      <div>
        FreeCodeCamp's curriculum will soon include an <strong className="pointer" onClick={()=>window.open("https://beta.freecodecamp.com/en/challenges/information-security-and-quality-assurance-projects/anonymous-message-board")}>Anonymous Message Board <i className="fa fa-external-link"/></strong>. You can use the API requests from the <strong className="pointer" onClick={()=>window.open('/forms')}>Forms Page <i className="fa fa-external-link"/></strong><br/>In addition to fulfilling all the requirements, it includes some new features:<br/>
        <div className="aboot-10">
        ★ Users new threads and replies will update in real time<br/>
        ★ Users can link to an image when posting a thread<br/>
        ★ Users can reply to replies on a thread<br/>
        ★ The most recently updated thread will always be on top of the board unless...<br/>
        ★ A user is typing a reply or trying to delete a post, threads will still update, but they won't be reordered until they've cancelled or submitted their request.<br/>
        ★ Any updates made using API requests will be shown in real time on the board 
        </div>  
      </div>
      <button className = "btn aboot-btn"
              title     = {"View on Github"}
              onClick   = {()=>window.open("https://github.com/jvallexm/message-board")}>
         View on Github <i className="fa fa-github"/>
      </button>  
      <button className="btn aboot-btn"
              onClick={props.close}>
         Close
      </button>  
    </div>  
  );
}

const NavBar = (props) => {
  return(
      <nav className="text-center container-fluid">
        <div className="row">
           <div className="col-lg-1 middle-text">
              <i className="fa fa-question-circle pointer" 
                 title={"About This Project"}
                 onClick={props.about}/>
           </div>
           <div className="col-lg-5 middle-text">
               A Message Board For Nice People
           </div>
           <div className="col-lg-5 middle-text">
              <div>
              {props.boards.sort((a,b)=>{
               if(a.name < b.name)
                 return -1;
               else 
                 return 1;
              }).map((d,i)=>
                <span key={d.name}
                      onClick={d._id==props.board ? "" : ()=>props.switchBoard(d._id)}
                      className={d._id==props.board ? "" : "pointer"}>
                   <span className={d._id==props.board ? "gray" : ""}>{d.name}</span>{i<props.boards.length-1 ? " / " : ""}
                </span>       
              )}
              </div>
           </div>
           <div className="col-lg-1"/>
        </div>  
      </nav>
  );
};


