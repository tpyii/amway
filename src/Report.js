import React from 'react';
import { Button, Form } from 'react-bootstrap';

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        date_end: '',
        weight_after: '',
        photo_after: '',
        other_photos: '',
      },

      validate: {
        date_end: '',
        weight_after: '',
        photo_after: '',
        other_photos: '',
      },

      messages: {
        errors: [],
        success: []
      }
    };
  }

  componentDidMount() {
    const { curatorId, memberId } = this.props.match.params;

    fetch(`/app/v1/curators/id/${curatorId}`)
      .then(response => response.json())
      .then(result => {
        if(result.errors)
          window.location.pathname = '/app';
      });

    fetch(`/app/v1/members/id/${memberId}`)
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
      value = event.target.files.length > 1 ? event.target.files : event.target.files.length === 1 ? event.target.files[0] : false;

    switch(name) {
      case 'date_end':
        regexp = /^((19|2[0-9])[0-9]{2})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])+$/;
        validate = regexp.test(value.trim());
        break;

      case 'weight_after':
        regexp = /^[0-9]+$/;
        validate = regexp.test(value.trim());
        break;

      case 'photo_after':
        regexp = /^(image\/)+(jpeg|jpg|png)+$/;
        validate = value ? (value.size <= 2097152 && regexp.test(value.type)) : false;
        break;

      case 'other_photos':
        regexp = /^(image\/)+(jpeg|jpg|png)+$/;
        if(value.length) {
          for(let i = 0; i < value.length; i++) {
            validate = value[i].size <= 2097152 && regexp.test(value[i].type);
            if(validate === false)
              break;
          }
        } else if(value)
            validate = value ? (value.size <= 2097152 && regexp.test(value.type)) : false;
          else
            validate = '';
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

    const { memberId } = this.props.match.params;

    fetch(`/app/v1/reports/id/${memberId}`, options)
      .then(response => response.json())
      .then(result => {
        // if(result.errors) {
        //   console.log(result.errors);
        //   return;
        // }

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
        //   messages : {
        //     ...this.state.messages,
        //     success: [...result.success]
        //   }
        // })
      });
  }

  render() {
    const { success } = this.state.messages;
    return (
      <>
        <h1>Отчет</h1>
        {success.length ? 
          <Message message={success[0]} /> :
          <ReportForm report={this} />}
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

function ReportForm({report}) { 
  return (
    <form 
      noValidate
      onSubmit={event => report.hundleOnSubmit(event)}
    >
      
      <Form.Group controlId="date_end">
        <Form.Label>Дата окончания программы *</Form.Label>
        <Form.Control 
          required
          type="date"
          name="date_end"
          value={report.state.values.date_end}
          onChange={report.hundleInputChange}
          isValid={report.state.validate.date_end === true}
          isInvalid={report.state.validate.date_end === false || report.state.validate.date_end.length}
        />
        <Form.Control.Feedback type="invalid">
          {report.state.validate.date_end.length ? report.state.validate.date_end : 'Не корректно указана дата'}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="weight_after">
        <Form.Label>Вес участника в кг после программы *</Form.Label>
        <Form.Control 
          required
          type="number"
          name="weight_after"
          value={report.state.values.weight_after}
          onChange={report.hundleInputChange}
          isValid={report.state.validate.weight_after === true}
          isInvalid={report.state.validate.weight_after === false || report.state.validate.weight_after.length}
        />
        <Form.Control.Feedback type="invalid">
          {report.state.validate.weight_after.length ? report.state.validate.weight_after : 'Допустимы только цифры'}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="photo_after">
        <Form.Label>Фото участника После программы *</Form.Label>
        <Form.Control 
          required
          type="file"
          name="photo_after"
          accept=".jpg, .jpeg, .png"
          onChange={report.hundleInputChange}
          isValid={report.state.validate.photo_after === true}
          isInvalid={report.state.validate.photo_after === false || report.state.validate.photo_after.length}
        />
        <Form.Control.Feedback type="invalid">
          {report.state.validate.photo_after.length ? report.state.validate.photo_after : 'Допустимые форматы .jpg, .jpeg и .png'}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="other_photos">
        <Form.Label>Дополнительные фотографии для отчета (чеки, фото)</Form.Label>
        <Form.Control
          multiple 
          type="file"
          name="other_photos[]"
          accept=".jpg, .jpeg, .png"
          onChange={report.hundleInputChange}
          isValid={report.state.validate.other_photos === true}
          isInvalid={report.state.validate.other_photos === false || report.state.validate.other_photos.length}
        />
        <Form.Control.Feedback type="invalid">
          {report.state.validate.other_photos.length ? report.state.validate.other_photos : 'Допустимые форматы .jpg, .jpeg и .png'}
        </Form.Control.Feedback>
      </Form.Group>

      <Button 
        variant="primary"
        type="submit"
        disabled={
          report.state.validate.date_end === false || report.state.validate.date_end.length || !report.state.values.date_end.trim().length ||
          report.state.validate.weight_after === false || report.state.validate.weight_after.length || !report.state.values.weight_after.trim().length ||         
          report.state.validate.photo_after === false || report.state.validate.photo_after.length || !report.state.values.photo_after.trim().length ||
          report.state.validate.other_photos === false
        }>
        Отправить
      </Button>

    </form>
  )
}

export default Report;
