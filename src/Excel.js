import React from "react";
import { Spinner, Button, Form, Modal } from 'react-bootstrap';
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Excel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      curators: [],
      members: [],

      auth: false,

      values: {
        login: '',
        password: '',
      },

      validate: {
        login: '',
        password: '',
      }
    }
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

  hundleInputChange = event => {
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

  checkDisabledSubmit = () => {
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
            curators: result
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
            members: result
          })
          return;
        }
      });
  }

  render() {
    return (
      <>
        {this.state.auth === false ?
          <Auth excel={this} /> :
          !this.state.curators.length || !this.state.members.length ? 
            <Loading /> :
            <Download excel={this}/>}
      </>
    )
  }
}

function Auth({excel}) {
  return (
    <form 
      noValidate
      onSubmit={event => excel.hundleOnSubmit(event)}
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
              value={excel.state.values.login}
              onChange={excel.hundleInputChange}
              isInvalid={excel.state.validate.login === false || excel.state.validate.login.length}
            />
            <Form.Control.Feedback type="invalid">
              {excel.state.validate.login.length ? excel.state.validate.login : 'Некорректно введены данные'}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              required
              type="password"
              name="password"
              value={excel.state.values.password}
              onChange={excel.hundleInputChange}
              isInvalid={excel.state.validate.password === false || excel.state.validate.password.length}
            />
            <Form.Control.Feedback type="invalid">
              {excel.state.validate.password.length ? excel.state.validate.password : 'Некорректно введены данные'}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
          
        <Modal.Footer>
          <Button 
            variant="primary"
            type="submit"
            disabled={excel.checkDisabledSubmit()}
            className="mb-3"
          >
            Отправить
          </Button>
        </Modal.Footer>
      </Modal.Dialog>

    </form>
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

function Download({excel}) {
  return (
    <ExcelFile hideElement>
      <ExcelSheet data={excel.state.curators} name="Кураторы">
        <ExcelColumn label="Номер Куратора" value="id"/>
        <ExcelColumn label="ФИО" value="name"/>
        <ExcelColumn label="Номер Партнера" value="partner"/>
        <ExcelColumn label="Адрес Эл. почты" value="email"/>
        <ExcelColumn label="Номер телефона" value="phone"/>
        <ExcelColumn label="Адрес Инстаграм" value="instagram"/>
        <ExcelColumn label="Регион" value="region"/>
        <ExcelColumn label="Структура" value="structure"/>
      </ExcelSheet>
      <ExcelSheet data={excel.state.members} name="Участники">
        <ExcelColumn label="Номер Куратора" value="curator_id"/>
        <ExcelColumn label="ФИО" value="name"/>
        <ExcelColumn label="Тип" value="type"/>
        <ExcelColumn label="Номер" value={col => col.number !== "0" ? col.number : ""}/>
      </ExcelSheet>
    </ExcelFile>
  );
}

export default Excel;
