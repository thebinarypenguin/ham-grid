import React from 'react';
import './App.css';

function RefreshButton(props) {

  let button = null;

  switch (props.state) {

    case 'loading':

      button = (
        <button
          id="refresh"
          className="ui massive icon button disabled loading"
          onClick={props.onClick}
          disabled>

          <i className="sync alternate icon"></i>
        </button>
      );

      break;

    case 'disabled':

      button = (
        <button
          id="refresh"
          className="ui massive icon button disabled"
          onClick={props.onClick}
          disabled>

          <i className="sync alternate icon"></i>
        </button>
      );

      break;

    case 'default':

      button = (
        <button
          id="refresh"
          className="ui massive icon button"
          onClick={props.onClick}>

          <i className="sync alternate icon"></i>
        </button>
      );

      break;

    default:
      // do nothing
      break;
  }

  return button;
}

// todo propTypes
// todo defaultProps

function WatchButton(props) {

  let button = null;

  switch (props.state) {

    case 'toggled':

      button = (
        <button
          id="watch"
          className="ui massive icon button"
          onClick={props.onClick}>

          <i className="eye slash icon"></i>
        </button>
      );

      break;

    case 'default':

      button = (
        <button
          id="watch"
          className="ui massive icon button"
          onClick={props.onClick}>

          <i className="eye icon"></i>
        </button>
      );

      break;

    default:
      // do nothing
      break;
  }

  return button;
}

// todo propTypes
// todo defaultProps

