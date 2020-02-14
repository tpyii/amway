import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

class Member extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        curator_id: '',
        members: [{
          id: 1,
          name: '',
          type: '',
          number: '',
        }],
        terms: '',
      },

      fields: {
        id: '',
        name: '',
        type: '',
        number: '',
      },

      id: 1,

      validate: {
        curator_id: '',
        members: [{
          id: 1,
          name: '',
          type: '',
          number: '',
        }],
        terms: '',
      },

      success: '',
    };
  }

  checkDisabledSubmit = () => {
    const curator = this.state.validate.curator_id === false || this.state.validate.curator_id.length || !this.state.values.curator_id.trim().length
           
    const member = this.state.validate.members.filter((member, i) => {
      if(member.name === false || member.name.length || !this.state.values.members[i].name.trim().length ||
         member.type === false || member.type.length || !this.state.values.members[i].type.trim().length)
          return member;

      if(this.state.values.members[i].type !== 'Незарегистрированный клиент') {
        if(member.number === false || member.number.length || !this.state.values.members[i].number.trim().length)
          return member;
      }

      return false;
     });

    const terms = this.state.validate.terms === false || this.state.validate.terms.length || this.state.values.terms !== true

    return curator || member.length || terms;
  }

  hundleAddMemberButton = () => {
    this.setState(state => ({
      id: ++state.id,
      values: {
        ...state.values,
        members: [
          ...state.values.members,
          {...state.fields, id: state.id},
        ],
      },
      validate: {
        ...state.validate,
        members: [
          ...state.validate.members,
          {...state.fields, id: state.id},
        ],
      }
    }));
  }

  hundleDeleteMemberButton = item => {
    const values_members = this.state.values.members.filter(member => (
      member.id !== item.id
    ))
    const validate_members = this.state.validate.members.filter(member => (
      member.id !== item.id
    ))
    this.setState({
      values: {
        ...this.state.values,
        members: values_members,
      },
      validate: {
        ...this.state.validate,
        members: validate_members,
      }
    });
  }

  checkValueValidation = event => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const name = event.target.name;
    let regexp;
    let validate;

    switch(name) {
      case 'curator_id':
        regexp = /^[0-9]+$/;
        validate = regexp.test(value.trim());
        break;

      case 'name':
        regexp = /^[А-Яа-яЁёa-zA-Z ]+$/;
        validate = regexp.test(value.trim());
        break;

      case 'type':
        validate = value.trim().length > 0;
        break;

      case 'number':
        regexp = /^[0-9]+$/;
        validate = regexp.test(value.trim());
        break;

      case 'terms':
        validate = value;
        break;
    }

    return validate;
  }

  hundleInputChange = (event, item) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const name = event.target.name;
    const validate = this.checkValueValidation(event);
    let values_curator_id = this.state.values.curator_id;
    let values_members = this.state.values.members;
    let values_terms = this.state.values.terms;
    let validate_curator_id = this.state.validate.curator_id;
    let validate_members = this.state.validate.members;
    let validate_terms = this.state.validate.terms;

    if(name === 'curator_id') {
      values_curator_id = value
      validate_curator_id = validate
    }

    if(item) {
      values_members = this.state.values.members.map(member => {
        if(member.id === item.id)
          return {...member, [name]: value}

        return member;
      })

      validate_members = this.state.validate.members.map(member => {
        if(member.id === item.id)
          return {...member, [name]: validate}

        return member;
      })
    }

    if(name === 'terms') {
      values_terms = value
      validate_terms = validate
    }

    this.setState({
      values: {
        ...this.state.values,
        curator_id: values_curator_id,
        members: values_members,
        terms: values_terms,
      },
      validate: {
        ...this.state.validate,
        curator_id: validate_curator_id,
        members: validate_members,
        terms: validate_terms,
      }
    });
  }

  hundleOnSubmit = event => {
    event.preventDefault();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.values)
    }

    fetch('/v1/members/', options)
      .then(response => response.json())
      .then(result => {
        if(result.error) {
          console.log(result.error);
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
          success: result.success
        })
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
      <p>Ваши участники зарегистрированы.</p>
    </div>
  )
}

