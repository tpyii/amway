import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, Form } from 'react-bootstrap';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      usernumber: '',
      useremail: '',
      userphone: '',
      userinstagram: '',
      userregion: '',
      userstructure: '',

      validate: {
        username: false,
        usernumber: false,
        useremail: false,
        userphone: false,
        userinstagram: false,
        userregion: false,
        userstructure: false
      }
    };
  }

  checkInputValidation = event => {
    const {name, value} = event.target;
    let validate = false;

    switch(name) {
      case 'username':
        const regexp = /^[А-Яа-яЁё ]+$/;
        validate = regexp.test(value.trim());
    }

    console.log(this.state.validate)
  }

  hundleInputChange = event => {
    const {name, value} = event.target;

    this.setState({
      [name]: value
    });

    this.checkInputValidation(event)
  }

  hundleOnSubmit = event => {
    event.preventDefault();
  }

  render() {
    return (
      <Container>
        <form 
          noValidate
          onSubmit={event => this.hundleOnSubmit(event)}
        >

          <Form.Group controlId="username">
            <Form.Label>Введите Фамилию Имя Отчество *</Form.Label>
            <Form.Control 
              required
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.hundleInputChange}
              isValid={this.state.validate.username}
            />
          </Form.Group>

          <Form.Group controlId="usernumber">
            <Form.Label>Введите Ваш номер Партнера *</Form.Label>
            <Form.Control 
              required
              type="number"
              name="usernumber"
              value={this.state.usernumber}
              onChange={this.hundleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="useremail">
            <Form.Label>Введите адрес электронной почты *</Form.Label>
            <Form.Control 
              required
              type="email"
              name="useremail"
              value={this.state.useremail}
              onChange={this.hundleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="userphone">
            <Form.Label>Введите номер вашего телефона *</Form.Label>
            <Form.Control 
              required
              type="tel"
              name="userphone"
              value={this.state.userphone}
              onChange={this.hundleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="userinstagram">
            <Form.Label>Введите Ваш адрес в Инстаграм для проведения марафона *</Form.Label>
            <Form.Control 
              required
              type="text"
              name="userinstagram"
              value={this.state.userinstagram}
              onChange={this.hundleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="userregion">
            <Form.Label>Выберите регион *</Form.Label>
            <Form.Control 
              as="select"
              required
              type="text"
              name="userregion"
              value={this.state.userregion}
              onChange={this.hundleInputChange}
            >
              <option>Юг</option>
              <option>Центр</option>
              <option>Урал</option>
              <option>Сибирь и Дальний Восток</option>
              <option>Казахстан</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="userstructure">
            <Form.Label>Выберите Вашу структуру</Form.Label>
            <Form.Control 
              as="select"
              type="text"
              name="userstructure"
              value={this.state.userstructure}
              onChange={this.hundleInputChange}
            >
              <option></option>
            </Form.Control>
          </Form.Group>

          <Button 
            variant="primary"
            type="submit">
            Отправить    
          </Button>

        </form>
      </Container>
    );
  }
}

export default App;
