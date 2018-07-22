import React from 'react';

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

WatchButton.defaultProps = {
    state   : 'default',
    onClick : () => {},
};

export default WatchButton;
