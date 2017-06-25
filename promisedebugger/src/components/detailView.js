import React, { Component } from 'react';
import '../stylesheet.css'

class DetailView extends Component {
  render() {
    return (
      <div className="DetailContainer">
      <div className="DetailHeading">
        Promise-Details
      </div>
      <div className="DetailEl">
        <div className="DetailTitle">
          Creation:
        </div>
        <div className="DetailContent">
          {this.props.creation+"ms"}
        </div>
      </div>
      <div className="DetailEl">
        <div className="DetailTitle">
          Creationlocation:
        </div>
        <div className="DetailContent">
          {"line "+this.props.creationLocation}
        </div>
      </div>
      <div className="DetailEl">
        <div className="DetailTitle">
          Desctruction:
        </div>
        <div className="DetailContent">
          {this.props.destruction+"ms"}
        </div>
      </div>
      <div className="DetailEl">
        <div className="DetailTitle">
          Desctructionlocation:
        </div>
        <div className="DetailContent">
          {"line "+this.props.endLocation}
        </div>
      </div>
      <div className="DetailEl">
        <div className="DetailTitle">
          Duration:
        </div>
        {this.props.destruction&&
        <div className="DetailContent">
          {this.props.destruction-this.props.creation+"ms"}
        </div>
      }
      {!this.props.destruction&&
      <div className="DetailContent">
        -
      </div>
    }
      </div>
      <div className="DetailEl">
        <div className="DetailTitle">
          Status:
        </div>
        <div className="DetailContent">
          resolved
        </div>
      </div>
      <div className="DetailEl">
        <div className="DetailTitle">
          Value:
        </div>
        <div className="DetailContent">
          {this.props.value}
        </div>
      </div>
      </div>
    );
  }
}

export default DetailView;
