import React from 'react';
import positionHelpers from '../../lib/positionHelpers.js';
import calculateMaidenheadLocator from '../../lib/calculateMaidenheadLocator.js'

export default class MaidenheadLocator extends React.Component {

  render() {

    const {position, ...rest} = this.props;

    if (positionHelpers.isPosition(position)) {

      return (
        <div {...rest}>
          {calculateMaidenheadLocator(position.coords.latitude, position.coords.longitude)}
        </div>
      );
    }

    if (positionHelpers.isPositionError(position)) {

      return (
        <div {...rest}>
          {position.message}
        </div>
      );
    }

    return (
      <div {...rest}> Loading... </div>
    );
  }
}
