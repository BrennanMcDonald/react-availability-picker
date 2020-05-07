import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';
import './styles2.css';
import DateBlob from './DateBlob';

export default class AvailabilityPicker extends Component {
  static propTypes = {
    text: PropTypes.string
  }

  defaultHeaders = [
    "Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"
  ]

  constructor(props) {
    super(props);
    // Todo: checks here
    this.state = {
      days: this.props.days || 7,
      hours: this.props.endTime.getHours() - this.props.startTime.getHours(),
      startTime: 0,
      endTime: 0,
      mouseDown: false,
      blob: {},
      blobs: [],
    }
    console.log(this.state.hours)
    this.createHours();
    window.addEventListener("mousemove", this.onMouseMove)
  }

  componentDidMount() {
    this.setState({
      snapValues: this.generateSnapValues()
    })
  }
  generateSnapValues = () => {
    var snap = []
    var start = document.getElementById("DatePickerContent").offsetTop;
    var step = start;
    for(var i = 0; i < this.state.hours * 4; i++) {
      snap.push(step);
      step += 15;
    }
    return snap;
  }


  generateRowSizes = (n) => {
    var percent = 100/n;
    var percentArray = Array(n);
    percentArray.fill(`${percent}%`)
    return {display: "grid", gridTemplateColumns: percentArray.join(" ")}
  }

  createHours = () => {
    var colsArray = this.props.value;
    for (let i = 0; i < this.state.days; i++) {
      colsArray.push([])
      for (let j = 0; j < this.state.hours; j++) {
        colsArray[i].push({ selected: false })
      }
    }
  }

  createHeader = () => {
    let table = []
    for (let i = 0; i < this.state.days; i++) {
      table.push(
        <div className={styles.headerItem}>
          {this.defaultHeaders[i]}
        </div>)
    }
    return table
  }

  createDays = () => {
    let table = []
    for (let col = 0; col < this.state.days; col++) {
      let colBlobs = this.state.blobs.filter(x => x.column == col);
      if (this.state.blob.column == col) {
        colBlobs.push(this.state.blob)
      }
      table.push(
        <div key={col.toString()} id={`date-row-${col}`} data-col={col} className="date-row" onMouseUp={this.onMouseUp}>
          {this.createBlobs(colBlobs)}
          {
            this.defaultHeaders.map((x, row) => {
              return <div key={row.toString() + col.toString()} data-col={col} data-row={row} onMouseOver={this.onMouseOver} onMouseDown={this.oneMouseDown} className={"row"}></div>
            })
          }
        </div>)
    }
    return table
  }



  createBlobs = (blobList) => {
    let blobHTML = [];
    blobList.forEach((x, j) => {
      blobHTML.push(<DateBlob blob={x} updateBlob={this.updateBlob} snapValues={this.state.snapValues} />)
    })
    return blobHTML;
  }

  onMouseDown = (event) => {
    this.setState({
      mouseDown: true
    });
    this.startDrag(event);
  }

  onMouseMove = (event) => {
    if (event)
      this.whileDragging(event);
  }

  onMouseUp = (event) => {
    this.setState({
      mouseDown: false
    });
    this.endDrag(event);
  }

  updateBlob = (id, newBlob) => {
    var { blobs } = this.state;
    var blobs = blobs.filter(x => x.blobID !== id);
    blobs.push(newBlob);
    this.setState({
      blobs: blobs
    })
    this.props.onChange(blobs);
  }

  snap = (top) => {
    var closest = this.state.snapValues.reduce(function(prev, curr) {
      return (Math.abs(curr - top) < Math.abs(prev - top) ? curr : prev);
    });
    if (top < document.getElementById("DatePickerContent").offsetTop)
      return top
    else
      return closest
  }

  startDrag(event) {
    let start = this.snap(event.clientY)
    // Initialize new blob in state
    this.setState({
      blob: {
        blobID: Math.round(Math.random() * 10000),
        start: start,
        stop: start,
        column: event.target.dataset.col
      }
    });
  }

  whileDragging(event) {
    // Update blob in state
    var { blob } = this.state;
    let stop = this.snap(event.clientY);
    blob.stop = stop;
    this.setState({
      blob: blob
    });
  }

  endDrag(event) {
    // Commit blob to parent's onChange method
    var { blobs, blob } = this.state;
    let stop = this.snap(event.clientY);
    blob.stop = stop;
    if (blob.start !== blob.stop) {
      blobs.push(blob);
      this.setState({
        blobs: blobs
      });
    }
    this.setState({
      blob: {}
    })
    this.props.onChange(blobs);
  }

  render() {
    return (
      <div style={{ ...this.props.style }} className={styles.wrapper}>
        <div style={this.generateRowSizes(this.state.days)}>
          {this.createHeader()}
        </div>
        <div style={this.generateRowSizes(this.state.days)} onMouseDown={this.onMouseDown} onMouseMove={this.onMouseMove()} id="DatePickerContent">
          {this.createDays()}
        </div>
      </div>
    )
  }
}
