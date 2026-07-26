import "../../styles/birthdayWish.css";
import { FaHeart } from "react-icons/fa";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function BirthdayWish() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.background = "#feecea";
    document.documentElement.style.background = "#feecea";

    return () => {
      document.body.style.background = "";
      document.documentElement.style.background = "";
    };
  }, []);

  useEffect(() => {
    const wrapper = document.getElementById("wrapper");
    if (!wrapper) return undefined;

    let lastHeart = 0;

    const createHeart = (e) => {
      const now = Date.now();
      // Create one heart every 80ms
      if (now - lastHeart < 80) return;
      lastHeart = now;

      const heart = document.createElement("span");
      heart.innerHTML = "\u{1F497}";
      heart.className = "cursor-heart";
      heart.style.left = `${e.clientX}px`;
      heart.style.top = `${e.clientY}px`;
      wrapper.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 1000);
    };

    window.addEventListener("mousemove", createHeart);
    return () => {
      window.removeEventListener("mousemove", createHeart);
    };
  }, []);

  const handleClickHere = () => {
    navigate("/surprise");
  };

  return (
    <div id="wrapper">
      {/* FLAGS */}
      <div className="flag__birthday">
        <img src="/images/birthday/1.png" alt="" width="350" className="flag__left" />
        <img src="/images/birthday/1.png" alt="" width="350" className="flag__right" />
      </div>

      {/* MAIN CONTENT */}
      <div className="content">
        {/* LEFT */}
        <div className="left">
          <div className="title">
            <h1 className="happy">
              <span style={{ "--t": "4s" }}>H</span>
              <span style={{ "--t": "4.2s" }}>a</span>
              <span style={{ "--t": "4.4s" }}>p</span>
              <span style={{ "--t": "4.6s" }}>p</span>
              <span style={{ "--t": "4.8s" }}>y</span>
            </h1>

            <h1 className="birthday">
              <span style={{ "--t": "5s" }}>B</span>
              <span style={{ "--t": "5.2s" }}>i</span>
              <span style={{ "--t": "5.4s" }}>r</span>
              <span style={{ "--t": "5.6s" }}>t</span>
              <span style={{ "--t": "5.8s" }}>h</span>
              <span style={{ "--t": "6s" }}>d</span>
              <span style={{ "--t": "6.2s" }}>a</span>
              <span style={{ "--t": "6.4s" }}>y</span>
            </h1>

            <div className="hat">
              <img src="/images/birthday/hat.png" alt="" width="130" />
            </div>
          </div>

          <div className="date__of__birth">
            <span>M A N S I</span>
          </div>

          <div className="btn">
            <button id="btn__letter" type="button" onClick={handleClickHere}>
              Let's Celebrate
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right">
          <div className="box__account">
            <div className="image">
              <img src="/images/birthday/img.png" alt="" />
            </div>

            <div className="name">
              ❤️
              <span>30-07-2002</span>
              ❤️
            </div>

            <div className="balloon_one">
              <img src="/images/birthday/balloon1.png" width="100" alt="" />
            </div>

            <div className="balloon_two">
              <img src="/images/birthday/balloon2.png" width="100" alt="" />
            </div>
          </div>

          {/* Circle */}
          <div className="cricle">
            <div className="text__cricle">
              {"happy-birthday-".split("").map((char, index) => (
                <span key={index} style={{ "--i": index + 1 }}>
                  {char}
                </span>
              ))}
            </div>
            <div className="fa-heart">
              {/* <FaHeart /> */}
              ❤️
            </div>
          </div>
        </div>
      </div>

      {/* STARS */}
      <div className="decorate_star star1" style={{ "--t": "15s" }} />
      <div className="decorate_star star2" style={{ "--t": "15.2s" }} />
      <div className="decorate_star star3" style={{ "--t": "15.4s" }} />
      <div className="decorate_star star4" style={{ "--t": "15.6s" }} />
      <div className="decorate_star star5" style={{ "--t": "15.8s" }} />

      {/* FLOWERS */}
      <div className="decorate_flower--one" style={{ "--t": "15s" }}>
        <img src="/images/birthday/decorate_flower.png" width="20" alt="" />
      </div>
      <div className="decorate_flower--two" style={{ "--t": "15.3s" }}>
        <img src="/images/birthday/decorate_flower.png" width="20" alt="" />
      </div>
      <div className="decorate_flower--three" style={{ "--t": "15.6s" }}>
        <img src="/images/birthday/decorate_flower.png" width="20" alt="" />
      </div>

      {/* BOTTOM DECORATION */}
      <div className="decorate_bottom">
        <img src="/images/birthday/decorate.png" width="100" alt="" />
      </div>

      {/* SMILEY */}
      <div className="smiley__icon">
        <img src="/images/birthday/smiley_icon.png" width="100" alt="" />
      </div>

      {/* LETTER BOX */}
      <div className="box__letter">
        <div className="letter__border">
          <div className="letter">
            <div className="title__letter"></div>
            <div className="content__letter">
              <div className="left">
                <img
                  id="heart__letter"
                  src="https://media0.giphy.com/media/c76IJLufpNwSULPk77/giphy.gif"
                  alt=""
                />
                <img className="heart heart_1" src="/images/birthday/heart.png" width="20" alt="" />
                <img className="heart heart_2" src="/images/birthday/heart.png" width="20" alt="" />
                <img className="heart heart_3" src="/images/birthday/heart.png" width="20" alt="" />
                <img className="heart heart_4" src="/images/birthday/heart.png" width="20" alt="" />
              </div>

              <div className="right">
                <div className="love__img">
                  <img
                    src="https://media4.giphy.com/media/W4jyjmIpnw6e38B6Qc/giphy.gif"
                    width="220"
                    alt=""
                  />
                </div>
                <div className="text__letter">
                  <p></p>
                </div>
                <img id="mewmew" src="/images/birthday/mewmew.gif" width="80" alt="" />
              </div>
            </div>
          </div>

          <div className="close">✖</div>
        </div>
      </div>
    </div>
  );
}

export default BirthdayWish;
