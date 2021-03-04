import {useState} from 'react';
import {  useHistory } from 'react-router-dom';

import axios from 'axios';
import Login from './Login';
const baseurl = 'http://177.125.244.8:5280/api';

export default function Admin(){
  
  const history = useHistory();

  const [serverStatus, setServerStatus] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [user_Username, setUser_Username] = useState('');
  const [user_Password,setUser_Password ] = useState('');
  const [msgUser, setMsgUser] = useState('');
  const [registeredUsers,setRegisteredUsers] = useState([]);
  const [edittingUser, setEditingUser] = useState(false);
  const [editingUserName, setEditingUserName] = useState('');
  const [user_ChangePassword,setUser_ChangePassword] = useState('');
  const [msgEditing, setMsgEditing] = useState('');

  const statusServer = async () =>{
    const res = await axios.post( baseurl+"/status", {}, {
      auth: {
        username: 'admin@localhost',
        password: 'password'
      }
    });
    if(res.status === 200){
      setServerStatus(res.data);
    }else{
      setServerStatus('Not Connected');
    }
    
  }


  const getConnectedUsers = async () =>{
    
    const res = await axios.post( baseurl+"/connected_users", {}, {
      auth: {
        username: 'admin@localhost',
        password: 'password'
      }
    });
    if(res.status === 200){
      console.log(res);
      setConnectedUsers(res.data);
    }else{
      setConnectedUsers([]);
    }
    
  }


  const getRegisteredUsers = async () =>{
    setEditingUser(false);
    const res = await axios.post( baseurl+"/registered_users", {
      "host": "localhost"
    }, {
      auth: {
        username: 'admin@localhost',
        password: 'password'
      }
    });
    if(res.status === 200){
      console.log(res);
      setRegisteredUsers(res.data);
    }else{
      setRegisteredUsers([]);
    }
    
  }



  const addUser = async() =>{
    if(user_Username !== "" &&user_Password !== "" ){

      const res = await axios.post( baseurl+"/register",{
        "user": user_Username,
        "host": "localhost" ,
        "password": user_Password
      }, {
        auth: {
          username: 'admin@localhost',
          password: 'password'
        }
        
      });
      if(res.status === 200){
        console.log(res);
        setMsgUser(res.data);
        getRegisteredUsers();
        setUser_Username('');
        setUser_Password('')
        //setConnectedUsers(res.data);
      }else{
        setMsgUser("Fail: "+res.data);
        //setConnectedUsers([]);
      }
    }
  }
  
  const deleteUser =async(userName)=>{
    setEditingUser(false);
    const res = await axios.post( baseurl+"/unregister",{
      "user": userName.item,
      "host": "localhost" ,
    }, {
      auth: {
        username: 'admin@localhost',
        password: 'password'
      }
      
    });
    if(res.status === 200){
      console.log(res);
      setMsgEditing('User '+userName.item+' Deleted');
      getRegisteredUsers();

    }else{
      setMsgEditing("Fail: "+res.data);
      
    }


  }

  const editUser = (userName)=>{
    setUser_ChangePassword('');
    setEditingUser(true);
    setEditingUserName(userName.item);
  }

  const change_Password = () => {
    if(user_ChangePassword !== ""){
      setEditingUser(false);

    }


  }
  
  const loginScreen = () => {
    history.push('/login');
  }


  return(
    <>
      <h1>Admin Area</h1>
      <button onClick={()=> loginScreen()}>Chat Login</button>
      <button onClick={()=> statusServer()}>Get Server Status</button>
      <button onClick={()=>getConnectedUsers()}>Conected Users</button>
      <button onClick={()=>getRegisteredUsers()}>Registered Users</button>
      <p>Server Status: {serverStatus}</p>
      <div>
        <label>Conected Users</label>
        <ul>
          {connectedUsers.map((item, idx)=>(
            <li key ={idx}>
              {item}
            </li>

          ))}
        </ul>
      </div>

      {edittingUser ?(
        <div>
          <span>Edit User {editingUserName}</span>
          <label> - New password:</label>
          <input value={user_ChangePassword} on onChange={(e)=>setUser_ChangePassword(e.target.value)}></input>
          <button onClick={()=> change_Password()}>Change Password</button>
          <button onClick={()=> setEditingUser(false)}>Cancel</button>
        </div>

        )
        :''
      }
      <span>{msgEditing}</span>
        

      <div>
        <h2>Users List</h2>
        <ul>
          {registeredUsers.map((item, idx)=>(
            <li key ={idx}>
              {item}
              {item !== "admin"? <button onClick={()=>  deleteUser({item})} >Delete</button> :''}
              {item !== "admin"? <button onClick={()=>editUser({item})} >Edit</button>:''}
              
            </li>

          ))}
        </ul>
      </div>


      <h3>Add User</h3>
      <div>
          <label>Username:</label>
          <input value={user_Username} on onChange={(e)=>setUser_Username(e.target.value)}></input>
          <label>Password:</label>
          <input value={user_Password} on onChange={(e)=>setUser_Password(e.target.value)}></input>
      </div>
      <button onClick={()=> addUser()}>Add User</button>
      <div className="red">{msgUser}</div>
      

    </>
  )
}