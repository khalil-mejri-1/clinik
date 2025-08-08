import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("login") === "true");
  }, []);



  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    localStorage.removeItem("login");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="bloc_navbar">
      <div className="navbar">
        <Link to="/" className="titre">
          <i
            className="pi pi-heart"
            style={{ fontSize: "1.2rem", marginRight: "5px", marginTop: "5px" }}
          ></i>
  {isLoggedIn ? (
  <span>Foulen fouleni</span>
) : (
  <span>MediCare Clinic</span>
)}

        </Link>

        <div className="bloc_links">
          <NavLink
            className={({ isActive }) => (isActive ? "link active" : "link")}
            to="/"
          >
            <i
              className="pi pi-home"
              style={{ fontSize: "1rem", marginRight: "5px" }}
            ></i>
            <span>Home</span>
          </NavLink>

          <NavLink
  className={({ isActive }) =>
    isActive && isLoggedIn ? "link active" : "link"
  }
  to={isLoggedIn ? "/add" : "/login"}
  onClick={() => {
    if (!isLoggedIn) {
      localStorage.setItem("redirectAfterLogin", "/add");
    }
  }}
>
  <i
    className="pi pi-user-plus"
    style={{ fontSize: "1rem", marginRight: "5px" }}
  ></i>
  <span>Register Patient</span>
</NavLink>
   {isLoggedIn && (
    <>
     <NavLink
                className={({ isActive }) =>
                  isActive ? "link active" : "link"
                }
                to="/Dashboard"
              >
                 <i
                  className="pi pi-users"
                  style={{ fontSize: "1rem", marginRight: "5px", fontWeight:"500"}}
                ></i>
                <span>Dashboard</span>
              </NavLink>

    </>
   )}
          {!isLoggedIn && (
            <>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "link active" : "link"
                }
                to="/login"
              >
                <i
                  className="pi pi-sign-in"
                  style={{ fontSize: "0.9rem", marginRight: "5px" }}
                ></i>
                <span>Staff Login</span>
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  isActive ? "link active" : "link"
                }
                to="/create-account"
              >
                <i
                  className="pi pi-user-edit"
                  style={{ fontSize: "0.9rem", marginRight: "5px" }}
                ></i>
                <span>Create Account</span>
              </NavLink>
            </>
          )}

          {isLoggedIn && (
            <button  size="sm" style={{backgroundColor:"transparent ", color:"red", fontWeight:"600", border:"black solid 0px", fontSize:"15px"}} onClick={handleLogout}>
         <i className="pi pi-sign-out" style={{ fontSize: '0.8rem',marginLeft:"10px" }}></i>     Logout 

            </button>
          )}
        </div>

        <div className="button_links_phone">
          <Button variant="primary" onClick={handleShow}>
            <i className="pi pi-bars" style={{ fontSize: "1rem" }}></i>
          </Button>
        </div>

        <Offcanvas show={show} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <Link to="/" className="titre">
                <i
                  className="pi pi-heart"
                  style={{
                    fontSize: "1.2rem",
                    marginRight: "5px",
                    marginTop: "5px",
                  }}
                ></i>
                <span>MediCare Clinic</span>
              </Link>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <hr />
            <br />
            <div className="bloc_links_offcanvas">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "link active" : "link"
                }
                to="/"
              >
                <i
                  className="pi pi-home"
                  style={{ fontSize: "0.9rem", marginRight: "5px" }}
                ></i>
                <span>Home</span>
              </NavLink>
              <br />
              <br />
        <NavLink
  className={({ isActive }) =>
    isActive && isLoggedIn ? "link active" : "link"
  }
  to={isLoggedIn ? "/add" : "/login"}
  onClick={() => {
    if (!isLoggedIn) {
      localStorage.setItem("redirectAfterLogin", "/add");
    }
  }}
>
  <i
    className="pi pi-user-plus"
    style={{ fontSize: "0.9rem", marginRight: "5px" }}
  ></i>
  <span>Register Patient</span>
</NavLink>


              <br />
              <br />

              {!isLoggedIn && (
                <>
              <NavLink
  className={({ isActive }) => (isActive ? "link active" : "link")}
  to="/login"
  onClick={() => {
    localStorage.setItem("redirectAfterLogin", "/add"); // نريد بعد الدخول الذهاب لتسجيل المريض
  }}
>
  <i className="pi pi-sign-in" style={{ fontSize: "0.9rem", marginRight: "5px" }}></i>
  <span>Staff Login</span>
</NavLink>

                  <br />
                  <br />
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "link active" : "link"
                    }
                    to="/create-account"
                  >
                    <i
                      className="pi pi-user-edit"
                      style={{ fontSize: "0.9rem", marginRight: "5px" }}
                    ></i>
                    <span>Create Account</span>
                  </NavLink>
                </>
              )}
 {isLoggedIn && (
    <>
     <NavLink
                className={({ isActive }) =>
                  isActive ? "link active" : "link"
                }
                to="/Dashboard"
              >
                 <i
                  className="pi pi-users"
                  style={{ fontSize: "1rem", marginRight: "5px", fontWeight:"500"}}
                ></i>
                <span>Dashboard</span>
              </NavLink>

    </>
   )}
<br /><br />
          {isLoggedIn && (
            <button  size="sm" style={{backgroundColor:"transparent ", color:"red", fontWeight:"600", border:"black solid 0px", fontSize:"15px", marginLeft:"2px"}} onClick={handleLogout}>
         <i className="pi pi-sign-out" style={{ fontSize: '0.8rem',marginLeft:"10px" }}></i>     Logout 

            </button>
          )}
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </div>
  );
};

export default Navbar;
