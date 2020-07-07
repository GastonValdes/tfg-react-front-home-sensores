import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';



// Variables para APIs
const API_URL_SENS = 'http://localhost:3010/sensores';
const API_URL_REG = 'http://localhost:3010/registros';
const API_URL_CALC = 'http://localhost:5000/calculos';

class App extends Component {
  /***** Constructor *******/
  constructor (props){
    super(props) 
    this.state = {
      sensores: [],
      sensorElegido: "",
      objetoSensorElejido: [],
      validationError: "",
      id: '',
      identificador: ' ',
      tipo: ' ',
      subtipo: ' ',
      medicion:' ',
      dir_ip: ' ',
      dir_mac: ' ',
      actividad: 'Se registra actividad de sensor'
    };
  }
  /*****Fin Constructor*****/
  
/***************COMPONENT DID MUNT**************/
  componentDidMount() {
    fetch(
        API_URL_SENS
    )
      .then(response => {
        return response.json();
      })
      .then(data => {
        let sensoresdeApi = data.map(sensores => {
          return { value: sensores, display: sensores };
        });
        this.setState({
          sensores: [
            {
              value: "Seleccione un sensor"              
            }
          ].concat(sensoresdeApi)
        })
        console.log(sensoresdeApi);
      })
      .catch(error => {
        console.log(error);
      });
  }
  /************FIN DE COMPONENT DID MOUNT***************/


  /***Evento Submit ****/
    handleSubmit = (event) => {
        console.log(this.state);
        console.log(this.state.medicion);
        const type = this.state.sensores.find((sensor)=> sensor.value._id === this.state.sensorElegido );
      console.log(type.value);
      //Inicio llamada a Api de Sensores para Actualizar  
        fetch(API_URL_SENS, {
            method: 'PATCH', //Hago un Patch para actualizar el registro del sensor que quiero
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             },
            body: JSON.stringify(
     { "_id" : type.value._id,
      "identificador" : type.value.identificador,
      "dir_ip" : type.value.dir_ip,
      "dir_mac" : type.value.dir_mac,
      "tipo" : type.value.tipo,
      "subtipo" : type.value.subtipo,
      "habilitado" : type.value.habilitado,
      medicion : this.state.medicion 
    })               
  }
                ).then(function(response) {
                                        
                                        console.log(response);
                                        return response.json();
                                          }
                        );
        this.setState.id = '';
      //Inicio Llamada a Api de Logs
        fetch(API_URL_REG, {
        method: 'POST', //Hago un Post para crear un nuevo registro
            headers: {
              'Content-Type': 'application/json'
            },
           body: JSON.stringify(this.state)
              }).then(function(response) {
              
              console.log(response)
              return response.json();
            });

      //Inicio Llamada a Api Logica
            fetch(API_URL_CALC, {
        method: 'GET', //Hago un Post para crear un nuevo registro
            headers: {
              'Content-Type': 'application/json'
            },
           
              }).then(function(response) {
              
              console.log(response)
              return response.json();
            });






alert('Sensor Registrado Correctamente');
event.preventDefault();
}
/*****Fin Evento Submit ******/


/*****Evento de Cambios *******/
  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
    const type = this.state.sensores.find((sensor)=> sensor.value._id === this.state.sensorElegido );
    console.log(type);
    if (type !== undefined){
    this.setState({identificador : type.value.identificador});
    this.setState({tipo : type.value.tipo});
    this.setState({subtipo : type.value.subtipo});
    this.setState({dir_ip : type.value.dir_ip});
    this.setState({dir_mac : type.value.dir_mac});
  }
}
   /***************FIN EVENTO CAMBIO**********/
    
 
  render() {
//    const {id} = this.state
    const {identificador} = this.state
    const {tipo} = this.state
    const {subtipo} =this.state
    const {medicion} =this.state
    const {dir_mac} =this.state
    const {dir_ip} = this.state
    
    return (
      <div className="todo-wrapper">
        <img src={require('./img/Sensor.png')} alt="lalalala" with="60" height="80" />
        
      <h4>Simulador de Sensores</h4>
        <form  onSubmit={this.handleSubmit}>

      
          <div>
            Sensor:
          <select value={this.state.sensorElegido}
            onChange={e =>
              this.setState({
                    sensorElegido: e.target.value,
                    validationError:
                    e.target.value === ""
                    ? "Por favor elija un sensor"
                    : ""
                            })
                            
                      }
            onClick={this.handleChange}
          >
            {this.state.sensores.map(sensor => (
            <option key={sensor.value._id} value={sensor.value._id}>{sensor.value.identificador}</option>
            ))}
          </select>
          <div style={{ color: "red", marginTop: "5px" }}>{this.state.validationError}</div>
        </div>
       
          <br/>
          <br/>

          <label htmlFor="medicion">medicion</label>
          <input
            name="medicion"
            type="number"
            step="0.1"
            max="50000"
            min="1"
            placeholder="Completar"
            onChange={this.handleChange}
          />
          <span className="validity"></span>
          <br/>
          <br/>
          <pre> 
        id: {this.state.sensorElegido}{"\n"}
        identificador: {identificador}{"\n"}
        tipo: {tipo} {"\n"}
        subtipo: {subtipo} {"\n"}
        valor medicion: {medicion} {"\n"}
        dirección IP: {dir_ip} {"\n"}
        dirección MAC: {dir_mac} {"\n"}
      </pre>

     
    <button className="btn btn-primary" type="submit">Enviar</button>  
    <br/>
    
     
        </form>
        </div>
    );
  }
}
export default App;

