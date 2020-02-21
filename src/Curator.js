import React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';

class Curator extends React.Component {
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
        terms: '',
      },

      validate: {
        name: '',
        partner: '',
        email: '',
        phone: '',
        instagram: '',
        region: '',
        structure: '',
        terms: '',
      },

      success: false,

      id: '',
    };
  }

  checkDisabledSubmit = () => {
    return  this.state.validate.name === false || this.state.validate.name.length || !this.state.values.name.trim().length ||
            this.state.validate.partner === false || this.state.validate.partner.length || !this.state.values.partner.trim().length ||
            this.state.validate.email === false || this.state.validate.email.length || !this.state.values.email.trim().length ||
            this.state.validate.phone === false || this.state.validate.phone.length || !this.state.values.phone.trim().length ||
            this.state.validate.instagram === false || this.state.validate.instagram.length || !this.state.values.instagram.trim().length ||
            this.state.validate.region === false || this.state.validate.region.length || !this.state.values.region.trim().length ||
            this.state.validate.structure === false ||
            this.state.validate.terms === false || this.state.validate.terms.length || this.state.values.terms !== true
  }

  checkValueValidation = event => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const name = event.target.name;
    let regexp;
    let validate;

    switch(name) {
      case 'name':
        regexp = /^[А-Яа-яЁёa-zA-Z ]+$/;
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

      case 'phone':
        regexp = /^[0-9]+$/;
        validate = regexp.test(value.trim());
        break;

      case 'instagram':
        regexp = /^[A-Za-z0-9._]+$/;
        validate = regexp.test(value.trim());
        break;

      case 'region':
        validate = value.trim().length > 0;
        break;

      case 'structure':
        validate = value.trim().length ? 
                    value.trim().length > 0 :
                    '';
        break;

      case 'terms':
        validate = value;
        break;
    }

    return validate;
  }

  hundleInputChange = event => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const name = event.target.name;
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.values)
    }

    fetch('/v1/curators', options)
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
          success: result.success,
          id: result.id,
        })
      });
  }

  render() {
    const { success, id } = this.state;
    return (
      <>
        {success === true ? 
          <Message id={id} /> :
          <CuratorForm curator={this} />}
      </>
    )
  }
}

function Message({id}) {
  return (
    <>
      <h3>Спасибо!</h3>
      <p>Вы зарегистрированы!<br/>
        Ваш номер Куратора {id}.</p>
      <p>Ссылка для добавление участников:<br/>
      <a href="promo.nutrilitebodydetox.ru/members">promo.nutrilitebodydetox.ru/members</a></p>
      <p>На Вашу почту отправлен номер Куратора и ссылка на регистрацию участников.</p>
    </>
  )
}

