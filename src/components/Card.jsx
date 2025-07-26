import "./Card.css";

const Card = ({imgLInk="", title="" , description=""}) => {
  return (
    <div className="card flex-col alignStart gap-2 ">
      <img src={imgLInk} alt="" className="card-image" />
      <div className="flex justify-center alignCenter">
        <h3 className="large flex  minW noBreak">{title}</h3>
      </div>
    
        
      
    </div>
  );
}

export default Card;