import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import Curator from './Curator';
import Member from './Member';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <Container>
        <Switch>
          <Route exact path='/'>
            <Curator />
          </Route>
          <Route path="/members">
            <Member />
          </Route>
          <Route>
            <Redirect to='/' />
          </Route>
        </Switch>
      </Container>
    );
  }
}

export default App;
