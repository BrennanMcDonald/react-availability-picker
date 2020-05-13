import React, { Component } from 'react'


import AvailabilityPicker from 'react-availability-picker'

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      colValues: []
    }
  }

  onChange = (value) => {
    this.setState({
      colValues: value
    })
    console.log(value);
  }

  render() {
    var startTime = new Date();
    var endTime = new Date();

    startTime.setHours(9);
    startTime.setMinutes(0);
    startTime.setSeconds(0);
    endTime.setHours(17);
    endTime.setMinutes(0);
    endTime.setSeconds(0);

    return (
      <div className="fullheight">
        <AvailabilityPicker 
          style={{ width: "500px", height: "500px" }} 
          days={7}
          startTime={startTime}
          endTime={endTime}
          value={this.state.colValues}
          onChange={this.onChange} />
      </div>
    )
  }
}
