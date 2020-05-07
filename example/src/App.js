import React, { Component } from 'react'


import AvailabilityPicker from 'react-availability-picker'

export default class App extends Component {

  constructor(props) {
    super(props);
    let morning, evening;
    morning = new Date();
    evening = new Date();

    morning.setHours(9);
    morning.setMinutes(0);
    morning.setSeconds(0);

    evening.setHours(17);
    evening.setMinutes(0);
    evening.setSeconds(0);

    this.state = {
      colValues: [],
      dates: {
        timeStart: morning,
        timeEnd: evening
      }
    }
  }

  onChange = (value) => {
    this.setState({
      colValues: value
    })
  }

  render() {
    return (
      <div className="fullheight">
        <AvailabilityPicker 
          style={{ width: "500px", height: "500px" }} 
          days={7}
          startTime={this.state.dates.timeStart}
          endTime={this.state.dates.timeEnd}
          value={this.state.colValues}
          onChange={this.onChange} />
      </div>
    )
  }
}
