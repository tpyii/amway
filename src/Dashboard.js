import React from "react";
import { Spinner, Button, Form, Modal, Table, Tab, Row, Col, Nav, InputGroup } from 'react-bootstrap';
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      curators: [],
      members: [],

      auth: false,

      fetchCurators: false,
      fetchMembers: false,

      values: {
        login: '',
        password: '',
      },

      validate: {
        login: '',
        password: '',
      },

      curator: {
        name: '',
        partner: '',
        email: '',
        phone: '',
        instagram: '',
        region: '',
        structure: '',
      },

      member: {
        curator_id: '',
        name: '',
        type: '',
        number: '',
      },

      modalCuratorShow: false,
      modalMemberShow: false,

      modalCuratorValues: {
        name: '',
        partner: '',
        email: '',
        phone: '',
        instagram: '',
        region: '',
        structure: '',
      },
      modalMemberValues: {
        curator_id: '',
        name: '',
        type: '',
        number: '',
      },

      modalCuratorValidate: {
        name: '',
        partner: '',
        email: '',
        phone: '',
        instagram: '',
        region: '',
        structure: '',
      },
      modalMemberValidate: {
        curator_id: '',
        name: '',
        type: '',
        number: '',
      }
    }
  }

  hundleOnSubmitAuth = event => {
    event.preventDefault();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.values)
    }

    fetch('/v1/auth', options)
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
          auth: result.success
        })

        this.fetchData();
      });
  }

  hundleOnSubmitCurator = event => {
    event.preventDefault();
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.modalCuratorValues)
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
            modalCuratorValidate : {
              ...this.state.modalCuratorValidate,
              ...result.validate
            }
          })
          return;
        }

        if(result.success) {
          const newCurators = this.state.curators.map(curator => {
            if(curator.id === this.state.modalCuratorValues.id)
              curator = this.state.modalCuratorValues

            return curator;
          })

          this.setState({
            curators: newCurators
          })

          this.handleToggleModal('curator', false);
        }
      });
  }

  hundleOnSubmitMember = event => {
    event.preventDefault();
    const body = this.state.modalMemberValues.type !== 'Незарегистрированный клиент' ? 
                                                        this.state.modalMemberValues :
                                                        {...this.state.modalMemberValues, number: ''}
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    }

    fetch('/v1/members', options)
      .then(response => response.json())
      .then(result => {
        if(result.error) {
          console.log(result.error);
          return;
        }

        if(result.validate) {
          this.setState({
            modalMemberValidate : {
              ...this.state.modalMemberValidate,
              ...result.validate
            }
          })
          return;
        }

        if(result.success) {
          const newMembers = this.state.members.map(member => {
            if(member.id === this.state.modalMemberValues.id)
              member = this.state.modalMemberValues

            return member;
          })

          this.setState({
            members: newMembers
          })

          this.handleToggleModal('member', false);
        }
      });
  }

  hundleInputChangeModalAuth = event => {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      values: {
        ...this.state.values,
        [name]: value
      },
      validate: {
        login: '',
        password: '',
      }
    });
  }

  hundleInputChangeModalCurator = event => {
    const value = event.target.value;
    const name = event.target.name;
    const validate = this.checkValueValidation(event);

    this.setState({
      modalCuratorValues: {
        ...this.state.modalCuratorValues,
        [name]: value
      },
      modalCuratorValidate: {
        ...this.state.modalCuratorValidate,
        [name]: validate
      }
    });
  }

  hundleInputChangeModalMember = event => {
    const value = event.target.value;
    const name = event.target.name;
    const validate = this.checkValueValidation(event);

    this.setState({
      modalMemberValues: {
        ...this.state.modalMemberValues,
        [name]: value
      },
      modalMemberValidate: {
        ...this.state.modalMemberValidate,
        [name]: validate
      }
    });
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

      case 'curator_id':
        regexp = /^[0-9]+$/;
        validate = regexp.test(value.trim());
        break;

      case 'type':
        validate = value.trim().length > 0;
        break;

      case 'number':
        regexp = /^[0-9]+$/;
        validate = regexp.test(value.trim());
        break;
    }

    return validate;
  }

  checkDisabledSubmitCurator = () => {
    return  this.state.modalCuratorValidate.name === false || this.state.modalCuratorValidate.name.length || !this.state.modalCuratorValues.name.trim().length ||
            this.state.modalCuratorValidate.partner === false || this.state.modalCuratorValidate.partner.length || !this.state.modalCuratorValues.partner.trim().length ||
            this.state.modalCuratorValidate.email === false || this.state.modalCuratorValidate.email.length || !this.state.modalCuratorValues.email.trim().length ||
            this.state.modalCuratorValidate.phone === false || this.state.modalCuratorValidate.phone.length || !this.state.modalCuratorValues.phone.trim().length ||
            this.state.modalCuratorValidate.instagram === false || this.state.modalCuratorValidate.instagram.length || !this.state.modalCuratorValues.instagram.trim().length ||
            this.state.modalCuratorValidate.region === false || this.state.modalCuratorValidate.region.length || !this.state.modalCuratorValues.region.trim().length ||
            this.state.modalCuratorValidate.structure === false
  }

  checkDisabledSubmitMember = () => {
    const curator = this.state.modalMemberValidate.curator_id === false || this.state.modalMemberValidate.curator_id.length || !this.state.modalMemberValues.curator_id.trim().length
           
    let member = false;

    if(this.state.modalMemberValidate.name === false || this.state.modalMemberValidate.name.length || !this.state.modalMemberValues.name.trim().length ||
        this.state.modalMemberValidate.type === false || this.state.modalMemberValidate.type.length || !this.state.modalMemberValues.type.trim().length)
        member = true;

    if(this.state.modalMemberValues.type !== 'Незарегистрированный клиент') {
      if(this.state.modalMemberValidate.number === false || this.state.modalMemberValidate.number.length || !this.state.modalMemberValues.number.trim().length)
        member = true;
    }

    return curator || member;
  }

  checkDisabledSubmitAuth = () => {
    return !this.state.values.login.trim().length ||
           !this.state.values.password.trim().length
  }

  fetchData = () => {
    fetch('/v1/curators/excel/download')
      .then(response => response.json())
      .then(result => {
        if(result.error) {
          console.log(result.error);
          return;
        }
              
        else {
          this.setState({
            curators: result,
            fetchCurators: true
          })
          return;
        }
      });

    fetch('/v1/members/excel/download')
      .then(response => response.json())
      .then(result => {
        if(result.error) {
          console.log(result.error);
          return;
        }
              
        else {
          this.setState({
            members: result,
            fetchMembers: true
          })
          return;
        }
      });
  }

  handleToggleModal = (name, show, data) => {
    this.setState({
      [`modal${name[0].toUpperCase()}${name.slice(1)}Show`] : show,
      [`modal${name[0].toUpperCase()}${name.slice(1)}Values`] : data || this.state[name],
      [`modal${name[0].toUpperCase()}${name.slice(1)}Validate`] : this.state[name]
    })
  }

  render() {
    return (
      <>
        {this.state.auth === false ?
          <Auth dashboard={this} /> :
          !this.state.fetchCurators || !this.state.fetchMembers ? 
            <Loading /> :
            <Body dashboard={this} />
        }
      </>
    )
  }
}

