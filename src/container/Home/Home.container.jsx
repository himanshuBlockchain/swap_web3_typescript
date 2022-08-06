import React, { useRef, useState } from "react";
import Header from "../../component/Shared/Header/Header";
import { FiSettings } from "react-icons/fi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { HiArrowNarrowDown } from "react-icons/hi";
// import meta from "../../assets/walletImg/metamask.webp";
import coin from "../../assets/walletImg/coinbase.webp";
import port from "../../assets/walletImg/portis.webp";
import Button from "../../component/UI/Button";
import { useClickOutside } from "../../hooks/useClickOutside";
import { FaPercent } from "react-icons/fa";
import Modal from "../../component/UI/Modal";
import { tokenList } from "../../data";
// import { tokenList } from "../../../data";

const Home = () => {
  const [searchVal, setSearchVal] = useState("");
  // const handleChange = (e) => {};
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  // wallet connect modal
  const [openModal, setOpenModal] = useState(false);
  const modalRef = useRef(null);
  useClickOutside(modalRef, () => setOpenModal(false));
  // token connect modal
  const [openTokenModal, setTokenOpenModal] = useState(false);
  const tokenModalRef = useRef(null);
  useClickOutside(tokenModalRef, () => setTokenOpenModal(false));
  // swap modal
  const [openSwapModal, setOpenSwapModal] = useState(false);
  const swapModalRef = useRef(null);
  useClickOutside(swapModalRef, () => setOpenSwapModal(false));
  // setting popuu
  const [openSetting, setOpenSetting] = useState(false);
  const settingRef = useRef(null);
  useClickOutside(settingRef, () => setOpenSetting(false));
  // modal detect
  const [modalDetect, setModalDetect] = useState("");
  // store token object
  const [tokenIdFrom, setTokenIdFrom] = useState({});
  const [tokenIdTo, setTokenIdTo] = useState({});
  console.log("token id from", tokenIdFrom);
  console.log("token id to", tokenIdTo);
  // Function to switch between two currency
  const flip = () => {
    var temp = tokenIdFrom;
    setTokenIdFrom(tokenIdTo);
    setTokenIdTo(temp);
  };
  return (
    <>
      <Header
        modalRef={modalRef}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
      <div className="home_page_container">
        <div className="container">
          <div className="home_container">
            <div className="home_form">
              <form onSubmit={handleSubmit}>
                <div className="form_top">
                  <span className="settings" ref={settingRef}>
                    <FiSettings onClick={()=>setOpenSetting(!openSetting)} />
                    {
                      openSetting && <div className="setting_form">
                      <div className="transaction_setting">
                        <div className="title">
                          <span>Transaction Settings</span>
                        </div>
                        <div className="form_group">
                          <label for="Slippage tolerance">
                            Slippage tolerance
                          </label>
                          <div
                            style={{
                              display: "inline-flex",
                              width: "100%",
                              position: "relative",
                            }}
                          >
                            <input
                              type="text"
                              name="tolerance"
                              placeholder="0.50"
                            />
                            <div className="auto_button">Auto</div>
                            <span>
                              <FaPercent />
                            </span>
                          </div>
                        </div>
                        <div
                          className="form_group"
                          style={{ marginTop: "5px" }}
                        >
                          <label for="Slippage tolerance">
                            Transaction deadline
                          </label>
                          <div
                            style={{
                              display: "inline-flex",
                              width: "100%",
                              position: "relative",
                            }}
                          >
                            <input
                              type="text"
                              name="tolerance"
                              placeholder="30"
                            />
                            <div className="auto_button deadline_time">
                              Minutes
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="interface_setting">
                        <div className="title">
                          <span> Interface Settings</span>
                        </div>
                        <div
                          className="form_group"
                          style={{
                            marginTop: "5px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <label for="Slippage tolerance">
                            Toggle expert mode
                          </label>
                          <div>
                            <input type="checkbox" name="expert_mode" />
                          </div>
                        </div>
                        <div
                          className="form_group"
                          style={{
                            marginTop: "5px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <label for="Slippage tolerance">
                            Disable multihops
                          </label>
                          <div>
                            <input type="checkbox" />
                          </div>
                        </div>
                        <div
                          className="form_group"
                          style={{
                            marginTop: "5px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <label for="Slippage tolerance">
                            SushiGuard Protector
                          </label>
                          <div>
                            <input type="checkbox" />
                          </div>
                        </div>
                      </div>
                    </div>
                    }
                  </span>
                </div>
                <div className="swap_box_top">
                  <div className="swap_box">
                    <div
                      className="select_token"
                      onClick={() => {
                        setTokenOpenModal(!openTokenModal);
                        setModalDetect("from");
                      }}
                    >
                      <img src={tokenIdFrom?.icon || coin} alt="logo" />
                      <span className="token_name">
                        {tokenIdFrom?.name || "META"}
                      </span>
                      <MdOutlineKeyboardArrowDown />
                    </div>
                    <div className="token_balance">
                      <div className="value">
                        <input type="number" placeholder="0.00" />
                        <label htmlFor="value">~$12547</label>
                      </div>
                      <span>Balance: 0</span>
                    </div>
                  </div>
                  <span className="down_arrow">
                    <HiArrowNarrowDown
                      onClick={() => {
                        flip();
                      }}
                    />
                  </span>
                </div>
                <div className="swap_box_top">
                  <div className="swap_box">
                    <div
                      className="select_token"
                      onClick={() => {
                        setTokenOpenModal(!openModal);
                        setModalDetect("to");
                      }}
                    >
                      <img src={tokenIdTo?.icon || port} alt="logo" />
                      <span className="token_name">
                        {tokenIdTo?.name || "PORTIS"}
                      </span>
                      <MdOutlineKeyboardArrowDown />
                    </div>
                    <div className="token_balance">
                      <div className="value">
                        <input type="number" placeholder="0.00" />
                        <label htmlFor="value">~$12547</label>
                      </div>
                      <span>Balance: 0</span>
                    </div>
                  </div>
                </div>
                <div className="max_field">
                  <div className="field" style={{ marginRight: "5px" }}>
                    <label htmlFor="fee">Max Fee</label>
                    <div className="field_value">
                      <input type="number" placeholder="47.5487" />
                      <label htmlFor="gwei">GWEI</label>
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="fee">Max Priority Fee</label>
                    <div className="field_value">
                      <input type="number" placeholder="1.5" />
                      <label htmlFor="gwei">GWEI</label>
                    </div>
                  </div>
                </div>
                <div className="compare_value">
                  <p>
                    1 SUSHI = 91140 ETH <span>($1.40954)</span>
                  </p>
                </div>
                <div className="connect_btn">
                  <Button
                    onClick={() => setOpenModal(!openTokenModal)}
                    type="button"
                  >
                    Connect to a wallet
                  </Button>
                </div>
                <div className="connect_btn">
                  <Button
                    onClick={() => setOpenSwapModal(!openSwapModal)}
                    type="button"
                  >
                    Swap
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Modal openModal={openTokenModal} modalRef={tokenModalRef}>
        <div className="title">
          <h2>Select a token</h2>
          <span onClick={() => setTokenOpenModal(false)}>&times;</span>
        </div>
        <div className="search_bar">
          <input
            type="text"
            name="search"
            placeholder="Search name or paste address"
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </div>
        <div className="token_img">
          {tokenList
            .filter((val) => {
              if (searchVal === "") {
                return val;
              } else if (
                val.name.toLowerCase().includes(searchVal.toLowerCase())
              ) {
                return val;
              }
            })
            .map((d) => (
              <div
                className="img_box"
                key={d.id}
                onClick={() => {
                  if (modalDetect === "from") {
                    setTokenIdFrom(d);
                  } else if (modalDetect === "to") {
                    setTokenIdTo(d);
                  }
                  setTokenOpenModal(false);
                }}
              >
                <img src={d.icon} alt="icon" />
                <div className="label">
                  <p>{d.title}</p>
                  <h3>{d.name}</h3>
                </div>
              </div>
            ))}
        </div>
      </Modal>
      {/* swap modal */}
      <Modal openModal={openSwapModal} modalRef={swapModalRef}>
        <div className="title">
          <h2>Confirm Swap</h2>
          <span onClick={() => setOpenSwapModal(false)}>&times;</span>
        </div>
        <div className="confirm_swap_box">
          <div className="token_balance">
            <div className="value">
              <input type="number" placeholder="0.00" />
              <div className="select_token">
                <img src={port} alt="logo" />
                <span className="token_name">{"PORTIS"}</span>
              </div>
            </div>
          </div>
          <label htmlFor="value">~$12547</label>
        </div>
        <div className="confirm_swap_box">
          <div className="token_balance">
            <div className="value">
              <input type="number" placeholder="0.00" />
              <div className="select_token">
                <img src={port} alt="logo" />
                <span className="token_name">{"PORTIS"}</span>
              </div>
            </div>
          </div>
          <label htmlFor="value">~$12547</label>
        </div>
        <div className="compare_value">
          <p>
            1 SUSHI = 91140 ETH <span>($1.40954)</span>
          </p>
        </div>
        <div className="connect_btn">
          <Button
            // onClick={() => setOpenSwapModal(!openSwapModal)}
            type="button"
          >
            Swap
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Home;
