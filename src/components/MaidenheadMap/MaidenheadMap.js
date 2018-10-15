import React from 'react';
import positionHelpers from '../../lib/positionHelpers.js';

import './MaidenheadMap.css';

export default class MaidenheadMap extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      panToPosition: true,
    };

    this.google = window.google;
    this.map    = null;
    this.marker = new this.google.maps.Marker();
    this.circle = new this.google.maps.Circle();
    this.popup  = new this.google.maps.InfoWindow();

    this.ref    = React.createRef();

    this.createMap = this.createMap.bind(this);
    this.addGrid   = this.addGrid.bind(this);
    this.addMarker = this.addMarker.bind(this);
  }

  render() {

    const {position, ...rest} = this.props;

    if (this.google) {

      return (<div ref={this.ref} {...rest}>Loading...</div>);

    } else {

      return (<div ref={this.ref} {...rest}>Error: Could not load Google Maps</div>);
    }
  }

  componentDidMount() {

    if (this.google) {

      this.createMap();
      this.addGrid();
      this.addMarker();

    }
  }

  componentDidUpdate() {
    if (this.google) {

      this.addMarker();

    }
  }

  createMap() {

    this.map = new this.google.maps.Map(
      this.ref.current,
      {
        center: {
            lat:  39.83333,
            lng: -98.58333,
        },
        zoom: 10,
        streetViewControl: false,
      }
    );
  }

  addGrid() {

    const google = this.google;
    const map = this.map;

    class MaidenheadGridOverlay extends google.maps.OverlayView {

      constructor(map) {

        super(map);

        // The Google map object
        this.map = map;

        // The grid is made up of a bunch of <div> elements with colored borders.
        // These are those elements.
        this.divs = [];

        // The grid can be drawn at 3 resolutions (based on zoom level).
        // cellWidth and cellHeight are measured in degrees.
        // locatorLength is the number of characters of the Maidenhead locator to display
        this.resolutions = {
          field: {
            cellWidth     : 20,
            cellHeight    : 10,
            locatorLength : 2,
          },
          square: {
            cellWidth     : 2,
            cellHeight    : 1,
            locatorLength : 4,
          },
          subsquare: {
            cellWidth     : 1/12,
            cellHeight    : 1/24,
            locatorLength : 6,
          },
        };

        // Method-ify

        this.onAdd                = this.onAdd.bind(this);
        this.draw                 = this.draw.bind(this);
        this.onRemove             = this.onRemove.bind(this);

        this._calculateResolution = this._calculateResolution.bind(this);
        this._calculateBounds     = this._calculateBounds.bind(this);
        this._calculateCells      = this._calculateCells.bind(this);
        this._calculateLocator    = this._calculateLocator.bind(this);
      }

      onAdd() {

        const resolution = this._calculateResolution();
        const bounds     = this._calculateBounds();

        const numRows  = Math.ceil(bounds.toSpan().lat() / resolution.cellHeight);
        const numCols  = Math.ceil(bounds.toSpan().lng() / resolution.cellWidth);
        const numCells = numRows * numCols;

        for (let i = 0; i < numCells; i++) {

          // Create a div element
          const div = document.createElement("div");

          // Set class name so we can style it correctly
          div.className = 'cell';

          // Add an empty text node to he div
          div.appendChild(document.createTextNode(""));

          // Append div element to the overlay map layer
          this.getPanes().overlayLayer.appendChild(div);

          // Collect elements in an array
          this.divs.push(div);
        }
      }

      draw() {

        const overlayProjection = this.getProjection();

        const resolution  = this._calculateResolution();
        const cells       = this._calculateCells();

        // loop to apply details to cell collection

        this.divs.forEach((val, index, arr) => {

          // NOTE because of rounding (up) we may have more items in this.divs
          // than we need. If we run out of entries in cells and still have
          // entries in this.divs then just fill in the rest of this.divs with
          // "blank" data

          if (cells[index]) {

            const sw = overlayProjection.fromLatLngToDivPixel(cells[index].corners.sw);
            const nw = overlayProjection.fromLatLngToDivPixel(cells[index].corners.nw);
            const ne = overlayProjection.fromLatLngToDivPixel(cells[index].corners.ne);
            // we don't need SE

            // position

            arr[index].style.left     = `${nw.x}px`;
            arr[index].style.top      = `${nw.y}px`;

            // size

            let width = ne.x - nw.x;

            if (width < 0) {
              // for the last cell/div in each row (ne.x - nw.x) is negative which
              // eventually results in an undefined width. The fix is to divide the
              // "world width" by the number of columns.

              width = (overlayProjection.getWorldWidth() / (360 / resolution.cellWidth));
            }

            arr[index].style.width  = `${width}px`;
            arr[index].style.height = `${sw.y - nw.y}px`;

            // maidenhead locator

            arr[index].style.fontSize       = `${(sw.y - nw.y) / 4}px`;
            arr[index].firstChild.nodeValue = cells[index].locator;

          } else {

            arr[index].left     = '0px';
            arr[index].top      = '0px';
            arr[index].width    = '0px';
            arr[index].height   = '0px';
            arr[index].fontSize = '0px';

            arr[index].firstChild.nodeValue = '';
          }
        });
      }

      onRemove() {

        for (let i = 0; i < this.divs.length; i++) {

          if (this.divs[i].parentNode) {

            // Remove element from the DOM
            this.divs[i].parentNode.removeChild(this.divs[i]);
          }
        }

        // Empty the divs array
        this.divs = [];
      }

      /**
       * Determine which grid resolution to use based on the zoom level
       */
      _calculateResolution() {

        const zoom = this.map.getZoom();

        if (zoom < 6) {
          return this.resolutions.field;
        }

        if (zoom > 9) {
          return this.resolutions.subsquare;
        }

        return this.resolutions.square;
      }

      /**
       * Calculate grid bounds based on map bounds
       */
      _calculateBounds() {

        const mapBounds  = this.map.getBounds();
        const resolution = this._calculateResolution();

        // Break mapBounds into components

        let north = mapBounds.getNorthEast().lat();
        let east  = mapBounds.getNorthEast().lng();
        let south = mapBounds.getSouthWest().lat();
        let west  = mapBounds.getSouthWest().lng();

        const width  = mapBounds.toSpan().lng();
        const height = mapBounds.toSpan().lat();

        // Expand width

        if (width > 90) {

          // If width is large simply expand to maximum value

          east =  180;
          west = -180;

        } else {

          // Double the width

          east  = east  + ( width  / 2 );
          west  = west  - ( width  / 2 );

          // Round up (larger) to nearest grid division

          east  = Math.ceil(  east  / resolution.cellWidth ) * resolution.cellWidth;
          west  = Math.floor( west /  resolution.cellWidth ) * resolution.cellWidth;
        }

        // Expand height

        if (height > 60) {

        // If height is large simply expand to maximum value

          north =  90;
          south = -90;

        } else {

          // Double the height

          north = north + ( height / 2 );
          south = south - ( height / 2 );

          // Round up (larger) to nearest grid division

          north = Math.ceil(  north / resolution.cellHeight ) * resolution.cellHeight;
          south = Math.floor( south / resolution.cellHeight ) * resolution.cellHeight;
        }

        // Return expanded and rounded bounds

        return new google.maps.LatLngBounds(
            new google.maps.LatLng(south, west),
            new google.maps.LatLng(north, east)
        );
      }


      _calculateCells() {

        const resolution = this._calculateResolution();
        const bounds     = this._calculateBounds();

        const numRows  = Math.ceil(bounds.toSpan().lat() / resolution.cellHeight);
        const numCols  = Math.ceil(bounds.toSpan().lng() / resolution.cellWidth);

        const cells = [];

        for (let row = 0; row < numRows; row++) {

          for (let col = 0; col < numCols; col++) {

            // NOTE: we start at the SW corner and move NE

            // Calculate the four corners of the grid cell (in lat/lng coordinates)

            const sw = new google.maps.LatLng(
              bounds.getSouthWest().lat() + ( resolution.cellHeight * row ),
              bounds.getSouthWest().lng() + ( resolution.cellWidth  * col )
            );

            const ne = new google.maps.LatLng(
              bounds.getSouthWest().lat() + ( resolution.cellHeight * (row + 1) ),
              bounds.getSouthWest().lng() + ( resolution.cellWidth  * (col + 1) )
            );

            const se =  new google.maps.LatLng(
              sw.lat(),
              ne.lng()
            );

            const nw = new google.maps.LatLng(
              ne.lat(),
              sw.lng()
            );

            // Calculate the Maidenhead locator using the center point of the cell

            const center = new google.maps.LatLngBounds(sw, ne).getCenter();

            const locator = this._calculateLocator(center, resolution.locatorLength);


            cells.push({
              locator: locator,
              corners: {
                ne: ne,
                se: se,
                sw: sw,
                nw: nw,
              },
            });
          }
        }

        return cells;
      }


      /**
       * Calculate the maidenhead locator for a given point, only return the
       * first length characters.
       *
       * @param {LatLng} latLng
       * @param {Number} length
       */
      _calculateLocator(latLng, length) {

        // Convert a number to its corresponding uppercase letter of the alphabet
        const upper = function (number) {
            return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[number];
        };

        // Convert a number to its corresponding lowercase letter of the alphabet
        const lower = function (number) {
            return 'abcdefghijklmnopqrstuvwxyz'[number];
        };

        let lat     = latLng.lat();
        let lng     = latLng.lng();
        let locator = '';

        // NOTE: each step mutates lat and lng and the next step uses the new values

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

        // Return the first length characters of locator
        return locator.slice(0, length);
      }
    }

    const grid = new MaidenheadGridOverlay(map);

    map.addListener('bounds_changed', () => {

      grid.setMap(null);
      grid.setMap(map);
    });
  }

  addMarker() {

    if (positionHelpers.isPosition(this.props.position)) {



      this.marker.setOptions({
        position: {
          lat: this.props.position.coords.latitude,
          lng: this.props.position.coords.longitude,
        },
        title: 'current position',
        map: this.map,
      });

      this.circle.setOptions({
        center: {
          lat: this.props.position.coords.latitude,
          lng: this.props.position.coords.longitude,
        },
        radius: this.props.position.coords.accuracy,
        strokeColor: '#FF0000',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.2,
        map: this.map,
      });

      this.popup.setOptions({
        content: `
          <table class="markerPopup">
            <tr>
              <td class="label">
                <strong>Latitude</strong>
              </td>
              <td class="number">${this.props.position.coords.latitude.toFixed(4)}</td>
              <td>degrees</td>
            </tr>
            <tr>
              <td class="label">
                <strong>Longitude</strong>
              </td>
              <td class="number">${this.props.position.coords.longitude.toFixed(4)}</td>
              <td>degrees</td>
            </tr>
            <tr>
              <td class="label">
                <strong>Accuracy</strong>
              </td>
              <td class="number">${this.props.position.coords.accuracy.toFixed(4)}</td>
              <td>meters</td>
            </tr>
          </table>
        `,
      });

      this.marker.addListener('click', () => {
        this.popup.open(this.map, this.marker);
      });


      if (this.state.panToPosition === true) {

        this.map.panTo({
          lat: this.props.position.coords.latitude,
          lng: this.props.position.coords.longitude,
        });

        this.setState({ panToPosition: false });
      }

    }
  };
}
