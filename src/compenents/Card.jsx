import React from "react";
import "./card.css";

export default function Card(props) {
  return (
    <div className="card">
      <img src={props.image} alt="image" className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{props.name}</h2>
      </div>
      <div className="card-content">
        <p className="card-text">{props.time}</p>
      </div>
    </div>
  );
}
