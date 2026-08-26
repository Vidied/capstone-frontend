import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { useAppSelector } from "../app/hooks";
import { Button, Col, Container, Row } from "react-bootstrap";

export const MenuPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <img src="https://placecats.com/200/100" alt="" />
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <Row>
        <Col md={12}>
          <h1>Menu</h1>
        </Col>
      </Row>
    </Container>
  );
};
