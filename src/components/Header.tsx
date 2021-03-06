import React from "react";
import { UserHelper, NavItems } from "./";
import { Link } from "react-router-dom";
import { Col, Container } from "react-bootstrap";

export const Header: React.FC = () => {
  const { firstName, lastName }  = UserHelper.user;
  const userName = `${firstName} ${lastName}`;

  const toggleMenuItems = () => {
    let menuNav = document.getElementById("nav-menu");
    let listItems = Array.from(menuNav.children);
    listItems.forEach((_, i) => {
      if (i < (userName.length <= 5 ? 3 : userName.length < 24 ? 2 : 1)) {
        listItems[i].classList.add("d-md-none");
      } else if (
        i < (userName.length <= 5 ? 5 : userName.length < 24 ? 4 : 3)
      ) {
        if (listItems[i].id === "logout") return;
        listItems[i].classList.add("d-lg-none");
        return;
      } else if (i < (userName.length < 24 ? 6 : 5)) {
        listItems[i].classList.add("d-xl-none");
      }
    });
  };

  React.useEffect(() => { toggleMenuItems(); });

  return (
    <>
      <div id="navbar" className=" fixed-top">
        <Container>
          <div className="d-flex justify-content-between">
            <div>
              <div className="navbar-brand">
                <img src="/images/logo.png" alt="logo" />
              </div>
            </div>

            <Col className="d-none d-md-block" style={{ borderLeft: "2px solid #EEE", borderRight: "2px solid #EEE", maxWidth: "703px", margin: "0 15px" }}>
              <ul id="nav-main" className="nav nav-fill d-flex overflow-hidden" style={{ height: "55px" }}>
                <NavItems prefix="main" />
              </ul>
            </Col>

            <div className="d-flex align-items-center" id="navRight">
              <a href="about:blank" id="userMenuLink" data-toggle="collapse" data-target="#userMenu" aria-controls="navbarToggleMenu" aria-expanded="false" aria-label="Toggle navigation">
                <img src="/images/sample-profile.png" alt="user" />
                {userName} <i className="fas fa-caret-down"></i>
              </a>
            </div>
          </div>
        </Container>
        <div className="container collapse" id="userMenu">
          <div>
            <ul id="nav-menu" className="nav d-flex flex-column">
              <NavItems />
              <Link id="logout" to="/logout"><i className="fas fa-lock"></i> Logout</Link>
            </ul>
          </div>
        </div>
      </div>
      <div id="navSpacer"></div>
    </>
  );
};