function MemberForm({member}) {
  return (
    <>
      <h1>Участники</h1>
      <p>Уважаемые Партнеры!<br/>
         Для регистрации участников ваших марафонов введите, пожалуйста, необходимые данные.<br/>
         Обращаем ваше внимание, что поля, отмеченные звездочкой, обязательны к заполнению.</p>
    
      <form 
        noValidate
        onSubmit={event => member.hundleOnSubmit(event)}
      >

        <Form.Group controlId="curator_id">
          <Form.Label>Номер Куратора, присланный по почте *</Form.Label>
          <Form.Control 
            required
            type="number"
            name="curator_id"
            value={member.state.values.curator_id}
            onChange={member.hundleInputChange}
            isValid={member.state.validate.curator_id === true}
            isInvalid={member.state.validate.curator_id === false || member.state.validate.curator_id.length}
          />
          <Form.Control.Feedback type="invalid">
            {member.state.validate.curator_id.length ? member.state.validate.curator_id : 'Допустимы только цифры'}
          </Form.Control.Feedback>
        </Form.Group>

        {member.state.values.members.map((item, number) => (
          <Modal.Dialog 
            key={item.id}
            className="mw-100"
          >
            <Modal.Header 
              closeButton={number > 0}
              onHide={() => member.hundleDeleteMemberButton(item)}
            >
              Участник
            </Modal.Header>
            <Modal.Body>

              <Form.Group controlId="name">
                <Form.Label>Фамилия Имя Отчество участника *</Form.Label>
                <Form.Control 
                  required
                  type="text"
                  name="name"
                  value={item.name}
                  onChange={event => member.hundleInputChange(event, item)}
                  isValid={member.state.validate.members[number].name === true}
                  isInvalid={member.state.validate.members[number].name === false || member.state.validate.members[number].name.length}
                />
                <Form.Control.Feedback type="invalid">
                  {member.state.validate.members[number].name.length ? member.state.validate.members[number].name : 'Некорректно введены данные'}
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
                  onChange={event => member.hundleInputChange(event, item)}
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
                    onChange={event => member.hundleInputChange(event, item)}
                    isValid={member.state.validate.members[number].number === true}
                    isInvalid={member.state.validate.members[number].number === false || member.state.validate.members[number].number.length}
                  />
                  <Form.Control.Feedback type="invalid">
                    {member.state.validate.members[number].number.length ? member.state.validate.members[number].number : 'Допустимы только цифры'}
                  </Form.Control.Feedback>
                </Form.Group>
              )}

            </Modal.Body>
          </Modal.Dialog>
        ))}

        <Button 
          variant="primary"
          type="button"
          onClick={member.hundleAddMemberButton}
          className="mb-3"
        >
          Еще участник
        </Button>

        <Form.Group controlId="terms">
          <Form.Check
            required
            type="checkbox"
            name="terms"
            label="Настоящим я, даю согласие ООО &quot;Амвэй&quot; (г. Москва, ул. Верхняя Красносельская д.3, стр.2) на
            обработку моих персональных данных, указанных в настоящей анкете, а именно на сбор, запись,
            систематизацию, в автоматизированном формате для следующих дополнительных целей: ведение
            отчетности по активации «Лучший Куратор программы Body Detox».
            Мои персональные данные не будут более использоваться ООО &quot;Амвэй&quot; для указанных с настоящем
            согласии целей после их достижения. Во всем, что не указано в настоящем соглашении ООО &quot;Амвэй&quot;
            будет руководствоваться Положением об обработке персональных данных Независимых
            Предпринимателей Amway и Клиентов ООО &quot;Амвэй&quot;. Мое согласие может быть отозвано в любое
            время путем направления заявления на юридический адрес ООО &quot;Амвэй&quot;."
            onChange={member.hundleInputChange}
            isValid={member.state.validate.terms === true}
            isInvalid={member.state.validate.terms === false || member.state.validate.terms === 'Соглашение обязательно'}
          />
        </Form.Group>

        <Button 
          variant="primary"
          type="submit"
          disabled={member.checkDisabledSubmit()}
          className="mb-3"
        >
          Отправить
        </Button>

      </form>
    </>
  )
}

export default Member;
