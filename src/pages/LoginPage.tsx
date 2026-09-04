import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { clearError, loginThunk } from "../features/auth/authSlice";
import { Alert, Container, Spinner, Row, Col, Card } from "react-bootstrap";

export const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(clearError());
      navigate("/menu");
    }
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(clearError());
    await dispatch(loginThunk({ email, password }));
  };

  return (
    <Container
      fluid
      className="min-vh-100 d-flex justify-content-center pt-5"
      style={{ backgroundColor: "#f7f4ee", color: "#2b2b2b" }}
    >
      <Row
        className="w-100 justify-content-center"
        style={{ height: "fit-content" }}
      >
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card
            className="border-0 shadow-sm p-5 mt-4"
            style={{ backgroundColor: "#ffffff", borderRadius: "12px" }}
          >
            <h2
              className="fw-bold mb-4 text-center"
              style={{ color: "#2b2b2b" }}
            >
              Accesso
            </h2>

            {error && (
              <Alert
                variant="danger"
                onClose={() => dispatch(clearError())}
                dismissible
                className="mb-4"
              >
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4" controlId="loginEmail">
                <Form.Label className="fw-semibold text-secondary small text-uppercase">
                  Email di accesso
                </Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="Inserisci la email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #000000",
                    color: "#000000",
                    height: "48px",
                  }}
                  className="shadow-none"
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="loginPassword">
                <Form.Label className="fw-semibold text-secondary small text-uppercase">
                  Password
                </Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #000000",
                    color: "#000000",
                    height: "48px",
                  }}
                  className="shadow-none"
                />
              </Form.Group>

              <Button
                variant="dark"
                type="submit"
                disabled={loading}
                className="w-100 py-3 fw-bold mt-2"
              >
                {loading ? (
                  <Spinner
                    animation="border"
                    size="sm"
                    className="me-2"
                  ></Spinner>
                ) : (
                  "Accedi"
                )}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
