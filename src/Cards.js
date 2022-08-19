// import React, { useEffect } from "react";
import { carList } from "./carList.js";
import "./cards.css";

export const Cards = ({ carType }) => {
  return (
    <>
      <h1>Similar Cars to your image:</h1>
      <div className="main-card-container">
        {carList
          .filter((car) => {
            return car.label.includes(carType);
          })
          .map((cars, i) => {
            return (
              <div key={i} className="card-container">
                <img
                  src={cars.image}
                  alt={cars.name}
                  className="car-image"
                ></img>
                <h3 className="car-name">{cars.name}</h3>
              </div>
            );
          })}
      </div>
    </>
  );
};
