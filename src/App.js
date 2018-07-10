import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {

    super(props);

    this.state = {
      location      : null,
      locationError : null,
    };

    this.getLocation                = this.getLocation.bind(this);
    this.calculateMaidenheadLocator = this.calculateMaidenheadLocator.bind(this);
  }

  componentDidMount() {
    this.getLocation();
  }

  getLocation() {

    const refreshButton = document.getElementById('refresh');

    const options = {
      enableHighAccuracy : true,
      timeout            : 5 * 1000,
      maximumAge         : 0,
    };

    const success = (position) => {

      const location = {};

      location.latitude = position.coords.latitude;

      location.longitude = position.coords.longitude;

      location.accuracy = position.coords.accuracy;

      location.maidenheadLocator = this.calculateMaidenheadLocator(
        location.latitude,
        location.longitude
      );

      refreshButton.className = 'ui button';

      this.setState({
        location      : location,
        locationError : null,
      });

      this.createMap();
    };

    const failure = (err) => {

      refreshButton.className = 'ui button';

      this.setState({
        location      : null,
        locationError : err,
      });
    };

    refreshButton.className = 'ui button disabled loading';

    navigator.geolocation.getCurrentPosition(success, failure, options);
  }

  calculateMaidenheadLocator(lat, lon) {

    // Convert a number to its corresponding uppercase letter of the alphabet
    const upper = function (number) {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[number];
    };

    // Convert a number to its corresponding lowercase letter of the alphabet
    const lower = function (number) {
        return 'abcdefghijklmnopqrstuvwxyz'[number];
    };

    // NOTE: each step mutates lat and lon and the next step uses the new values

    let locator = '';

    // Shift coordinates to get rid of any negative numbers
    lat += 90;
    lon += 180;

    // Calculate field
    lat = lat / 10;
    lon = lon / 20;

    // Append field
    locator += upper(Math.trunc(lon)) + upper(Math.trunc(lat))

    // Calculate square
    lat = (lat - Math.trunc(lat)) * 10
    lon = (lon - Math.trunc(lon)) * 10

    // Append square
    locator += `${Math.trunc(lon)}` + `${Math.trunc(lat)}`;

    // Calculate subsquare
    lat = (lat - Math.trunc(lat)) * 24;
    lon = (lon - Math.trunc(lon)) * 24;

    // Append subsquare
    locator += lower(Math.trunc(lon)) + lower(Math.trunc(lat));

    return locator;
  }

  createMap() {

    // Google maps is weird

    const map = new window.google.maps.Map(
      document.getElementById('map'),
      {
          center: {
              lat: this.state.location.latitude,
              lng: this.state.location.longitude,
          },
          zoom: 17,
          streetViewControl: false,
      }
    );

    new window.google.maps.Circle({
      center: {
        lat: this.state.location.latitude,
        lng: this.state.location.longitude,
      },
      radius: this.state.location.accuracy,
      strokeColor: '#FF0000',
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.2,
      map: map,
    });
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

  renderInitial() {

    return (
      <div className="ui text container">

        <div id ="widget" className="ui celled grid">

          <div className="center aligned middle aligned row">

            <div className="sixteen wide column">
              <div id="maidenheadLocator"> &nbsp; </div>
              <button id="refresh" className="ui button" onClick={this.getLocation}>Refresh</button>
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

            <div className="sixteen wide column">
              <div id="map"> &nbsp; </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  renderLocation() {

    return (
      <div className="ui text container">

        <div id ="widget" className="ui celled grid">

          <div className="center aligned middle aligned row">

            <div className="sixteen wide column">
              <div id="maidenheadLocator">{this.state.location.maidenheadLocator}</div>
              <button id="refresh" className="ui button" onClick={this.getLocation}>Refresh</button>
            </div>

          </div>

          <div className="left aligned middle aligned row">

            <div className="eight wide column">
              <strong>Latitude</strong><br /><em>In decimal degrees</em>
            </div>

            <div className="eight wide column">
              <div id="latitude">{this.state.location.latitude.toFixed(4)}</div>
            </div>

          </div>

          <div className="left aligned middle aligned row">

            <div className="eight wide column">
              <strong>Longitude</strong><br /><em>In decimal degrees</em>
            </div>

            <div className="eight wide column">
              <div id="longitude">{this.state.location.longitude.toFixed(4)}</div>
            </div>

          </div>

          <div className="left aligned middle aligned row">

            <div className="eight wide column">
              <strong>Accuracy</strong><br /><em>In meters</em>
            </div>

            <div className="eight wide column">
              <div id="accuracy">{this.state.location.accuracy.toFixed(2)}</div>
            </div>

          </div>

          <div className="center aligned middle aligned row">

            <div className="sixteen wide column">
              <div id="map"> &nbsp; </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  renderLocationError() {

    return (
      <div className="ui text container">

        <div id ="widget" className="ui celled grid">

          <div className="center aligned middle aligned row">

            <div className="sixteen wide column">

              <div className="ui error message">
                <div className="header">
                  Unable to get position
                </div>
                <p>{this.state.locationError.message}</p>
              </div>

              <button id="refresh" className="ui button" onClick={this.getLocation}>Refresh</button>
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

            <div className="sixteen wide column">
              <div id="map"> &nbsp; </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  render() {

    if (!navigator.geolocation) {
      return this.renderNoGeolocationSupport();
    }

    if (this.state.location) {
      return this.renderLocation();
    }

    if (this.state.locationError) {
      return this.renderLocationError();
    }

    return this.renderInitial();
  }
}

export default App;
