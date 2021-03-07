import {useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Login.css';
//const URL = 'ws://127.0.0.1:5280/websocket';
const URL = 'ws://177.125.244.8:5280/websocket';
//const URL = 'wss://xmpp.beta.sip2sip.net:443/ws';
const DOMAIN = 'localhost';

const { client, xml } = require('@xmpp/client');
const debug = require('@xmpp/debug');

let clientXmpp = client({
  service: URL,
  domain: DOMAIN,
  resource: 'WebApp',
  username: '',
  password: '',
  transport: 'websocket',
});


export default function Login() {
  const history = useHistory();



  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [messageLogin, setMessageLogin] = useState('');
  const [connected, setConnected] = useState(false);
  
  const connect = () =>{
    setMessageLogin('Starting conection...');
    if(userName === "" || password === ""){
      setMessageLogin('Username and password are required.');
    }else{ 
      doConnection();
    }

    
  }

  const doConnection = () =>{

    if(clientXmpp.status !== 'online'){
      
      clientXmpp = client({
        service: URL,
        domain: DOMAIN,
        resource: 'WebApp',
        username: userName,
        password: password,
        transport: 'websocket',
      });
      debug(clientXmpp, false);
      clientXmpp.start().catch((error) => {
          setMessageLogin(error.message);
          //console.log('*Erro', error);
          clientXmpp.stop();
      });

      clientXmpp.on("status", (status) => {
        //console.debug(status);
        if(status === "online"){
          clientXmpp.stop();
          //direct to chat page
          localStorage.setItem('username', userName);
          localStorage.setItem('password', password);
          history.push('/chat');


        }
      });


      //clientXmpp.stop();
    }else{
      console.log('Já está online');
    }



  }



    return(
      

      <div className="Login">
        <h1>NTA Chat</h1>
        <div>
        <label>Username</label>
        <input value={userName} onChange={ (e) =>{
            setUserName(e.target.value)
          }
        } />
        </div>
        <div>
        <label>Password</label>
        <input type="password" value={password} onChange={ (e) =>{
            setPassword(e.target.value);
          }
        } />
        </div>
        <div>
        <button onClick={()=>
          connect()
        }>Login</button>
        </div>
{/*  */}
        <span>{messageLogin}</span>
        <div className="LinkArea">
          <Link to="/admin">Admin Area</Link>
        </div>
{/*  */}
      </div>
    )

}