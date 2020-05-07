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
  }

  render() {
    return (
      <div className="fullheight">
        <AvailabilityPicker style={{ width: "500px", height: "500px" }} days={7} hours={8} value={this.state.colValues} onChange={this.onChange} />
      </div>
    )
  }
}
