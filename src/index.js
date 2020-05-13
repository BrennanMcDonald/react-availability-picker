import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';
import './styles2.css';
import BlobContainer from './BlobContainer';

import { generateRowSizes, topToTime } from './Helpers';

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
      startTime: this.props.startTime,
      endTime: this.props.endTime,
      blob: {},
      blobs: [],
      deletedBlobs: [],
      debugLog: []
    }
    this.createHours();
  }

  onChange = (BlobList) => {
    var {
      startTime,
      endTime,
      hours
    } = this.state;
    var dateFormattedBlobs = BlobList.map(x => {
      return {
        startTime: topToTime(startTime, endTime, x.start, hours * 60, parseInt(x.column)),
        endTime: topToTime(startTime, endTime, x.stop, hours * 60, parseInt(x.column)),
      }
    })
    this.props.onChange({
      AvailableTimes: dateFormattedBlobs
    })
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

  dateRow = (col) => {
    let rows = [];

    for (var row = 0; row < this.state.hours + 1; row++) {
      rows.push(<div key={row} style={{ width: "100%", height: "60px" }} data-col={col} data-row={row}>
        <span style={{ top: "-10px", position: "relative" }}>{((new Date(this.state.startTime)).getHours() + row) % 24}:00</span>
      </div>)
    }

    return rows;

  }

  createRows = (col) => {
    let rows = [];
    for (var row = 0; row < this.state.hours; row++) {
      rows.push(<div key={row.toString() + col.toString()} data-col={col} data-row={row} className={"row"}></div>)
    }
    return rows
  }

  createDays = () => {
    let RowTable = []
    for (let col = 0; col < this.state.days; col++) {

      let colBlobs = this.state.blobs.filter(x => x.column == col);
      if (this.state.blob.column == col) {
        colBlobs.push(this.state.blob)
      }
      RowTable.push(
        <div key={col.toString()} id={`date-row-${col}`} data-col={col} className={col === -1 ? "time-row" : "date-row"}>
          {this.createRows(col)}
        </div>)
    }
    return <div id="RowContainer">
      <div style={generateRowSizes(this.state.days - 1)}>{RowTable}</div>
    </div>
  }


  deleteBlob = (event) => {
    let { blobs } = this.state;
    blobs = blobs.filter(x =>
      x.blobID != parseInt(event.target.dataset.id)
    )
    this.setState({
      blobs: blobs
    });
  }

  render() {
    return (
      <div style={{ ...this.props.style }} className={styles.wrapper}>
        <div className="headerRow" style={{ display: "grid", gridTemplateColumns: "50px auto" }}>
          <div style={{ width: "50px" }}></div>
          <div style={generateRowSizes(this.state.days - 1)}>
            {this.createHeader()}
          </div>
        </div>

        <div className="bodyRow" style={{ display: "grid", gridTemplateColumns: "50px auto" }}>
          <div style={{ width: "50px" }}>{this.dateRow()}</div>
          <div id="DatePickerContent" style={{ position: 'relative' }}>
            {this.createDays()}
            <BlobContainer style={{ position: "absolute", width: "100%", background: "rgba(255,0,0,0.2)", top: 0, bottom: "50px" }} onChange={this.onChange} />
          </div>
        </div>

        <div>
          {
            this.state.deletedBlobs.map(x => {
              return <div>{x}</div>
            })
          }
        </div>
        <hr />
        <div>
          {
            this.state.blobs.map(x => {
              return <div>{x.blobID} {!this.state.deletedBlobs.includes(x.blobID)}</div>
            })
          }
        </div>
      </div>
    )
  }
}
