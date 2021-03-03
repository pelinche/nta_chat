import './Chat.css';

export default function Chat(){

  return(
    <>
      <div className="Chat">
        <h1>Chat</h1>
        <div className="ChatArea">
          <div className="UsersList">
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