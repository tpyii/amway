import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, Form, InputGroup} from 'react-bootstrap';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        name: '',
        partner: '',
        email: '',
        phone: '',
        instagram: '',
        region: '',
        structure: '',
      },

      validate: {
        name: '',
        partner: '',
        email: '',
        phone: '',
        instagram: '',
        region: '',
        structure: '',
      }
    };
  }

  checkValueValidation = event => {
    const {name, value} = event.target;
    let regexp;
    let validate;

    switch(name) {
      case 'name':
        regexp = /^[А-Яа-яЁё ]+$/;
        validate = regexp.test(value.trim());
        break;

      case 'partner':
        regexp = /^[0-9]+$/;
        validate = regexp.test(value.trim());
        break;

      case 'email':
        regexp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        validate = regexp.test(value.trim());
        break;

      case 'instagram':
        regexp = /^[A-Za-z0-9._]+$/;
        validate = regexp.test(value.trim());
        break;
    }

    return validate;
  }

  hundleInputChange = event => {
    const {name, value} = event.target;
    const validate = this.checkValueValidation(event);

    this.setState({
      values: {
        ...this.state.values,
        [name]: value
      },
      validate: {
        ...this.state.validate,
        [name]: validate
      }
    });
  }

  hundleOnSubmit = event => {
    event.preventDefault();
    const options = {
      method: 'POST',
      body: JSON.stringify(this.state.values)
    }

    fetch('v1/curators', options)
      .then(response => response.json())
      .then(result => console.log(result));
  }

  render() {
    return (
      <Container>
        <form 
          noValidate
          onSubmit={event => this.hundleOnSubmit(event)}
        >

          <Form.Group controlId="name">
            <Form.Label>Введите Фамилию Имя Отчество *</Form.Label>
            <Form.Control 
              required
              type="text"
              name="name"
              value={this.state.values.name}
              onChange={this.hundleInputChange}
              isValid={this.state.validate.name === true}
              isInvalid={this.state.validate.name === false}
            />
            <Form.Control.Feedback type="invalid">
              Допустимы только кириллические буквы и пробел
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="partner">
            <Form.Label>Введите Ваш номер Партнера *</Form.Label>
            <Form.Control 
              required
              type="number"
              name="partner"
              value={this.state.values.partner}
              onChange={this.hundleInputChange}
              isValid={this.state.validate.partner === true}
              isInvalid={this.state.validate.partner === false}
            />
            <Form.Control.Feedback type="invalid">
              Допустимы только цифры
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Введите адрес электронной почты *</Form.Label>
            <Form.Control 
              required
              type="email"
              name="email"
              value={this.state.values.email}
              onChange={this.hundleInputChange}
              isValid={this.state.validate.email === true}
              isInvalid={this.state.validate.email === false}
            />
            <Form.Control.Feedback type="invalid">
              Некорректно указан адрес электронной почты
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="phone">
            <Form.Label>Введите номер вашего телефона *</Form.Label>
            <Form.Control 
              required
              type="tel"
              name="phone"
              value={this.state.values.phone}
              onChange={this.hundleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="instagram">
            <Form.Label>Введите Ваш адрес в Инстаграм для проведения марафона</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>@</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control 
                type="text"
                name="instagram"
                placeholder="name"
                value={this.state.values.instagram}
                onChange={this.hundleInputChange}
                isValid={this.state.validate.instagram === true}
                isInvalid={this.state.validate.instagram === false}
              />
              <Form.Control.Feedback type="invalid">
                Допустимы только латинские буквы, цыфры и знаки . и _
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="region">
            <Form.Label>Выберите регион *</Form.Label>
            <Form.Control 
              as="select"
              required
              type="text"
              name="region"
              value={this.state.values.region}
              onChange={this.hundleInputChange}
            >
              <option></option>
              <option>Юг</option>
              <option>Центр</option>
              <option>Урал</option>
              <option>Сибирь и Дальний Восток</option>
              <option>Казахстан</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="structure">
            <Form.Label>Выберите Вашу структуру</Form.Label>
            <Form.Control 
              as="select"
              type="text"
              name="structure"
              value={this.state.values.structure}
              onChange={this.hundleInputChange}
            >
              <option></option>
              <option>DIAMOND ALLIANCE</option>
              <option>Network21</option>
              <option>WWD</option>
              <option>DA</option>
              <option>Yager</option>
              <option>SCHWARZ</option>
              <option>Содружество</option>
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
