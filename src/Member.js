import React from 'react';
import { Button, Form } from 'react-bootstrap';

class Member extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        name: '',
        type: '',
        number: '',
        weight: '',
        age: '',
        date_entry: '',
        photo: '',
      },

      validate: {
        name: '',
        type: '',
        number: '',
        weight: '',
        age: '',
        date_entry: '',
        photo: '',
      },

      messages: {
        errors: [],
        success: []
      }
    };
  }

  componentDidMount() {
    const { curatorId } = this.props.match.params;

    fetch(`/app/v1/curators/id/${curatorId}`)
      .then(response => response.json())
      .then(result => {
        if(result.errors)
          window.location.pathname = '/app';
      });
  }

  checkValueValidation = event => {
    let {name, value, type} = event.target;
    let regexp;
    let validate;

    if(type === 'file')
      value = event.target.files[0] ? event.target.files[0] : false;

    switch(name) {
      case 'name':
        regexp = /^[А-Яа-яЁё ]+$/;
        validate = regexp.test(value.trim());
        break;

      case 'type':
        validate = value.trim().length > 0;
        break;

      case 'number':
        regexp = /^[0-9]+$/;
        validate = value.trim().length ? 
                    regexp.test(value.trim()) :
                    '';
        break;

      case 'weight':
        regexp = /^[0-9]+$/;
        validate = regexp.test(value.trim());
        break;
      
      case 'age':
        regexp = /^[0-9]+$/;
        validate = regexp.test(value.trim());
        break;

      case 'date_entry':
        regexp = /^((19|2[0-9])[0-9]{2})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])+$/;
        validate = regexp.test(value.trim());
        break;

      case 'photo':
        regexp = /^(image\/)+(jpeg|jpg|png)+$/;
        validate = value ? (value.size <= 2097152 && regexp.test(value.type)) : false;
        break;
    }

    return validate;
  }

  hundleInputChange = event => {
    let {name, value, type } = event.target;
    const validate = this.checkValueValidation(event);

    if(type === 'file') 
      value = event.target.files.length ? event.target.files[0].name : '';

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
    const body = new FormData(event.target);
    const options = {
      method: 'POST',
      body
    }

    const { curatorId } = this.props.match.params;

    fetch(`/app/v1/members/id/${curatorId}`, options)
      .then(response => response.json())
      .then(result => {
        if(result.errors) {
          console.log(result.errors);
          return;
        }

        if(result.validate) {
          this.setState({
            validate : {
              ...this.state.validate,
              ...result.validate
            }
          })
          return;
        }

        this.setState({
          messages : {
            ...this.state.messages,
            success: [...result.success]
          }
        })
      });
  }

  render() {
    const { success } = this.state.messages;
    return (
      <>
        <h1>Участник</h1>
        {success.length ? 
          <Message message={success[0]} /> :
          <MemberForm member={this} />}
      </>
    )
  }
}

function Message({message}) {
  return (
    <div>
      <h3>{message.title}</h3>
      <p>{message.text}</p>
    </div>
  )
}

