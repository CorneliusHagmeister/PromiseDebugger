import React, { Component } from 'react';
import '../stylesheet.css'

class Promisebar extends Component {
  componentDidMount(){
    this.props.scrollTimeline();
  }
  onHover(){
    this.refs.promisebar.style
  }
  render() {
    console.log(this.props.start);
    var barcolor;
    if(!this.props.end){
      barcolor="rgb(216, 193, 60)";
    }else{
      if(this.props.resolved){
        barcolor="rgb(106, 216, 60)";
      }else{
        barcolor="rgb(206, 69, 45)";
      }
    }
    if(this.props.selectedPromise===this.props.Promisekey){
      barcolor="rgb(66, 134, 244)";
    }
    return (
      <div className="PromiseContainer">
        <div
          className="promisebar"
          onClick={()=>{ this.props.selectPromise(this.props.Promisekey)}}
          style={{marginLeft:(this.props.start-this.props.startTime) / this.props.resolution-100 + "px",
            width: Math.floor((this.props.end - this.props.start) / this.props.resolution) + "px",
            background:[barcolor]
          }}
          >
        </div>
      </div>
    );
  }
}

export default Promisebar;