function Auth({dashboard}) {
  return (
    <form 
      noValidate
      onSubmit={event => dashboard.hundleOnSubmitAuth(event)}
    >

      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Авторизация</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group controlId="login">
            <Form.Label>Login</Form.Label>
            <Form.Control 
              required
              type="text"
              name="login"
              value={dashboard.state.values.login}
              onChange={dashboard.hundleInputChangeModalAuth}
              isInvalid={dashboard.state.validate.login === false || dashboard.state.validate.login.length}
            />
            <Form.Control.Feedback type="invalid">
              {dashboard.state.validate.login.length ? dashboard.state.validate.login : 'Некорректно введены данные'}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              required
              type="password"
              name="password"
              value={dashboard.state.values.password}
              onChange={dashboard.hundleInputChangeModalAuth}
              isInvalid={dashboard.state.validate.password === false || dashboard.state.validate.password.length}
            />
            <Form.Control.Feedback type="invalid">
              {dashboard.state.validate.password.length ? dashboard.state.validate.password : 'Некорректно введены данные'}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
          
        <Modal.Footer>
          <Button 
            variant="primary"
            type="submit"
            disabled={dashboard.checkDisabledSubmitAuth()}
            className="mb-3"
          >
            Отправить
          </Button>
        </Modal.Footer>
      </Modal.Dialog>

    </form>
  )
}

