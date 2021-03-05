import './Chat.css';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import useSound from 'use-sound';
import audioMsg from '../sounds/notification.mp3';


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
  const [headerChat, setHeadeChat] = useState('Header Chat');
  const [statusMessageSended, setStatusMessageSended] = useState('');
  const inputMessageToSend = useRef(null);

  const [registeredUsers,setRegisteredUsers] = useState([]);
  const [messageToSend,setMessageToSend] = useState('');

  const [play] = useSound(audioMsg);
  const [soundMessage,setSoundMessage] = useState(true);

  
  

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
    setHeadeChat(chat);
    


  }, [chat])

  useEffect(()=>{
      playSound();
    
  },[soundMessage])




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
        return name !== userName;
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
        let msgFrom = stanza.attrs.from.split('/')[0];
        
        const obj =  new objMsg(msgFrom,'R','datetime',messageReceived);
        setMessages(oldarray => [...oldarray,obj ]);
        setSoundMessage(!soundMessage);

        if(msgFrom !== chat){
        }



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

  const playSound = () =>{
    console.log('Play Sound');
    play();
  }

  const sendMessage = async () =>{
    if((messageToSend !== "") && (chat !== "")){
      console.log('Message sended');
      const message = xml(
        'message',
        { type: 'chat', to: chat  },
        xml('body', {}, messageToSend )
      );
      console.log(message);

      if (clientXmpp.status === 'online') {
        await clientXmpp.send(message);
        //setLogMessage(`${logMessage} ${message}`);
        const obj =  new objMsg(chat+'','S','datetime',messageToSend+"" );
        setMessages(oldarray => [...oldarray,obj ]);
        setMessageToSend('');
        
      } else {
        console.log('Offline');
      }
      inputMessageToSend.current.focus();

    }
  }



  if(firstAcess){
    setFirstAcess(false);
    xmppFunctions();
    connect();
  }

  const keyPressIMessageToSend = (e)=>{
    console.log(e);
    if(e.key ==="Enter"){
      sendMessage();
    }
  } 

  return(
    <>
      <div className="Chat">
        <h3>NTA Chat by Luis Carlos Eich</h3>
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
              <Link onClick={()=>setChat(item+'@'+DOMAIN)}>
                {item+'@'+DOMAIN===chat? <strong>{item}</strong>:item}
              </Link>
            </li>


          ))}

              
            </ul>
          </div>

          
          <div className="Body">
            <div className="HeadArea">
              {headerChat}
            </div>

            <div className="MessagesArea">
              
              {
                messages.filter((item)=>{
                  return item.fromto == chat;
                })
                .map((item,idx)=>(
                  <div key={idx} className={item.direction === 'S'? 'MessageSended' : 'MessageReceived' }>
                    {item.message}
                  </div>
                ))
              }
              
            </div>

            <div className="FooterChat">
              <input type="text" ref={inputMessageToSend} className="text" value={messageToSend} onChange={(e)=> setMessageToSend(e.target.value) } 
              onKeyPress={(e)=> keyPressIMessageToSend(e)
              } />
              <button onClick={() =>  sendMessage()}>Send Message</button>
              <p>{statusMessageSended}</p>
            
            </div>
          </div>
        </div>
      </div>
    </>
  )
}