import React, { Component } from "react";
import "./App.css";
import { HashRouter } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme, withTheme } from '@material-ui/core/styles';
import routes from './routes'
import defaultTheme from './themes/defaultTheme'

class App extends Component {
  
  render() {

    const theme = createMuiTheme();

    return (
      <HashRouter>
        <MuiThemeProvider theme={defaultTheme}>
          <div className="App">{routes}</div>
        </MuiThemeProvider>
      </HashRouter>
    );
  }
}

export default withTheme()(App);