function Body({dashboard}) {
  return (
    <>
      <ControlledTabs dashboard={dashboard} />
      <ModalCurators dashboard={dashboard} />
      <ModalMembers dashboard={dashboard} />
    </>
  )
}

function ControlledTabs({dashboard}) {
  return (
    <Tab.Container defaultActiveKey="curators">
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="curators">Кураторы</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="members">Участники</Nav.Link>
            </Nav.Item>
          </Nav>

          <Download dashboard={dashboard} />
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="curators">
              <TableCurators dashboard={dashboard} />
            </Tab.Pane>
            <Tab.Pane eventKey="members">
              <TableMembers dashboard={dashboard} />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  )
}

function TableCurators({dashboard}) {
  const tbody = dashboard.state.curators.map(curator => (
    <tr key={curator.id} onClick={() => dashboard.handleToggleModal('curator', true, curator)}>
      <td>{curator.id}</td>
      <td>{curator.name}</td>
      <td>{curator.partner}</td>
      <td>{curator.email}</td>
      <td>{curator.phone}</td>
      <td>{curator.instagram}</td>
      <td>{curator.region}</td>
      <td>{curator.structure}</td>
    </tr>
  ))

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Фамилия Имя Отчество</th>
          <th>Номер Партнера</th>
          <th>Адрес электронной почты</th>
          <th>Номер телефона</th>
          <th>Адрес в Инстаграм</th>
          <th>Регион</th>
          <th>Обучающая система</th>
        </tr>
      </thead>
      <tbody>
        {tbody.length ? tbody : ''}
      </tbody>
    </Table>
  )
}

function TableMembers({dashboard}) {
  const tbody = dashboard.state.members.map(member => (
    <tr key={member.id} onClick={() => dashboard.handleToggleModal('member', true, member)}>
      <td>{member.id}</td>
      <td>{member.curator_id}</td>
      <td>{member.name}</td>
      <td>{member.type}</td>
      <td>{member.number}</td>
    </tr>
  ))

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Номер Куратора</th>
          <th>Фамилия Имя Отчество</th>
          <th>Тип Участника</th>
          <th>Номер</th>
        </tr>
      </thead>
      <tbody>
        {tbody.length ? tbody : ''}
      </tbody>
    </Table>
  )
}

