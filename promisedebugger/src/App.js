import React, { Component } from 'react';
import './stylesheet.css';
import Promisebar from './components/promisebar.js'
import DetailView from './components/detailView.js'
var CodeMirror = require('react-codemirror');
require('codemirror/lib/codemirror.css');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/xml/xml');
require('codemirror/mode/markdown/markdown');
require('codemirror/theme/panda-syntax.css');

class App extends Component {
  constructor(){
    super()
    this.state={promiseData:{},selectedPromise:"empty",inputCode:"",startTime:0,active:true}
    this.logPromise=this.logPromise.bind(this)
    this.handleInputChange=this.handleInputChange.bind(this)
    this.handleFrameTasks=this.handleFrameTasks.bind(this)
    this.selectPromise=this.selectPromise.bind(this)
    this.scrollTimeline=this.scrollTimeline.bind(this)
    this.showTimebar=this.showTimebar.bind(this)
    this.createTimelineText=this.createTimelineText.bind(this)
    this.onScrollHandler=this.onScrollHandler.bind(this)
  }

  componentDidMount() {
    window.addEventListener("message", this.handleFrameTasks);
  }
  componentWillUnmount() {
    window.removeEventListener("message", this.handleFrameTasks);
  }
  handleFrameTasks (e){
    let data=JSON.parse(e.data)
    this.logPromise(data.id,data.line,data.type)

  }
  selectPromise(id){
    this.setState({
      selectedPromise:id
    })
  }
  logPromise(id, creator, action) {
    if(this.state.active){
      var data = this.state.promiseData
      if (!data[String(id)]) {
        data[String(id)] = {}
      }
      if (action === "resolve" || action === "reject") {
        data[id].endTime = Date.now();
        if (action === "resolve") {
          data[id].resolved = true;
          data[id].endLocation = creator
        } else {
          data[id].resolved = false;
          data[id].endLocation = creator
        }
      } else {
        if (action === "creation") {
          data[id].creationTime = Date.now();
          data[id].creationLocation = creator;
          data[id].resolved=false;
        }
      }
      this.setState({
        promiseData:data
      })
    }
  }

  runCode(){
    this.setState({
      startTime: Date.now()
    })
    var code = this.state.inputCode;
    code = code.replace(/Promise\s*\(\s*function\s*\(\s*resolve\s*\,\s*reject\)\s*\{/g, "Promise(function(resolve, reject) {\n var id=Math.floor(100000000 + Math.random() * 900000000);\n parent.postMessage(JSON.stringify({'id':id,'line':new Error().lineNumber,'type':'creation'}),document.location); \n");
    code = code.replace(/resolve\((.*)\)/g, "parent.postMessage(JSON.stringify({'id':id,'line':new Error().lineNumber,'type':'resolve'}),document.location); \n resolve($1)\n");
    code = code.replace(/reject\(\s*\)/g, "\n parent.postMessage(JSON.stringify({'id':id,'line':new Error().lineNumber,'type':'reject'}),document.location); \n reject()\n");
    code = code.replace(/\=\s*resolve(\n|\;)/g, " = function(){\n parent.postMessage(JSON.stringify({'id':id,'line':new Error().lineNumber,'type':'resolve'}),document.location); \n resolve();\n}\n");
    code = code.replace(/\=\s*reject(\n|\;)/g, " = function(){\n  parent.postMessage(JSON.stringify({'id':id,'line':new Error().lineNumber,'type':'reject'}),document.location); \n reject();\n}\n");

    let doc;
    var iframe = this.refs.iframe;
    if (iframe.contentDocument) {
      doc = iframe.contentDocument;
    } else {
      if (iframe.contentWindow) {
        doc = iframe.contentWindow.document;
      } else {
        doc = iframe.document;
      }
    }
    var scriptTag = "<script>" + "<";
    scriptTag += "/script>" + code;
    doc.open();
    doc.writeln(scriptTag);
    doc.close();
    //alert(this.state.promiseData)
  }
  showTimebar(){

  }
  handleInputChange(newcode) {
    this.setState({
      inputCode: newcode
    });
  }
  scrollTimeline(){
    this.refs["timeline"].scrollLeft=this.refs["timeline"].scrollWidth-this.refs["timeline"].clientWidth;
    this.refs["timelineWrapper"].style.width=this.refs["timeline"].scrollWidth+"px";

  }
  createTimeline(){
    var timeline=[];
    if(this.refs["timeline"]){
      for(var i =100;i<this.refs["timeline"].offsetWidth+this.refs["timeline"].scrollWidth-this.refs["timeline"].clientWidth;){
        timeline.push(<div className="timelinebar" style={{marginLeft:"100px"}}/>)
        i+=100;
      }
    }
    return timeline;
  }
  createTimelineText(){
    var timeline=[];
    if(this.refs["timeline"]){
      for(var i =100;i<this.refs["timeline"].offsetWidth+this.refs["timeline"].scrollWidth-this.refs["timeline"].clientWidth;){
        if((i/100)%2==0){
          timeline.push(<div className="timelinebarText">{i*5+" ms"}</div>)
        }
        i+=100;
      }
    }
    return timeline;
  }
  onScrollHandler(){
    this.refs.timelineWrapper.style.bottom=-this.refs.timeline.scrollTop+"px"
  }
  render() {
    return (
      <div className="WindowWrapper">
        <div className="menubar">
          <button className="runCode" onClick={()=>{this.runCode()}}>
            run
          </button>
          <button className="stopCode">
            stop
          </button>
        </div>
        {/*<CodeInput handleInputChange={this.handleInputChange} inputCode={this.state.inputCode}/>*/}
        <CodeMirror
          className="codeWindow"
          value={this.state.inputCode}
          onChange={this.handleInputChange}
          options={{lineNumbers:true,theme:"panda-syntax"}}
          autoFocus={true}
          />
        <iframe title="iframe1" ref="iframe" id="iframe" className="previewWindow">
        </iframe>
        <div className="debuggingWindow" onMouseOver={()=>{this.showTimebar()}}>
          <div className="TimelineWindow" ref="timeline" onScroll={()=>{this.onScrollHandler()}}>
            {/*  <div className="Timebar" ref="Timebar"/>*/}
              {Object.keys(this.state.promiseData).map((key)=> {
                return <Promisebar
                  selectPromise={this.selectPromise}
                  selectedPromise={this.state.selectedPromise}
                  Promisekey={key}
                  startTime={this.state.startTime}
                  start={this.state.promiseData[key]["creationTime"]}
                  end={this.state.promiseData[key]["endTime"]}
                  resolution={5}
                  resolved={this.state.promiseData[key]["resolved"]}
                  scrollTimeline={this.scrollTimeline}
                  />
              })
            }
          <div className="timelineCompWrapper" ref="timelineWrapper">
            <div className="timelineWrapper">
              {this.createTimeline()}
            </div>
            <div className="timelineTextWrapper">
              {this.createTimelineText()}
            </div>
          </div>
        </div>
        {this.state.promiseData[this.state.selectedPromise]&&
          <DetailView
            creation={this.state.promiseData[this.state.selectedPromise]["creationTime"]-this.state.startTime}
            creationLocation={this.state.promiseData[this.state.selectedPromise]["creationLocation"]}
            destruction={this.state.promiseData[this.state.selectedPromise]["endTime"]-this.state.startTime}
            endLocation={this.state.promiseData[this.state.selectedPromise]["endLocation"]}
            resolved={this.state.promiseData[this.state.selectedPromise]["resolved"]}
            />
        }
      </div>

    </div>
  );
}
}

export default App;