function MemberForm({member}) { 
  return (
    <form 
      noValidate
      onSubmit={event => member.hundleOnSubmit(event)}
    >

      <Form.Group controlId="name">
        <Form.Label>Фамилия Имя Отчество участника *</Form.Label>
        <Form.Control 
          required
          type="text"
          name="name"
          value={member.state.values.name}
          onChange={member.hundleInputChange}
          isValid={member.state.validate.name === true}
          isInvalid={member.state.validate.name === false || member.state.validate.name.length}
        />
        <Form.Control.Feedback type="invalid">
          {member.state.validate.name.length ? member.state.validate.name : 'Допустимы только кириллические буквы и пробел'}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="type">
        <Form.Label>Тип Участника *</Form.Label>
        <Form.Control 
          as="select"
          required
          type="text"
          name="type"
          value={member.state.values.type}
          onChange={member.hundleInputChange}
          isValid={member.state.validate.type === true}
          isInvalid={member.state.validate.type === false || member.state.validate.type.length}
        >
          <option></option>
          <option>Незарегистрированный клиент</option>
          <option>Зарегистрированный клиент</option>
          <option>Партнер</option>
        </Form.Control>
        <Form.Control.Feedback type="invalid">
            {member.state.validate.type.length ? member.state.validate.type : 'Выберите значение из списка'}
          </Form.Control.Feedback>
      </Form.Group>

      {member.state.values.type !== 'Незарегистрированный клиент' && member.state.values.type !== '' && (
        <Form.Group controlId="number">
          <Form.Label>Номер (для Зарегистрированного клиента и Партнера) *</Form.Label>
          <Form.Control 
            type="number"
            name="number"
            value={member.state.values.number}
            onChange={member.hundleInputChange}
            isValid={member.state.validate.number === true}
            isInvalid={member.state.validate.number === false || member.state.validate.number.length}
          />
          <Form.Control.Feedback type="invalid">
            {member.state.validate.number.length ? member.state.validate.number : 'Допустимы только цифры'}
          </Form.Control.Feedback>
        </Form.Group>
      )}

      <Form.Group controlId="weight">
        <Form.Label>Вес участника в кг на начало программы *</Form.Label>
        <Form.Control 
          required
          type="number"
          name="weight"
          value={member.state.values.weight}
          onChange={member.hundleInputChange}
          isValid={member.state.validate.weight === true}
          isInvalid={member.state.validate.weight === false || member.state.validate.weight.length}
        />
        <Form.Control.Feedback type="invalid">
          {member.state.validate.weight.length ? member.state.validate.weight : 'Допустимы только цифры'}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="age">
        <Form.Label>Возраст участника *</Form.Label>
        <Form.Control 
          required
          type="number"
          name="age"
          value={member.state.values.age}
          onChange={member.hundleInputChange}
          isValid={member.state.validate.age === true}
          isInvalid={member.state.validate.age === false || member.state.validate.age.length}
        />
        <Form.Control.Feedback type="invalid">
          {member.state.validate.age.length ? member.state.validate.age : 'Допустимы только цифры'}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="date_entry">
        <Form.Label>Дата вступления в программу *</Form.Label>
        <Form.Control 
          required
          type="date"
          name="date_entry"
          value={member.state.values.date_entry}
          onChange={member.hundleInputChange}
          isValid={member.state.validate.date_entry === true}
          isInvalid={member.state.validate.date_entry === false || member.state.validate.date_entry.length}
        />
        <Form.Control.Feedback type="invalid">
          {member.state.validate.date_entry.length ? member.state.validate.date_entry : 'Не корректно указана дата'}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="photo">
        <Form.Label>Фото участника До программы *</Form.Label>
        <Form.Control 
          required
          type="file"
          name="photo"
          accept=".jpg, .jpeg, .png"
          onChange={member.hundleInputChange}
          isValid={member.state.validate.photo === true}
          isInvalid={member.state.validate.photo === false || member.state.validate.photo.length}
        />
        <Form.Control.Feedback type="invalid">
          {member.state.validate.photo.length ? member.state.validate.photo : 'Допустимые форматы .jpg, .jpeg и .png'}
        </Form.Control.Feedback>
      </Form.Group>

      <Button 
        variant="primary"
        type="submit"
        disabled={
          member.state.validate.name === false || member.state.validate.name.length || !member.state.values.name.trim().length ||
          member.state.validate.type === false || member.state.validate.type.length || !member.state.values.type.trim().length ||
          member.state.validate.number === false ||
          member.state.validate.weight === false || member.state.validate.weight.length || !member.state.values.weight.trim().length ||
          member.state.validate.age === false || member.state.validate.age.length || !member.state.values.age.trim().length ||
          member.state.validate.date_entry === false || member.state.validate.date_entry.length || !member.state.values.date_entry.trim().length ||
          member.state.validate.photo === false || member.state.validate.photo.length || !member.state.values.photo.trim().length
        }>
        Отправить
      </Button>

    </form>
  )
}

export default Member;
