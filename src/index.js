import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';
import './styles2.css';

export default class AvailabilityPicker extends Component {
  static propTypes = {
    text: PropTypes.string
  }
  headers = [
    "Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"
  ]
  constructor(props) {
    super(props);
    // Todo: checks here
    this.state = {
      days: this.props.days || 7,
      hours: this.props.hours || 24,
      mouseDown: false,
      selecting: false,
      start: 0,
      min: this.props.hours + 1,
      max: -1,
      blob: {},
      blobs: []
    }
    this.createHours();
    window.addEventListener("mousemove", this.onMouseMove)
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
          {this.headers[i]}
        </div>)
    }
    return table
  }

  createDays = () => {
    let table = []
    for (let i = 0; i < this.state.days; i++) {
      let colBlobs = this.state.blobs.filter(x => x.column == i);
      if (this.state.blob.column == i) {
        colBlobs.push(this.state.blob)
      }
      table.push(
        <div key={i.toString()} id={`date-row-${i}`} data-col={i} className="date-row" onMouseUp={this.onMouseUp}>
          {this.createBlobs(colBlobs)}
          {
            this.props.value[i].map((x, j) => {
              if (x.selected) {
                console.log(x)
              }
              return <div key={i.toString() + j.toString()} data-col={i} data-row={j} onMouseOver={this.onMouseOver} onMouseDown={this.oneMouseDown} className={x.selected ? "row" : "selectedRow"} ></div>
            })
          }
        </div>)
    }
    return table
  }

  createBlobs = (blobList) => {
    let blobHTML = [];
    blobList.forEach((x, j) => {
      blobHTML.push(<div style={{ top: x.start, height: x.stop - x.start, width: "100px", position: "absolute", backgroundColor: "red", width: "50px", userSelect: "none" }} className="blob" onClick={this.deleteBlob} data-id={x.blobID}>{x.blobID}</div>)
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
    if (event && this.state.mouseDown)
      this.whileDragging(event);
  }

  onMouseUp = (event) => {
    this.setState({
      mouseDown: false
    });
    this.endDrag(event);
  }

  deleteBlob = (event) => {
    let id = parseInt(event.target.dataset.id);
    console.log(id);
    let blobs = this.state.blobs.filter(x => x.blobID != id);
    console.log(blobs)
    this.setState({
      blobs: blobs
    });
  }

  startDrag(event) {
    let start = (Math.round(event.clientY / 25) * 25);
    console.log()
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
    let stop = (Math.round(event.clientY / 25) * 25);
    blob.stop = stop;
    this.setState({
      blob: blob
    });
  }

  endDrag(event) {
    // Commit blob to parent's onChange method
    var { blobs, blob } = this.state;
    let stop = (Math.round(event.clientY / 25) * 25);
    blob.stop = stop;
    if (blob.start !== blob.stop) {
      blobs.push(blob);
      console.log(blob.start, blob.stop, blob.column)
      this.setState({
        blobs: blobs
      });
    }
    this.setState({
      blob: {}
    })
  }

  render() {
    return (
      <div style={{ ...this.props.style }} className={styles.wrapper}>
        <div className={styles.header}>
          {this.createHeader()}
        </div>
        <div className={styles.calendar7Days} onMouseDown={this.onMouseDown} onMouseMove={this.onMouseMove()}>
          {this.createDays()}
        </div>
      </div>
    )
  }
}
