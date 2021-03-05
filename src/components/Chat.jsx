import './Chat.css';
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

const { client, xml } = require('@xmpp/client');
const debug = require('@xmpp/debug');


const baseurl = 'http://177.125.244.8:5280/api';


//const URL = 'ws://127.0.0.1:5280/websocket';
const URL = 'ws://177.125.244.8:5280/websocket';
//const URL = 'wss://xmpp.beta.sip2sip.net:443/ws';
const DOMAIN = 'localhost';


class objMsg{
  constructor(fromto, direction, datetime, message){
    this.fromto = fromto;
    this.direction = direction;
    this.datetime = datetime;
    this.message = message;
  }
}







export default function Chat(){
  const history = useHistory();

  const [firstAcess, setFirstAcess] = useState(true);
  const [userName, setUserName] = useState(localStorage.getItem('username'));
  const [password, setPassword] = useState(localStorage.getItem('password'));
  const [xmppStatus, setXmppStatus] = useState('Offline');
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);

  const [registeredUsers,setRegisteredUsers] = useState([]);
  
  

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



  useEffect(() => {
    console.log("Changed User",chat);
  }, [chat])




  const connect = () =>{

    if(!userName  || !password ){
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      history.push('/login');
    }else{ 
      
      //get list of users...
      getRegisteredUsers();


      doConnection();
    }

    
  }


  const getRegisteredUsers = async () =>{

    const res = await axios.post( baseurl+"/registered_users", {
      "host": "localhost"
    }, {
      auth: {
        username: 'admin@localhost',
        password: 'password'
      }
    });
    if(res.status === 200){

      let arrayresult = res.data.filter(name => {
        return name !== 'luis';
    })

      setRegisteredUsers(arrayresult);
    }else{
      setRegisteredUsers([]);
    }
    
  }


  const doConnection = () =>{

    if(clientXmpp.status !== 'online'){
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
        addLog(stanza);
        let messageReceived = stanza.children[0].children[0];

        if(messageReceived === "Offline storage"){
          messageReceived = stanza.children[1].children[0]

        }


        const obj =  new objMsg(stanza.attrs.from,'R','datetime',messageReceived);
        setMessages(oldarray => [...oldarray,obj ])
      } else {
        //console.log('Other: ',stanza);
      }
    });

    clientXmpp.on('online', (address) => {
      // Makes itself available
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
        <h3>Chat</h3>
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
            {registeredUsers.map((item, idx)=>(

            <li key ={item}>
              <Link onClick={()=>setChat(item)}>
                {item}
              </Link>
            </li>

          ))}

              
            </ul>
          </div>

          
          <div className="Body">
            <div className="HeadArea">
              Cabeçalho da conversa
            </div>

            <aside className="MessagesArea">
              <ul>
              {
                messages.map((item,idx)=>(
                  <li key={idx}>
                    {item.fromto} - {item.message}
                  </li>
                ))
              }
              </ul>
            </aside>

            <div className="FooterChat">
              footer
            </div>
          </div>
        </div>
      </div>
    </>
  )
}