function ModalCurators({dashboard}) {
  return (
    <Modal show={dashboard.state.modalCuratorShow} onHide={() => dashboard.handleToggleModal('curator', false)}>
      <Modal.Header closeButton>
        <Modal.Title>Куратор</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <form 
          noValidate
          onSubmit={dashboard.hundleOnSubmitCurator}
        >
          <Form.Group controlId="name">
            <Form.Label>Фамилия Имя Отчество *</Form.Label>
            <Form.Control 
              required
              type="text"
              name="name"
              value={dashboard.state.modalCuratorValues.name}
              onChange={dashboard.hundleInputChangeModalCurator}
              isValid={dashboard.state.modalCuratorValidate.name === true}
              isInvalid={dashboard.state.modalCuratorValidate.name === false || dashboard.state.modalCuratorValidate.name.length}
            />
            <Form.Control.Feedback type="invalid">
              {dashboard.state.modalCuratorValidate.name.length ? dashboard.state.modalCuratorValidate.name : 'Некорректно введены данные'}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="partner">
            <Form.Label>Ваш номер Партнера *</Form.Label>
            <Form.Control 
              required
              type="number"
              name="partner"
              value={dashboard.state.modalCuratorValues.partner}
              onChange={dashboard.hundleInputChangeModalCurator}
              isValid={dashboard.state.modalCuratorValidate.partner === true}
              isInvalid={dashboard.state.modalCuratorValidate.partner === false || dashboard.state.modalCuratorValidate.partner.length}
            />
            <Form.Control.Feedback type="invalid">
              {dashboard.state.modalCuratorValidate.partner.length ? dashboard.state.modalCuratorValidate.partner : 'Допустимы только цифры'}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Адрес электронной почты *</Form.Label>
            <Form.Control 
              required
              type="email"
              name="email"
              value={dashboard.state.modalCuratorValues.email}
              onChange={dashboard.hundleInputChangeModalCurator}
              isValid={dashboard.state.modalCuratorValidate.email === true}
              isInvalid={dashboard.state.modalCuratorValidate.email === false || dashboard.state.modalCuratorValidate.email.length}
            />
            <Form.Control.Feedback type="invalid">
              {dashboard.state.modalCuratorValidate.email.length ? dashboard.state.modalCuratorValidate.email : 'Некорректный адрес электронной почты'}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="phone">
            <Form.Label>Номер вашего телефона *</Form.Label>
            <Form.Control 
              required
              type="number"
              name="phone"
              value={dashboard.state.modalCuratorValues.phone}
              onChange={dashboard.hundleInputChangeModalCurator}
              isValid={dashboard.state.modalCuratorValidate.phone === true}
              isInvalid={dashboard.state.modalCuratorValidate.phone === false || dashboard.state.modalCuratorValidate.phone.length}
            />
            <Form.Control.Feedback type="invalid">
              {dashboard.state.modalCuratorValidate.phone.length ? dashboard.state.modalCuratorValidate.phone : 'Допустимы только цифры'}
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
                value={dashboard.state.modalCuratorValues.instagram}
                onChange={dashboard.hundleInputChangeModalCurator}
                isValid={dashboard.state.modalCuratorValidate.instagram === true}
                isInvalid={dashboard.state.modalCuratorValidate.instagram === false || dashboard.state.modalCuratorValidate.instagram.length}
              />
              <Form.Control.Feedback type="invalid">
                {dashboard.state.modalCuratorValidate.instagram.length ? dashboard.state.modalCuratorValidate.instagram : 'Допустимы только латинские буквы, цыфры и знаки . и _'}
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
              value={dashboard.state.modalCuratorValues.region}
              onChange={dashboard.hundleInputChangeModalCurator}
              isValid={dashboard.state.modalCuratorValidate.region === true}
              isInvalid={dashboard.state.modalCuratorValidate.region === false || dashboard.state.modalCuratorValidate.region.length}
            >
              <option></option>
              <option>Юг</option>
              <option>Центр</option>
              <option>Урал</option>
              <option>Сибирь и Дальний Восток</option>
              <option>Казахстан</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
                {dashboard.state.modalCuratorValidate.region.length ? dashboard.state.modalCuratorValidate.region : 'Выберите значение из списка'}
              </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="structure">
            <Form.Label>Выберите Вашу обучающую систему</Form.Label>
            <Form.Control 
              as="select"
              type="text"
              name="structure"
              value={dashboard.state.modalCuratorValues.structure}
              onChange={dashboard.hundleInputChangeModalCurator}
              isValid={dashboard.state.modalCuratorValidate.structure === true}
              isInvalid={dashboard.state.modalCuratorValidate.structure === false || dashboard.state.modalCuratorValidate.structure.length}
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
                {dashboard.state.modalCuratorValidate.structure.length ? dashboard.state.modalCuratorValidate.structure : 'Выберите значение из списка'}
              </Form.Control.Feedback>
          </Form.Group>
        </form>

      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={() => dashboard.handleToggleModal('curator', false)}
        >
          Отмена
        </Button>
        <Button 
          variant="primary" 
          onClick={dashboard.hundleOnSubmitCurator}
          disabled={dashboard.checkDisabledSubmitCurator()}
        >
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

function ModalMembers({dashboard}) {
  return (
    <Modal show={dashboard.state.modalMemberShow} onHide={() => dashboard.handleToggleModal('member', false)}>
      <Modal.Header closeButton>
        <Modal.Title>Участник</Modal.Title>
      </Modal.Header>
      <Modal.Body>

      <form 
        noValidate
        onSubmit={dashboard.hundleOnSubmitMember}
      >

        <Form.Group controlId="curator_id">
          <Form.Label>Номер Куратора, присланный по почте *</Form.Label>
          <Form.Control 
            required
            type="number"
            name="curator_id"
            value={dashboard.state.modalMemberValues.curator_id}
            onChange={dashboard.hundleInputChangeModalMember}
            isValid={dashboard.state.modalMemberValidate.curator_id === true}
            isInvalid={dashboard.state.modalMemberValidate.curator_id === false || dashboard.state.modalMemberValidate.curator_id.length}
          />
          <Form.Control.Feedback type="invalid">
            {dashboard.state.modalMemberValidate.curator_id.length ? dashboard.state.modalMemberValidate.curator_id : 'Допустимы только цифры'}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="name">
          <Form.Label>Фамилия Имя Отчество участника *</Form.Label>
          <Form.Control 
            required
            type="text"
            name="name"
            value={dashboard.state.modalMemberValues.name}
            onChange={dashboard.hundleInputChangeModalMember}
            isValid={dashboard.state.modalMemberValidate.name === true}
            isInvalid={dashboard.state.modalMemberValidate.name === false || dashboard.state.modalMemberValidate.name.length}
          />
          <Form.Control.Feedback type="invalid">
            {dashboard.state.modalMemberValidate.name.length ? dashboard.state.modalMemberValidate.name : 'Некорректно введены данные'}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="type">
          <Form.Label>Тип Участника *</Form.Label>
          <Form.Control 
            as="select"
            required
            type="text"
            name="type"
            value={dashboard.state.modalMemberValues.type}
            onChange={dashboard.hundleInputChangeModalMember}
            isValid={dashboard.state.modalMemberValidate.type === true}
            isInvalid={dashboard.state.modalMemberValidate.type === false || dashboard.state.modalMemberValidate.type.length}
          >
            <option></option>
            <option>Незарегистрированный клиент</option>
            <option>Зарегистрированный клиент</option>
            <option>Партнер</option>
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {dashboard.state.modalMemberValidate.type.length ? dashboard.state.modalMemberValidate.type : 'Выберите значение из списка'}
          </Form.Control.Feedback>
        </Form.Group>

        {dashboard.state.modalMemberValues.type !== 'Незарегистрированный клиент' && dashboard.state.modalMemberValues.type !== '' && (
          <Form.Group controlId="number">
            <Form.Label>Номер (для Зарегистрированного клиента и Партнера) *</Form.Label>
            <Form.Control 
              type="number"
              name="number"
              value={dashboard.state.modalMemberValues.number}
              onChange={dashboard.hundleInputChangeModalMember}
              isValid={dashboard.state.modalMemberValidate.number === true}
              isInvalid={dashboard.state.modalMemberValidate.number === false || dashboard.state.modalMemberValidate.number.length}
            />
            <Form.Control.Feedback type="invalid">
              {dashboard.state.modalMemberValidate.number.length ? dashboard.state.modalMemberValidate.number : 'Допустимы только цифры'}
            </Form.Control.Feedback>
          </Form.Group>
        )}

      </form>

      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={() => dashboard.handleToggleModal('member', false)}
        >
          Отмена
        </Button>
        <Button 
          variant="primary" 
          onClick={dashboard.hundleOnSubmitMember}
          disabled={dashboard.checkDisabledSubmitMember()}
        >
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

function Loading() {
  return (
    <div className="align-items-center d-flex justify-content-center vh-100">
      <Spinner 
        animation="border" 
        variant="primary" />
    </div>
  )
}

function DownloadButton() {
  return (
    <Button 
      variant="outline-success"
      type="submit"
      block
      className={'text-left'}
    >
      Скачать xlsx
    </Button>
  )
}

function Download({dashboard}) {
  return (
    <ExcelFile element={<DownloadButton />}>
      <ExcelSheet data={dashboard.state.curators} name="Кураторы">
        <ExcelColumn label="Номер Куратора" value="id"/>
        <ExcelColumn label="ФИО" value="name"/>
        <ExcelColumn label="Номер Партнера" value="partner"/>
        <ExcelColumn label="Адрес Эл. почты" value="email"/>
        <ExcelColumn label="Номер телефона" value="phone"/>
        <ExcelColumn label="Адрес Инстаграм" value="instagram"/>
        <ExcelColumn label="Регион" value="region"/>
        <ExcelColumn label="Структура" value="structure"/>
      </ExcelSheet>
      <ExcelSheet data={dashboard.state.members} name="Участники">
        <ExcelColumn label="Номер Куратора" value="curator_id"/>
        <ExcelColumn label="ФИО" value="name"/>
        <ExcelColumn label="Тип" value="type"/>
        <ExcelColumn label="Номер" value={col => col.number !== "0" ? col.number : ""}/>
      </ExcelSheet>
    </ExcelFile>
  );
}

export default Dashboard;
