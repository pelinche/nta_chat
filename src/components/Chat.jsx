import BodyChat from './BodyChat';

import './Chat.css';
import SendMessage from './SendMessage';
import UsersList from './UsersList';


export default function Chat(){

  return(
    <>
      <div className="Chat">
        <h1>Chat</h1>
        <div className="ChatArea1">
          <UsersList />
          <div className="Body">
            <BodyChat />
            <SendMessage />
            
          </div>
        </div>
      </div>
    </>
  )
}