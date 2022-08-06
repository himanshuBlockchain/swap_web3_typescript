import React, { useState } from "react";
import logo from "../../../assets/img/logo.webp";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import Button from "../../UI/Button";
import { FaBars } from "react-icons/fa";
import Modal from "../../UI/Modal";
import { walletData } from "../../../data";
const Header = ({ modalRef, openModal, setOpenModal }) => {
  const [toggle, setToggle] = useState(false);
  return (
    <>
      <div className="header_wrapper">
        <div className="container">
          <div className="header_content">
            <div className="left_content">
              <div className="logo">
                <Link to="/">
                  {" "}
                  <img src={logo} alt="logo" />
                </Link>
              </div>
              <div className="hambergar">
                <FaBars onClick={() => setToggle(!toggle)} />
              </div>
              <div
                className={`header_menu ${toggle ? "active_menu" : ""}`}
                ref={modalRef}
              >
                <ul>
                  <li>
                    <Link to="/">
                      Trade{" "}
                      <span>
                        <IoIosArrowDown />
                      </span>
                      <ul className="dropdown_menu">
                        <li className="drop_list">
                          <Link className="drop_link" to="/">
                            Swap
                          </Link>
                        </li>
                        <li className="drop_list">
                          <Link className="drop_link" to="/limit">
                            Limit Order
                          </Link>
                        </li>
                      </ul>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="right_content">
              <div className="connect_wlt_btn" ref={modalRef}>
                <Button type="button" onClick={() => setOpenModal(!openModal)}>
                  Connect to a wallet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal openModal={openModal} modalRef={modalRef}>
        <div className="title">
          <h2>Connect your wallet</h2>
          <span onClick={() => setOpenModal(false)}>&times;</span>
        </div>
        <div className="wallet_img">
          {walletData.map((d) => (
            <div className="img_box" key={d.id}>
              <h3>{d.name}</h3>
              <img src={d.icon} alt="icon" />
            </div>
          ))}
        </div>
      </Modal>
      {
        toggle && <div className="backdrop_effect_blur" onClick={() => setToggle(false)}></div>
      }
    </>
  );
};

export default Header;
