import './Chat.css';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
const { client, xml } = require('@xmpp/client');
const debug = require('@xmpp/debug');


//const URL = 'ws://127.0.0.1:5280/websocket';
const URL = 'ws://177.125.244.8:5280/websocket';
//const URL = 'wss://xmpp.beta.sip2sip.net:443/ws';
const DOMAIN = 'localhost';



export default function Chat(){
  console.log('Load Function');
  const history = useHistory();

  const [firstAcess, setFirstAcess] = useState(true);
  const [userName, setUserName] = useState(localStorage.getItem('username'));
  const [password, setPassword] = useState(localStorage.getItem('password'));
  const [xmppStatus, setXmppStatus] = useState('Offline');

  const [clientXmpp, setClientXmpp] = useState(
    client({
      service: URL,
      domain: DOMAIN,
      resource: 'WebApp',
      username: userName,
      password: password,
      transport: 'websocket',
    })
  );





  const connect = () =>{
    console.log('Username:'+userName);
    console.log('Password:'+password);
    console.log('Starting connection');

    if(!userName  || !password ){
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      history.push('/login');
    }else{ 
      
      doConnection();
    }

    
  }

  const doConnection = () =>{

    if(clientXmpp.status !== 'online'){
      /*
      setClientXmpp(client({
        service: URL,
        domain: DOMAIN,
        resource: 'WebApp',
        username: userName,
        password: password,
        transport: 'websocket',
      }));
      */
      debug(clientXmpp, false);
      clientXmpp.start().catch((error) => {
        console.log('*Erro', error);
      });


    }else{
      console.log('Já está online');
    }



  }

  const disconnect = async () => {
    console.log(clientXmpp.status);
    if (clientXmpp.status === 'online') {
    
      await clientXmpp.send(xml('presence', { type: 'unavailable' }));
      await clientXmpp.stop();
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      history.push('/login');
    } else {
      console.log('No connection');
    }    
    
  }
  const addLog = (msg) =>{
    console.log(msg);
  }

  const xmppFunctions = () => {
    clientXmpp.on('error', async (err) => {
      console.error('Error:', err);
      disconnect();
    });

    clientXmpp.on('stanza', (stanza) => {
      if (stanza.is('message')) {
        //setMessasges([messages , stanza]);
        console.log('Message from: ' + stanza.attrs.from);
        console.log('Message To: ' + stanza.attrs.to);
        //console.log("Message ? ",stanza.children.attrs[0]);

        let msgreceived = '' + stanza.getChild('body');
        //        setMessasges([messages, msgreceived]);
        //console.log("msgreceived:",msgreceived);
        addLog("Received: "+msgreceived);

        console.log('Received: ', stanza);
        //console.log('Message Received: ' + stanza.getChild('body'));
      } else {
        //console.log('Other: ',stanza);
      }
    });

    clientXmpp.on('online', (address) => {
      // Makes itself available
      console.log('Ficou online',clientXmpp.status);
      clientXmpp.send(xml('presence'));
    });

    /*
    clientXmpp.on("offline", () => {
      console.log("offline");
    });
    */

    clientXmpp.on('status', (status) => {
      console.debug('Status: ', status);
      setXmppStatus(status );
    });
  };



  if(firstAcess){
    setFirstAcess(false);
    xmppFunctions();
    connect();

  }

  return(
    <>
      <div className="Chat">
        <h1>Chat</h1>
        <div className="ChatArea">
          <div className="UsersList">
          <p>Username: {userName}</p>
          <p>Status: {xmppStatus}</p>

          <button
            onClick={() => {
              disconnect();
            }}
          >
            Disconnect
          </button>
            <h3>UserList</h3>
            
            <ul>
            <li>
                User1
              </li>
              <li>
                User1
              </li>
              <li>
                User1
              </li>
              <li>
                User1
              </li>
              <li>
                User1
              </li>
              <li>
                User1
              </li>
              <li>
                User1
              </li>
              <li>
                User1
              </li>
              <li>
                User1
              </li>
              <li>
                User1
              </li>
              <li>
                User1
              </li>
              <li>
                User1
              </li>
              <li>
                User1
              </li>
              <li>
                User1
              </li>
              <li>
                User1
              </li>
  
              
            </ul>            
          </div>

          
          <div className="Body">
            <div className="HeadArea">
              Cabeçalho da conversa
            </div>

            <div className="MessagesArea">
              messageArea
            </div>

            <div className="FooterChat">
              footer
            </div>

            
            
          </div>
        </div>
      </div>
    </>
  )
}