class App extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      position           : null,
      watchID            : null,
      maidenheadLocator  : null,
      refreshButtonState : 'default',
      watchButtonState   : 'default',
    };

    this.getPosition            = this.getPosition.bind(this);
    this.startWatchingPosition  = this.startWatchingPosition.bind(this);
    this.stopWatchingPosition   = this.stopWatchingPosition.bind(this);
    this.toggleWatchingPosition = this.toggleWatchingPosition.bind(this);
    this.createMap              = this.createMap.bind(this);
  }

  componentDidMount() {

    this.getPosition();
  }

  componentWillUnmount() {

    if (this.state.watchID !== null) {
      this.stopWatchingPosition();
    }
  }

  render() {

    if (!navigator.geolocation) {
      return this.renderNoGeolocationSupport();
    }

    if (this.isPosition(this.state.position)) {
      return this.renderPosition();
    }

    if (this.isPositionError(this.state.position)) {
      return this.renderPositionError();
    }

    return this.renderInitial();
  }

  renderNoGeolocationSupport() {

    return (
      <div className="ui text container">

        <div id ="widget" className="ui celled grid">

          <div className="center aligned middle aligned row">

            <div className="sixteen wide column">

              <div className="ui error message">
                <div className="header">
                  Your device does not support geolocation
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  renderPosition() {

    return (
      <div className="ui text container">

        <div id ="widget" className="ui celled grid">

          <div className="center aligned middle aligned row">

            <div className="sixteen wide column">
              <div id="maidenheadLocator">{this.state.maidenheadLocator}</div>
              <RefreshButton state={this.state.refreshButtonState} onClick={this.getPosition} />
              <WatchButton state={this.state.watchButtonState} onClick={this.toggleWatchingPosition} />
            </div>

          </div>

          <div className="left aligned middle aligned row">

            <div className="eight wide column">
              <strong>Latitude</strong><br /><em>In decimal degrees</em>
            </div>

            <div className="eight wide column">
              <div id="latitude">{this.state.position.coords.latitude.toFixed(4)}</div>
            </div>

          </div>

          <div className="left aligned middle aligned row">

            <div className="eight wide column">
              <strong>Longitude</strong><br /><em>In decimal degrees</em>
            </div>

            <div className="eight wide column">
              <div id="longitude">{this.state.position.coords.longitude.toFixed(4)}</div>
            </div>

          </div>

          <div className="left aligned middle aligned row">

            <div className="eight wide column">
              <strong>Accuracy</strong><br /><em>In meters</em>
            </div>

            <div className="eight wide column">
              <div id="accuracy">{this.state.position.coords.accuracy.toFixed(2)}</div>
            </div>

          </div>

          <div className="center aligned middle aligned row">

            <div id="map" className="sixteen wide column">
            </div>

          </div>

        </div>

      </div>
    );
  }

  renderPositionError() {

    return (
      <div className="ui text container">

        <div id ="widget" className="ui celled grid">

          <div className="center aligned middle aligned row">

            <div className="sixteen wide column">

              <div className="ui error message">
                <div className="header">
                  Unable to get position
                </div>
                <p>{this.state.position.message}</p>
              </div>

              <RefreshButton state={this.state.refreshButtonState} onClick={this.getPosition} />
              <WatchButton state={this.state.watchButtonState} onClick={this.toggleWatchingPosition} />
            </div>

          </div>

          <div className="left aligned middle aligned row">

            <div className="eight wide column">
              <strong>Latitude</strong><br /><em>In decimal degrees</em>
            </div>

            <div className="eight wide column">
              <div id="latitude"> &nbsp; </div>
            </div>

          </div>

          <div className="left aligned middle aligned row">

            <div className="eight wide column">
              <strong>Longitude</strong><br /><em>In decimal degrees</em>
            </div>

            <div className="eight wide column">
              <div id="longitude"> &nbsp; </div>
            </div>

          </div>

          <div className="left aligned middle aligned row">

            <div className="eight wide column">
              <strong>Accuracy</strong><br /><em>In meters</em>
            </div>

            <div className="eight wide column">
              <div id="accuracy"> &nbsp; </div>
            </div>

          </div>

          <div className="center aligned middle aligned row">

            <div id="map" className="sixteen wide column">
            </div>

          </div>

        </div>

      </div>
    );
  }

  renderInitial() {

    return (
      <div className="ui text container">

        <div id ="widget" className="ui celled grid">

          <div className="center aligned middle aligned row">

            <div className="sixteen wide column">
              <div id="maidenheadLocator"> &nbsp; </div>
              <RefreshButton state={this.state.refreshButtonState} onClick={this.getPosition} />
              <WatchButton state={this.state.watchButtonState} onClick={this.toggleWatchingPosition} />
            </div>

          </div>

          <div className="left aligned middle aligned row">

            <div className="eight wide column">
              <strong>Latitude</strong><br /><em>In decimal degrees</em>
            </div>

            <div className="eight wide column">
              <div id="latitude"> &nbsp; </div>
            </div>

          </div>

          <div className="left aligned middle aligned row">

            <div className="eight wide column">
              <strong>Longitude</strong><br /><em>In decimal degrees</em>
            </div>

            <div className="eight wide column">
              <div id="longitude"> &nbsp; </div>
            </div>

          </div>

          <div className="left aligned middle aligned row">

            <div className="eight wide column">
              <strong>Accuracy</strong><br /><em>In meters</em>
            </div>

            <div className="eight wide column">
              <div id="accuracy"> &nbsp; </div>
            </div>

          </div>

          <div className="center aligned middle aligned row">

            <div id="map" className="sixteen wide column">
            </div>

          </div>

        </div>

      </div>
    );
  }

  isPosition(input) {

    if (!input) {
      return false;
    }

    if (input.constructor.name === 'Position') {
      return true;
    }

    if (input.coords !== undefined &&
        input.coords.latitude !== undefined &&
        input.coords.longitude !== undefined &&
        input.coords.accuracy !== undefined) {
      return true;
    }

    return false;
  }

  isPositionError(input) {

    if (!input) {
      return false;
    }

    if (input.constructor.name === 'PositionError') {
      return true;
    }

    if (input.code !== undefined &&
        input.message !== undefined) {
      return true;
    }

    return false;
  }

  getPosition() {

    const success = (position) => {

      const locator = this.calculateMaidenheadLocator(
        position.coords.latitude,
        position.coords.longitude
      );

      if (locator !== this.state.maidenheadLocator) {
        this.notify(locator);
      }

      this.setState({
        position           : position,
        maidenheadLocator  : locator,
        refreshButtonState : 'default',
      });

      this.createMap();
    };

    const failure = (positionError) => {

      this.setState({
        position           : positionError,
        maidenheadLocator  : null,
        refreshButtonState : 'default',
      });
    };

    const options = {
      enableHighAccuracy : true,
      timeout            : 5 * 1000,
      maximumAge         : 0,
    };

    navigator.geolocation.getCurrentPosition(success, failure, options);

    this.setState({
      refreshButtonState: 'loading',
    });
  }

  startWatchingPosition() {

    if (this.state.watchID === null) {

      const success = (position) => {

        const locator = this.calculateMaidenheadLocator(
          position.coords.latitude,
          position.coords.longitude
        );

        if (locator !== this.state.maidenheadLocator) {
          this.notify(locator);
        }

        this.setState({
          position          : position,
          maidenheadLocator : locator,
        });

        this.createMap();
      };

      const failure = (positionError) => {

        this.setState({
          position          : positionError,
          maidenheadLocator : null,
        });
      };

      const options = {
        enableHighAccuracy : true,
        timeout            : 5 * 1000,
        maximumAge         : 0,
      };

      const id = navigator.geolocation.watchPosition(success, failure, options);

      this.setState({
        watchID            : id,
        refreshButtonState : 'disabled',
        watchButtonState   : 'toggled',
      });
    }
  }

  stopWatchingPosition() {

    if (this.state.watchID !== null) {

      navigator.geolocation.clearWatch(this.state.watchID);

      this.setState({
        watchID            : null,
        refreshButtonState : 'default',
        watchButtonState   : 'default',
      });
    }
  }

  toggleWatchingPosition() {

    if (this.state.watchID === null) {
      this.startWatchingPosition();
    } else {
      this.stopWatchingPosition();
    }
  }

  calculateMaidenheadLocator(lat, lng) {

    // Convert a number to its corresponding uppercase letter of the alphabet
    const upper = function (number) {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[number];
    };

    // Convert a number to its corresponding lowercase letter of the alphabet
    const lower = function (number) {
        return 'abcdefghijklmnopqrstuvwxyz'[number];
    };

    // NOTE: each step mutates lat and lng and the next step uses the new values

    let locator = '';

    // Shift coordinates to get rid of any negative numbers
    lat += 90;
    lng += 180;

    // Calculate field
    lat = lat / 10;
    lng = lng / 20;

    // Append field
    locator += upper(Math.trunc(lng)) + upper(Math.trunc(lat))

    // Calculate square
    lat = (lat - Math.trunc(lat)) * 10
    lng = (lng - Math.trunc(lng)) * 10

    // Append square
    locator += `${Math.trunc(lng)}` + `${Math.trunc(lat)}`;  // eslint-disable-line no-useless-concat

    // Calculate subsquare
    lat = (lat - Math.trunc(lat)) * 24;
    lng = (lng - Math.trunc(lng)) * 24;

    // Append subsquare
    locator += lower(Math.trunc(lng)) + lower(Math.trunc(lat));

    return locator;
  }

  notify(locator) {

    if (!window.Notification) {
      return;
    }

    if (Notification.permission === 'denied') {
      return;
    }

    if (Notification.permission === 'default') {
      return Notification
        .requestPermission()
        .then((permission) => {
          if (permission === 'granted') {
            new Notification(locator);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (Notification.permission === 'granted') {
      return new Notification(locator);
    }
  }

  createMap() {

    // This is totally not the right way to do this

    const map = new window.google.maps.Map(
      document.getElementById('map'),
      {
          center: {
              lat: this.state.position.coords.latitude,
              lng: this.state.position.coords.longitude,
          },
          zoom: 17,
          streetViewControl: false,
      }
    );

    new window.google.maps.Circle({
      center: {
        lat: this.state.position.coords.latitude,
        lng: this.state.position.coords.longitude,
      },
      radius: this.state.position.coords.accuracy,
      strokeColor: '#FF0000',
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.2,
      map: map,
    });
  }
}

export default App;
