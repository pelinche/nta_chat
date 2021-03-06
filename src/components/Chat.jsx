import './Chat.css';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import useSound from 'use-sound';
import audioMsg from '../sounds/notification.mp3';
import { MessageType } from 'stanza/Constants';


const { client, xml } = require('@xmpp/client');
const debug = require('@xmpp/debug');




const baseurl = 'http://177.125.244.8:5280/api';


//const URL = 'ws://127.0.0.1:5280/websocket';
const URL = 'ws://177.125.244.8:5280/websocket';
//const URL = 'wss://xmpp.beta.sip2sip.net:443/ws';
const DOMAIN = 'localhost';


class objMsg{
  constructor(fromto, direction, datetime, message, type, from){
    this.fromto = fromto;
    this.direction = direction;
    this.datetime = datetime;
    this.message = message;
    this.messagetype = type;
    this.from = from;
  }
}







export default function Chat(){
  const history = useHistory();

  const [firstAcess, setFirstAcess] = useState(true);
  const [userName, setUserName] = useState(localStorage.getItem('username'));
  const [password, setPassword] = useState(localStorage.getItem('password'));
  const [xmppStatus, setXmppStatus] = useState('Offline');
  const [messages, setMessages] = useState([]);
  const [chatWith, setChatWith] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [headerChat, setHeadeChat] = useState('Header Chat');
  const [statusMessageSended, setStatusMessageSended] = useState('');
  const inputMessageToSend = useRef(null);

  const [registeredUsers,setRegisteredUsers] = useState([]);
  const [messageToSend,setMessageToSend] = useState('');

  const [play] = useSound(audioMsg);
  const [soundMessage,setSoundMessage] = useState(0);
  const [lastMessageReceivedFrom,setLastMessageReceivedFrom] = useState('');
  const [soundNotification, setSoundNotification] = useState(true);
  const [chatRooms,setChatRooms] = useState([]);
  const [chatType, setChatType] = useState('');
  
  

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
    setHeadeChat(chatWith);
  }, [chatWith])


  useEffect(()=>{
    
    
    
    chatRooms.map((item, idx)=>{
      console.log("Subs",idx,item);
      subscribeRoom(item);
      }
    )
  },[chatRooms])


  useEffect(()=>{


    if(lastMessageReceivedFrom !==chatWith){
//      if(soundMessage >0){
      if(soundNotification){
        playSound();
      }
    }
  },[soundMessage])




  const connect = () =>{

    if(!userName  || !password ){
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      history.push('/login');
    }else{ 
      
      //get list of users...
      getRegisteredUsers();
      getChatRooms();


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

  const getChatRooms = async () =>{
    const res = await axios.post( baseurl+"/muc_online_rooms", {
      "service": "conference.localhost"
    }, {
      auth: {
        username: 'admin@localhost',
        password: 'password'
      }
    });
    if(res.status === 200){
      console.log("MucOnlineRooms",res);
      setChatRooms(res.data);
    }else{
      setChatRooms([]);
    }
    
  }

  // "user": userName+'@'+DOMAIN,
  // "nick": userName,
  // "room": roomName,


  const subscribeRoom = async (roomName) =>{
    console.log(roomName);
    const res = await axios.post( baseurl+"/subscribe_room", {
      "user": userName+'@'+DOMAIN,
      "nick": userName,
      "room": roomName,
      "nodes": "urn:xmpp:mucsub:nodes:messages,urn:xmpp:mucsub:nodes:affiliations"
    }, {
      auth: {
        username: 'admin@localhost',
        password: 'password'
      }
    });
    if(res.status === 200){
      console.log(res);

    }else{
      console.log(res);
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
//    console.log(clientXmpp.status);
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
        //console.log("R1: ",stanza);
        
        
        let msgFrom = stanza.attrs.from.split('/')[0];
        let fromText = stanza.attrs.from.split('/')[1];
        let messageReceived = stanza.children[0].children[0];
        let receivedChatType = "chat";
        let direction = 'R';

        if((''+messageReceived).indexOf('type="groupchat"')<0){
          if(messageReceived === "Offline storage"){
            messageReceived = (stanza.children[1].children[0])
          }else{
            setLastMessageReceivedFrom(msgFrom);
            setSoundMessage(soundMessage=> soundMessage + 1 );
          }
        }else{
          let chatGroupObject = stanza.children[0].children[0].children[0].children[0].attrs;
          
          fromText = chatGroupObject.from.split('/')[1];
          console.log("chatGroupObj",chatGroupObject,fromText);
          messageReceived = ''+messageReceived.children[0].children[0].children[0].children[0];
          
          //messageReceived = ''+messageReceived.children[0];
          receivedChatType = 'groupchat';
          console.log("From2:",fromText, userName);
          if(fromText === userName){
            direction = 'S';
          }else{
            setLastMessageReceivedFrom(msgFrom);
            setSoundMessage(soundMessage=> soundMessage + 1 );            
          }
          
        }
        console.log("Received:",messageReceived);
        
        
        const obj =  new objMsg(msgFrom,direction,'datetime',messageReceived,receivedChatType,fromText);
        //console.log(obj);
        setMessages(oldarray => [...oldarray,obj ]);
        




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
      //console.debug('Status: ', status);
      setXmppStatus(status );
    });
  };

  const playSound = () =>{
    console.log('Play Sound');
    play();
  }





  const sendMessage = async () =>{
    if((messageToSend !== "") && (chatWith !== "")){
      
      const message = xml(
        'message',
        { type: chatType , to: chatWith , from :userName +'@'+DOMAIN },
        xml('body', {}, messageToSend )
      );
      
      if (clientXmpp.status === 'online') {
        await clientXmpp.send(message);
        //setLogMessage(`${logMessage} ${message}`);
        if(chatType === "chat"){
          const obj =  new objMsg(chatWith+'','S','datetime',messageToSend+"",chatType,userName);
          setMessages(oldarray => [...oldarray,obj ]);
        }
        setMessageToSend('');
        setStatusMessageSended('');  
      } else {
        console.log('Offline');
        setStatusMessageSended('Chat offline');
      }
      
      inputMessageToSend.current.focus();

    }else{
      if(chatWith === ""){
        setStatusMessageSended('Please select user in a list');
      }else if(messageToSend === ""){
        setStatusMessageSended('Please inform a message to send.');
      }
      
    }
  }



  if(firstAcess){
    setFirstAcess(false);
    xmppFunctions();
    connect();
  }

  const keyPressMessageToSend = (e)=>{
    if(e.key ==="Enter"){
      sendMessage();
    }
  } 

  return(
    <>
      <div className="Chat">
        <h3>NTA Chat by Luis Carlos Eich</h3>
        <div className="ChatArea">
          <div className="MenuArea">
            <div class="MenuHeadArea">
              <p>Username: {userName}</p>
              <p>Status: {xmppStatus}</p>
              <label>
              <input
                type="checkbox"
                defaultChecked={soundNotification}
                
                onChange={()=>setSoundNotification(!soundNotification)}
              />Sound Notification?
              </label>


              <button
                onClick={() => {
                  disconnect();
                }}
              >
                Logout
              </button>
              <h4>UserList</h4>

            </div>
            <div className="UsersList">
            <ul>
            {registeredUsers.map((item, idx)=>(

            <li key ={item}>
              <Link onClick={()=>{
                  setChatWith(item+'@'+DOMAIN)
                  setChatType('chat')
                }}>
                {item+'@'+DOMAIN===chatWith? <strong>{item}</strong>:item}
              </Link>
            </li>

              
          ))}
 
              
            </ul>

            <ul>
            {chatRooms.map((item, idx)=>(
              <li key ={item}>
                <Link onClick={()=>{
                  setChatWith(item);
                  setChatType('groupchat');
                }}>
                  {item===chatWith? <strong>{item}</strong>:item}
                </Link>
              </li>
            ))}
 
              
            </ul>


            </div>


          </div>

          
          <div className="Body">
            <div className="HeadArea">
              {headerChat}
            </div>

            <div className="MessagesArea">
              
              {
                messages.filter((item)=>{
                  return item.fromto == chatWith;
                })
                .map((item,idx)=>(
                  <div key={idx} className={item.direction === 'S'? 'MessageSended' : 'MessageReceived' }>
                    {item.from}:
                    {item.message}
                    
                  </div>
                ))
              }
              
            </div>

            <div className="FooterChat">
              <input type="text" ref={inputMessageToSend} className="text" value={messageToSend} onChange={(e)=> setMessageToSend(e.target.value) } 
              onKeyPress={(e)=> keyPressMessageToSend(e)
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