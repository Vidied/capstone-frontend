import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { clearError, loginThunk } from "../features/auth/authSlice";
import { Alert, Container, Spinner } from "react-bootstrap";

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
    <Container>
      {error && (
        <Alert
          variant="danger"
          onClose={() => dispatch(clearError())}
          dismissible
        >
          {error}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="loginEmail">
          <Form.Label>Email di accesso</Form.Label>
          <Form.Control
            required
            type="email"
            placeholder="Inserisci la email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="loginPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <Spinner animation="border" size="sm" className="me-2">
              Autenticazione in corso...
            </Spinner>
          ) : (
            "Accedi"
          )}
        </Button>
      </Form>
    </Container>
  );
};
