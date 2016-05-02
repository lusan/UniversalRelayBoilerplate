/* @flow weak */
/* eslint react/prop-types: 0 */

import Helmet from "react-helmet";
import React from 'react';
import Relay from 'react-relay';

import AppBar from 'material-ui/AppBar';
import AppCanvas from 'material-ui/internal/AppCanvas';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import spacing from 'material-ui/styles/spacing';
//import withWidth, {LARGE, MEDIUM} from 'material-ui/utils/withWidth';

import {darkWhite, lightWhite, grey900} from 'material-ui/styles/colors';

import AppBar_Auth from '../../units/sys-account-management/webapp/components/AppBar_Auth.jsx';
import AppNavDrawer from './AppNavDrawer.jsx';
import muiTheme from '../mui-themes/active-theme.js';


class Chrome extends React.Component
{
  constructor( props )
  {
    super( props );

    this.state = {
      navDrawerOpen: false,
    };
  }

  getChildContext( )
  {
    return ( {
      muiTheme: getMuiTheme(
        muiTheme,
        { userAgent: navigator.userAgent }
      ),
    } );
  }

  _handle_onTouchTap_NavigationToggle = ( ) =>
  {
    this._handle_RequestChangeNavDrawer( ! this.state.navDrawerOpen );
  };

  _handle_RequestChangeNavDrawer = (open) => {
    this.setState({
      navDrawerOpen: open,
    });
  };

  handleChangeList = (event, value) => {
    this.context.router.push(value);
    this.setState({
      navDrawerOpen: false,
    });
  };


  getStyles()
  {
    const styles = {
      appBar: {
        position: 'fixed',
        // Needed to overlap the examples
        // TODO: This can not be found:
        //zIndex: this.state.muiTheme.zIndex.appBar + 1,
        top: 0,
      },
      root: {
        paddingTop: spacing.desktopKeylineIncrement,
        minHeight: 400,
      },
      content: {
        margin: spacing.desktopGutter,
      },
      contentWhenMedium: {
        margin: `${spacing.desktopGutter * 2}px ${spacing.desktopGutter * 3}px`,
      },
      footer: {
        backgroundColor: grey900,
        textAlign: 'center',
      },
      a: {
        color: darkWhite,
      },
      p: {
        margin: '0 auto',
        padding: 0,
        color: lightWhite,
        maxWidth: 356,
      },
      iconButton: {
        color: darkWhite,
      },
    };

    // if ( this.props.width === MEDIUM || this.props.width === LARGE )
    //   styles.content = Object.assign(styles.content, styles.contentWhenMedium);

    return styles;
  }

  render( )
  {
    const styles = this.getStyles();

      let {
      navDrawerOpen,
    } = this.state;

    let docked = false;
    let showMenuIconButton = true;

    return (
      <AppCanvas>
        <Helmet
          title="Universal Relay Starter Kit"
          meta={ [
            { name : "description", content: "Starter kit featuring Cassandra, Relay, React, Material-UI" },
          ] }
        />
        <AppBar
          onLeftIconButtonTouchTap={ this._handle_onTouchTap_NavigationToggle }
          title="Starter Kit"
          zDepth={0}
          iconElementRight={ <AppBar_Auth Viewer={this.props.Viewer} /> }
          style={styles.appBar}
          showMenuIconButton={showMenuIconButton}
        />
        <AppNavDrawer
          style={styles.navDrawer}
          location={location}
          docked={docked}
          onRequestChangeNavDrawer={this._handle_RequestChangeNavDrawer}
          onChangeList={this.handleChangeList}
          open={navDrawerOpen}
        />

        <div style={ { paddingTop: 60, paddingLeft: 4, paddingRight: 4 } }>
          {this.props.children}
        </div>

      </AppCanvas>
    )
  }
}

//

Chrome.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

Chrome.childContextTypes = {
  muiTheme: React.PropTypes.object,
};

//

// It is important to retrieve User_AuthToken, since it is used in client.js
//export default Relay.createContainer( withWidth( )( Chrome ), {
export default Relay.createContainer( Chrome, {
  fragments: {
    Viewer: () => Relay.QL`
      fragment on Viewer {
        User_IsAnonymous,
        User_AuthToken,
        ${AppBar_Auth.getFragment('Viewer')},
      }
    `,
  },
});
