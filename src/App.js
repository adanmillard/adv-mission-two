import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

import { Cards } from "./Cards";

function App() {
  const [imageURL, setImageURL] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [carType, setCarType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetPage = () => {
    setImageURL(null);
    setImageBase64(null);
    setCarType("");
  };

  function toDataURL(src, callback) {
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      var canvas = document.createElement("CANVAS");
      var context = canvas.getContext("2d");
      var dataURL;
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      context.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL();
      callback(dataURL);
    };
    img.src = src;
    if (img.complete || img.complete === undefined) {
      img.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      img.src = src;
    }
  }

  const handleUploadChange = ({ target }) => {
    resetPage();
    setIsLoading(true);
    const imgUrl = URL.createObjectURL(target.files[0]);
    setImageURL(imgUrl);
    toDataURL(imgUrl, (dataUrl) => setImageBase64(dataUrl.split("base64,")[1]));
  };

  const googleApi = ""; //Gcloud auth token goes here.

  useEffect(() => {
    if (imageBase64) {
      axios
        .post(
          "https://automl.googleapis.com/v1beta1/projects/530591215469/locations/us-central1/models/ICN7068277569367310336:predict",
          {
            payload: {
              image: {
                imageBytes: imageBase64,
              },
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              // 'Authorization': 'Bearer $(gcloud auth application-default print-access-token)'
              Authorization: `Bearer ${googleApi}`,
            },
          }
        )
        .then((res) => {
          const { displayName: vehicleType } = res.data.payload[0];
          setCarType(vehicleType);
          setIsLoading(false);
          console.log(res.data.payload[0]);
        })
        .catch((error) => {
          const { code, message } = error.response.data.error;
          console.log(`CODE ${code} | ${message}`);
        });
    }
  }, [imageBase64]);

  return (
    <div className="App">
      <img
        className="turners-logo"
        src="https://www.canstarblue.co.nz/wp-content/uploads/2021/10/Turners-logo-used-car-dealerships.png"
        alt="logo"
      />
      <div className="main-image-search-container">
        <h1 className="turners-title">Turners Car image search</h1>
        <label className="custom-file-upload">
          <input type="file" onChange={handleUploadChange} />
          Upload image
        </label>
        {imageURL && (
          <div className="card-container-upload">
            <img src={imageURL} alt="car" className="car-image-upload" />
          </div>
        )}
      </div>
      <div>
        {carType && (
          <h3>Your image is a: {`${carType.toLocaleUpperCase()}`}</h3>
        )}
      </div>
      {isLoading && <h1>Finding the best match for you... Please Wait.</h1>}
      {carType && <Cards carType={carType} />}
    </div>
  );
}

export default App;
