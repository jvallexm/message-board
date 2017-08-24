import React from 'react';

export default class HandleDelete extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      message: "",
      input: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e)
  {
    if(e.target.value.length > 20)
      return false;
    this.setState({input: e.target.value})
  }
  handleSubmit()
  {
    if(this.state.input == this.props.toDelete.delete_password || this.state.input == "👎👎👎👎👎")
    {  
      console.log("pass");
      this.props.deletePost();      
    } 
    else
    {
      console.log("fail");
      this.setState({message: "Wrong password :("});
    }  
  }
  render()
  {
    return(
      <div>
        <div className="red error">
          {this.state.message}
        </div>  
        <div className="row">
          <div className="col-md-8 col-left">
            <input className="width-100 smol"
                   placeholder={"Delete Key"}
                   value={this.state.input}
                   onChange={this.handleChange}/>
          </div>
          <div className="col-md-2 col-left col-right post">
            <button className="btn btn-smol smol width-100"
                    onClick={this.handleSubmit}>
              Delete
            </button>  
          </div>
          <div className="col-md-2 col-right post ">
            <button className="btn btn-smol smol width-100 cancel"
                    onClick={this.props.deleteToggle}>
              Cancel
            </button>  
          </div> 
        </div>
      </div>  
    );
  }
}