import React from 'react';
import { Button, Form } from 'react-bootstrap';

class Member extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        curator: {
          curator_id: '',
          curator_email: '',
        },
        members: [{
          name: '',
          type: '',
          number: '',
        }]
      },

      fields: {
        name: '',
        type: '',
        number: '',
      },

      validate: {
        curator: {
          curator_id: '',
          curator_email: '',
        },
        members: [{
          name: '',
          type: '',
          number: '',
        }]
      },

      success: '',
    };
  }

  hundleAddMemberButton = () => {
    this.setState({
      values: {
        ...this.state.values,
        members: [
          ...this.state.values.members,
          {...this.state.fields},
        ],
      },
      validate: {
        ...this.state.validate,
        members: [
          ...this.state.validate.members,
          {...this.state.fields},
        ],
      }
    });
  }

  checkValueValidation = event => {
    let {name, value} = event.target;
    let regexp;
    let validate;

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
    }

    return validate;
  }

  hundleInputChange = event => {
    let {name, value} = event.target;
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

    fetch('/v1/members/', options)
      .then(response => response.json())
      .then(result => {
        if(result.error) {
          console.log(result.error);
          return;
        }

        // if(result.validate) {
        //   this.setState({
        //     validate : {
        //       ...this.state.validate,
        //       ...result.validate
        //     }
        //   })
        //   return;
        // }

        // this.setState({
        //   success: result.success
        // })
      });
  }

  render() {
    const { success } = this.state;
    return (
      <>
        {success === true ? 
          <Message /> :
          <MemberForm member={this} />}
      </>
    )
  }
}

function Message() {
  return (
    <div>
      <h3>Спасибо!</h3>
      <p>Ваше сообщение отправлено.</p>
    </div>
  )
}

function MemberForm({member}) {
  return (
    <>
      <h1>Участник</h1>
      <p>Уважаемые Партнеры!</p>
      <p>Для регистрации участников ваших марафонов введите, пожалуйста, необходимые данные.</p>
      <p>Обращаем ваше внимание, что поля, отмеченные звездочкой, обязательны к заполнению.</p>
    
      <form 
        noValidate
        onSubmit={event => member.hundleOnSubmit(event)}
      >

        <Form.Group controlId="curator_id">
          <Form.Label>Номер куратора, присланный по почте *</Form.Label>
          <Form.Control 
            required
            type="number"
            name="curator_id"
            value={member.state.values.curator.curator_id}
            onChange={member.hundleInputChange}
            isValid={member.state.validate.curator.curator_id === true}
            isInvalid={member.state.validate.curator.curator_id === false || member.state.validate.curator.curator_id.length}
          />
          <Form.Control.Feedback type="invalid">
            {member.state.validate.curator.curator_id.length ? member.state.validate.curator.curator_id : 'Допустимы только цифры'}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="curator_email">
          <Form.Label>Адрес электронной почты *</Form.Label>
          <Form.Control 
            required
            type="curator_email"
            name="email"
            value={member.state.values.curator.curator_email}
            onChange={member.hundleInputChange}
            isValid={member.state.validate.curator.curator_email === true}
            isInvalid={member.state.validate.curator.curator_email === false || member.state.validate.curator.curator_email.length}
          />
          <Form.Control.Feedback type="invalid">
            {member.state.validate.curator.curator_email.length ? member.state.validate.curator.curator_email : 'Некорректный адрес электронной почты'}
          </Form.Control.Feedback>
        </Form.Group>

        <h4>Участники</h4>

        {member.state.values.members.map((item, number) => (
          <>
            <Form.Group controlId="name">
            <Form.Label>Фамилия Имя Отчество участника *</Form.Label>
            <Form.Control 
              required
              type="text"
              name="name"
              value={item.name}
              onChange={member.hundleInputChange}
              isValid={member.state.validate.members[number].name === true}
              isInvalid={member.state.validate.members[number].name === false || member.state.validate.members[number].name.length}
            />
            <Form.Control.Feedback type="invalid">
              {member.state.validate.members[number].name.length ? member.state.validate.members[number].name : 'Допустимы только кириллические буквы и пробел'}
            </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="type">
            <Form.Label>Тип Участника *</Form.Label>
            <Form.Control 
              as="select"
              required
              type="text"
              name="type"
              value={item.type}
              onChange={member.hundleInputChange}
              isValid={member.state.validate.members[number].type === true}
              isInvalid={member.state.validate.members[number].type === false || member.state.validate.members[number].type.length}
            >
              <option></option>
              <option>Незарегистрированный клиент</option>
              <option>Зарегистрированный клиент</option>
              <option>Партнер</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
                {member.state.validate.members[number].type.length ? member.state.validate.members[number].type : 'Выберите значение из списка'}
              </Form.Control.Feedback>
            </Form.Group>

            {item.type !== 'Незарегистрированный клиент' && item.type !== '' && (
            <Form.Group controlId="number">
              <Form.Label>Номер (для Зарегистрированного клиента и Партнера) *</Form.Label>
              <Form.Control 
                type="number"
                name="number"
                value={item.number}
                onChange={member.hundleInputChange}
                isValid={member.state.validate.members[number].number === true}
                isInvalid={member.state.validate.members[number].number === false || member.state.validate.members[number].number.length}
              />
              <Form.Control.Feedback type="invalid">
                {member.state.validate.members[number].number.length ? member.state.validate.members[number].number : 'Допустимы только цифры'}
              </Form.Control.Feedback>
            </Form.Group>
            )}
          </>
        ))}

        <Button 
          variant="primary"
          type="button"
          onClick={member.hundleAddMemberButton}>
          Еще участник
        </Button>

        <Button 
          variant="primary"
          type="submit"
          // disabled={
          //   member.state.validate.name === false || member.state.validate.name.length || !member.state.values.name.trim().length ||
          //   member.state.validate.type === false || member.state.validate.type.length || !member.state.values.type.trim().length ||
          //   member.state.validate.number === false
          // }
        >
          Отправить
        </Button>

      </form>
    </>
  )
}

export default Member;
