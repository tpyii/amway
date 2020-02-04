import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import Curator from './Curator';
import Member from './Member';
import Report from './Report';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <Container>
        <Switch>
          <Route exact path='/app'>
            <Curator />
          </Route>
          <Route exact path='/app/curator/:curatorId' component={Member} />
          <Route exact path='/app/curator/:curatorId/member/:memberId' component={Report} />
          <Route>
            <Redirect to='/app' />
          </Route>
        </Switch>
      </Container>
    );
  }
}

export default App;
