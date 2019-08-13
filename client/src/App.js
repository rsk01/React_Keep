// /client/App.js
import React, { Component } from 'react';
import axios from 'axios';
import { Container, Button, Form, FormGroup, Input, Card, CardHeader,CardBody, Row, Col} from 'reactstrap';
import { } from 'reactstrap';
import Modal from "./components/modal";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      data: [],
      id: 0,
      title: null,
      message: null,
      intervalIsSet: false,
      idToDelete: null,
      idToUpdate: null,
      objectToUpdate: null

    };

    this.updateDB = this.updateDB.bind(this);

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }


  getDataFromDb = () => {
    fetch('http://localhost:3001/api/getData')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }));
  };

  putDataToDB = (title,message) => {
    let currentIds = this.state.data.map((data) => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post('http://localhost:3001/api/putData', {
      id: idToBeAdded,
      message: message,
      title: title
    });
  };

  deleteFromDB = (idTodelete) => {
    parseInt(idTodelete);
    let objIdToDelete = null;
    this.state.data.forEach((dat) => {
      if (dat.id === idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete('http://localhost:3001/api/deleteData', {
      data: {
        id: objIdToDelete,
      },
    });
  };

  updateDB = (idToUpdate, updateTitle, updateMessage) => {
    axios.put('http://localhost:3001/api/updateData', {
      id: idToUpdate,
      update: {  title: updateTitle, message: updateMessage },
    });
  };
  render() {
    const  {data } = this.state;
    return (
      <Container fluid className="page-size">
        <Card style={{marginLeft:10+"em",marginRight:10+"em", marginTop:5+"em"}}>
          <Form>
          <FormGroup>
            <Input  
              onChange={(e) => this.setState({ title: e.target.value })}
              type="Title" 
              name="title" 
              id="newTitle" 
              placeholder="Title" 
              className="no-border"/>
              
            <Input 
              onChange={(e) => this.setState({ message: e.target.value })}
              type="textarea" 
              name="note" 
              id="newtitle" 
              placeholder="Take a note ..."
              className="no-border"/>

          </FormGroup>
          <Button onClick={() => this.putDataToDB(this.state.title,this.state.message)}>
              ADD
            </Button>
        </Form>
      </Card>
      <br/>
      <Row>
        
          {data.length <= 0
            ? 'NO DB ENTRIES YET'
            : data.map((dat) => (
            <Col xs="6" sm="4">
              <Card className="card-size">
                <CardHeader><strong>{dat.title}</strong></CardHeader>
                <CardBody>{dat.message}</CardBody>
            
                  <Button color="danger" onClick={() => this.deleteFromDB(dat.id)}>
                    DELETE
                  </Button>
                  <Modal id={dat.id} title={dat.title} message={dat.message} updateDB={this.updateDB}/>
              </Card>
              <br/>
              </Col>
              ))}
              
              </Row>
      </Container>
      
    );
  }
}

export default App;