import React from 'react';
import MaidenheadLocator from './MaidenheadLocator.js';
import RefreshButton from './RefreshButton.js';
import WatchButton from './WatchButton.js';
import './App.css';

function isPosition(input) {

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

function isPositionError(input) {

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

class App extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      position           : null,
      watchID            : null,
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

    if (isPosition(this.state.position)) {
      return this.renderPosition();
    }

    if (isPositionError(this.state.position)) {
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
              <MaidenheadLocator
                lat={this.state.position.coords.latitude}
                lng={this.state.position.coords.longitude}
                onChange={this.notify} />
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
              <MaidenheadLocator onChange={this.notify} />
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

  getPosition() {

    const success = (position) => {

      this.setState({
        position           : position,
        refreshButtonState : 'default',
      });

      this.createMap();
    };

    const failure = (positionError) => {

      this.setState({
        position           : positionError,
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

        this.setState({
          position : position,
        });

        this.createMap();
      };

      const failure = (positionError) => {

        this.setState({
          position : positionError,
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

  notify(locator) {

    if (!window.Notification) {
      return;
    }

    if (Notification.permission === 'denied') {
      return;
    }

    if (Notification.permission === 'default') {
      return Notification
        .requestPermission((permission) => {
          if (permission === 'granted') {
            navigator.serviceWorker.ready.then(function(registration) {
              let title = `Entering ${locator}`;
              let options = {
                icon: 'ham-grid-512.png',
                badge: 'gps-marker.png',
              };

              return registration.showNotification(title, options);
            });
          }
        });
    }

    if (Notification.permission === 'granted') {
      return navigator.serviceWorker.ready.then(function(registration) {
        let title = `Entering ${locator}`;
        let options = {
          icon: 'ham-grid-512.png',
          badge: 'gps-marker.png',
        };

        return registration.showNotification(title, options);
      });
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
