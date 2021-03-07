import "./UserCard.css";

export default (props) =>{
  const cardStyle = {
    backgroundColor : props.color || '#ccc',
    borderColor : props.color || '#F00',
  }

  return(
    <div className="UserCard" style={cardStyle}>

      {props.title !== ""? <div className="Title"><div className={props.status}>{props.statustext}</div> {props.title}</div>: "" }
      
      <div className="Content" style={cardStyle} >{props.children}</div>
      
    </div>
  )
}