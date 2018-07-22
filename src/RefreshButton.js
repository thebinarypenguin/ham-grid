import React from 'react';

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

RefreshButton.defaultProps = {
    state   : 'default',
    onClick : () => {},
};

export default RefreshButton;