function CuratorForm({curator}) {
  return (
    <>
      <h1>Куратор</h1>
      <p>Уважаемые Партнеры!<br/>
         Для регистрации в активации «Лучший Куратор программы Body Detox» введите, пожалуйста, ваши данные.<br/>
         Обращаем ваше внимание, что поля, отмеченные звездочкой, обязательны к заполнению.</p>
      <p>Внимание! Адрес электронной почты должен быть действующим, так как после отправки данных, вам на почту придет Номер Куратора и Ссылка на заполнение участников вашего марафона.</p>

      <form 
        noValidate
        onSubmit={event => curator.hundleOnSubmit(event)}
      >

        <Form.Group controlId="name">
          <Form.Label>Фамилия Имя Отчество *</Form.Label>
          <Form.Control 
            required
            type="text"
            name="name"
            value={curator.state.values.name}
            onChange={curator.hundleInputChange}
            isValid={curator.state.validate.name === true}
            isInvalid={curator.state.validate.name === false || curator.state.validate.name.length}
          />
          <Form.Control.Feedback type="invalid">
            {curator.state.validate.name.length ? curator.state.validate.name : 'Некорректно введены данные'}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="partner">
          <Form.Label>Ваш номер Партнера *</Form.Label>
          <Form.Control 
            required
            type="number"
            name="partner"
            value={curator.state.values.partner}
            onChange={curator.hundleInputChange}
            isValid={curator.state.validate.partner === true}
            isInvalid={curator.state.validate.partner === false || curator.state.validate.partner.length}
          />
          <Form.Control.Feedback type="invalid">
            {curator.state.validate.partner.length ? curator.state.validate.partner : 'Допустимы только цифры'}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Адрес электронной почты *</Form.Label>
          <Form.Control 
            required
            type="email"
            name="email"
            value={curator.state.values.email}
            onChange={curator.hundleInputChange}
            isValid={curator.state.validate.email === true}
            isInvalid={curator.state.validate.email === false || curator.state.validate.email.length}
          />
          <Form.Control.Feedback type="invalid">
            {curator.state.validate.email.length ? curator.state.validate.email : 'Некорректный адрес электронной почты'}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="phone">
          <Form.Label>Номер вашего телефона *</Form.Label>
          <Form.Control 
            required
            type="number"
            name="phone"
            value={curator.state.values.phone}
            onChange={curator.hundleInputChange}
            isValid={curator.state.validate.phone === true}
            isInvalid={curator.state.validate.phone === false || curator.state.validate.phone.length}
          />
          <Form.Control.Feedback type="invalid">
            {curator.state.validate.phone.length ? curator.state.validate.phone : 'Допустимы только цифры'}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="instagram">
          <Form.Label>Ваш адрес в Инстаграм *</Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>@</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control 
              required
              type="text"
              name="instagram"
              placeholder="amway"
              value={curator.state.values.instagram}
              onChange={curator.hundleInputChange}
              isValid={curator.state.validate.instagram === true}
              isInvalid={curator.state.validate.instagram === false || curator.state.validate.instagram.length}
            />
            <Form.Control.Feedback type="invalid">
              {curator.state.validate.instagram.length ? curator.state.validate.instagram : 'Допустимы только латинские буквы, цыфры и знаки . и _'}
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
            value={curator.state.values.region}
            onChange={curator.hundleInputChange}
            isValid={curator.state.validate.region === true}
            isInvalid={curator.state.validate.region === false || curator.state.validate.region.length}
          >
            <option></option>
            <option>Юг</option>
            <option>Центр</option>
            <option>Урал</option>
            <option>Сибирь и Дальний Восток</option>
            <option>Казахстан</option>
          </Form.Control>
          <Form.Control.Feedback type="invalid">
              {curator.state.validate.region.length ? curator.state.validate.region : 'Выберите значение из списка'}
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="structure">
          <Form.Label>Выберите Вашу обучающую систему</Form.Label>
          <Form.Control 
            as="select"
            type="text"
            name="structure"
            value={curator.state.values.structure}
            onChange={curator.hundleInputChange}
            isValid={curator.state.validate.structure === true}
            isInvalid={curator.state.validate.structure === false || curator.state.validate.structure.length}
          >
            <option></option>
            <option>Alga Diamond</option>
            <option>Diamond Alliance</option>
            <option>Network21</option>
            <option>Sodruzhestvo</option>
            <option>Yager</option>
            <option>Без обучающей системы</option>
          </Form.Control>
          <Form.Control.Feedback type="invalid">
              {curator.state.validate.structure.length ? curator.state.validate.structure : 'Выберите значение из списка'}
            </Form.Control.Feedback>
        </Form.Group>

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
            onChange={curator.hundleInputChange}
            isValid={curator.state.validate.terms === true}
            isInvalid={curator.state.validate.terms === false || curator.state.validate.terms === 'Соглашение обязательно'}
          />
        </Form.Group>

        <Button 
          variant="primary"
          type="submit"
          disabled={curator.checkDisabledSubmit()}
          className="mb-3"
        >
          Отправить
        </Button>

      </form>
    </>
  )
}

export default Curator;
