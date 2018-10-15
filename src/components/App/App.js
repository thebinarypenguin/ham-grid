import React from 'react';
import MaidenheadLocator from '../MaidenheadLocator/MaidenheadLocator.js';
import MaidenheadMap from '../MaidenheadMap/MaidenheadMap.js';

import './App.css';

export default class App extends React.Component {


  constructor(props) {

    super(props);

    this.state = {
      geolocationSupport    : (navigator.geolocation) ? true : false,
      geolocationPermission : null,
      positionWatchID       : null,
      currentPosition       : null,
    };

    this.checkGeolocationPermission = this.checkGeolocationPermission.bind(this);
    this.startWatchingPosition      = this.startWatchingPosition.bind(this);
    this.stopWatchingPosition       = this.stopWatchingPosition.bind(this);
  }

  render() {

    if (this.state.geolocationSupport === true &&
        this.state.geolocationPermission === true) {

      return (
        <div id="App">

          <MaidenheadLocator
           id="MaidenheadLocator"
           position={this.state.currentPosition} />

          <MaidenheadMap
           id="MaidenheadMap"
           position={this.state.currentPosition} />

        </div>
      );
    }

    return (
      <div id="App">
        <MaidenheadMap id="MaidenheadMap" />
      </div>
    );
  }

  componentDidMount() {

    this.checkGeolocationPermission();
  }

  componentDidUpdate() {

    this.startWatchingPosition();
  }

  componentWillUnmount() {

    this.stopWatchingPosition();
  }

  // Try to get the current position in order to check if we have permission.
  // This may prompt the user for permission. If permission granted we will
  // also receive the current position
  // BUG: what happens if this prompts the user for permission and the user
  // takes too long to respond, (i.e we get an error of type TIMEOUT).
  // increase the timeout? ask later?
  checkGeolocationPermission () {

    if (this.state.geolocationSupport === true) {

      const options = {
        enableHighAccuracy : true,
        timeout            : 8 * 1000,
        maximumAge         : 0,
      };

      const success = (position) => {

        this.setState({
          geolocationPermission: true,
          currentPosition: position,
        });
      };

      const failure = (positionError) => {

        if (positionError.code === 1) {
          this.setState({ geolocationPermission: false });
        } else {
          this.setState({ geolocationPermission: true });
        }
      };

      navigator.geolocation.getCurrentPosition(success, failure, options);
    }
  }

  // Start watching position, safe to call multiple times
  startWatchingPosition() {

    if (this.state.geolocationSupport === true &&
        this.state.geolocationPermission === true &&
        this.state.positionWatchID === null) {

      const options = {
        enableHighAccuracy : true,
        timeout            : 10 * 1000,
        maximumAge         : 0,
      };

      const success = (position) => {

        this.setState({ currentPosition: position });
      };

      const failure = (positionError) => {

        this.setState({ currentPosition: positionError });
      };

      const watchID = navigator.geolocation.watchPosition(success, failure, options);

      this.setState({ positionWatchID: watchID });
    }
  }

  // Stop watching position
  stopWatchingPosition() {

    if (this.state.geolocationSupport === true &&
      this.state.geolocationPermission === true) {

      navigator.geolocation.clearWatch(this.state.positionWatchID);
    }
  }
}
