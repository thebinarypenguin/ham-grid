import React from 'react';

class MaidenheadLocator extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            locator : '',
        };
    }

    componentDidMount() {

        if (Number.isFinite(this.props.lat) && Number.isFinite(this.props.lng)) {

            const loc = this.calculate(this.props.lat, this.props.lng);

            if (loc !== this.state.locator) {
                this.props.onChange(loc)
                this.setState({ locator: loc });
            }
        }
    }

    componentDidUpdate() {

        if (Number.isFinite(this.props.lat) && Number.isFinite(this.props.lng)) {

            const loc = this.calculate(this.props.lat, this.props.lng);

            if (loc !== this.state.locator) {
                this.props.onChange(loc)
                this.setState({ locator: loc });
            }
        }
    }

    calculate(lat, lng) {

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

    render() {

        return <div id="maidenheadLocator">{this.state.locator}</div>;
    }
}


MaidenheadLocator.defaultProps = {
    lat: null,
    lng: null,
    onChange: () => {},
};

export default MaidenheadLocator;
