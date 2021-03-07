import "./Card.css";

export default (props) =>{
  const cardStyle = {
    backgroundColor : props.color || '#F00',
    borderColor : props.color || '#F00',
  }
  return(
    <div className="Card" style={cardStyle}>
      {props.title !== ""? <div className={props.direction}>{props.title}</div>: "" }
      
      <div className={props.contentDirection} style={cardStyle} >{props.children}</div>
      
    </div>
  )
}