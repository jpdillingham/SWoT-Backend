import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

import { Link, Route, Switch } from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Navigation from '../Navigation'
import Homepage from '../Homepage'
import Exercises from '../Exercises'
import Routines from '../Routines'

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem'
import Home from 'material-ui/svg-icons/action/home';
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline'
import ContentPaste from 'material-ui/svg-icons/content/content-paste'
import ActionAccessibility from 'material-ui/svg-icons/action/accessibility'
import Snackbar from 'material-ui/Snackbar'

class App extends Component {
    state = {
        snackbar: {
            visible: false,
            message: ''
        }
    }

    theme = getMuiTheme({
        palette: {
            primary1Color: "#2196f3",
            primary2Color: "#64b5f6",
            accent1Color: '#ff5722',
            pickerHeaderColor: "#29b6f6"
        }
    })

    render() {
        return (
            <MuiThemeProvider muiTheme={this.theme}>
                <div>
                    <Navigation>
                        <MenuItem containerElement={<Link to="/" />} leftIcon={<Home />} >Home</MenuItem>
                        <MenuItem containerElement={<Link to="/exercises" />} leftIcon={<ActionAccessibility />}>Exercises</MenuItem>
                        <MenuItem containerElement={<Link to="/routines" />} leftIcon={<ContentPaste />}>Routines</MenuItem>
                    </Navigation>
                    <div style={{marginTop: 83}}>
                        <Switch>
                            <Route exact path="/" component={Homepage}/>
                            <Route path="/exercises" component={Exercises}/>
                            <Route path="/routines" component={Routines}/>
                        </Switch>
                    </div>
                    <Snackbar
                        open={this.props.snackbar.visible}
                        message={this.props.snackbar.message}
                        autoHideDuration={2500}
                        onRequestClose={this.hideSnackbar}
                    />
                    <FlatButton onClick={() => this.props.showSnackbar('hello world!')}>snack</FlatButton>
                </div>
            </MuiThemeProvider>
        );
    }    
}

const mapStateToProps = (state, ownProps) => {
    console.log('state:', state)
    return { 
        snackbar: state.snackbar
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    showSnackbar: (message) => {
        dispatch({ type: 'SNACKBAR_SHOW', snackbar: { visible: true, message: message ? message : '' }} )
    },
    hideSnackbar: () => {
        dispatch({ type: 'SNACKBAR_HIDE', snackbar: { visible: false, message: '' } })
    }
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));