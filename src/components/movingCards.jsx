import React from "react";
import style from ".././css/movingCards.module.css";
import img1 from ".././images/img1.png";
import img2 from ".././images/img2.png";
import img3 from ".././images/img3.png";
import img4 from ".././images/img4.png";
import img5 from ".././images/img5.png";
import img6 from ".././images/img6.png";
import img7 from ".././images/img7.png";
import img8 from ".././images/img8.png";
import img9 from ".././images/img9.png";

const MovingCards = () => {
  const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

  return (
    <div className={style.cinemaReel}>
      <div className={style.reel}>
        {images.map((image, index) => (
          <img
            src={image}
            alt={`Slide ${index}`}
            className={style.reelImage}
            key={index}
          />
        ))}
        {images.map((image, index) => (
          <img
            src={image}
            alt={`Slide ${index}`}
            className={style.reelImage}
            key={index + images.length}
          />
        ))}
      </div>
    </div>
  );
};

export default MovingCards;
