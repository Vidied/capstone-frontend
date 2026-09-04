import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

//I link sono tutti vuoti al momento siccome ancora non è stato sviluppato per l'uso in ambito IRL

export const Footer = () => {
  return (
    <footer
      className="text-light py-5 border-top border-dark"
      style={{ backgroundColor: "#f7f4ee", color: "#1a1a1a" }}
    >
      <Container>
        <Row className="gy-4">
          <Col lg={4} md={6}>
            <h5
              className="mb-3"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                color: "#1a1a1a",
              }}
            >
              Pizzeria La Storia
            </h5>
            <p className="small mb-2" style={{ color: "#555555" }}>
              Tradizione, passione e alta qualità in ogni pizza. Impasti a lunga
              lievitazione e ingredienti selezionati.
            </p>
            <p className="small mb-0" style={{ color: "#555555" }}>
              P.IVA: 01234567890 | Tel: +39 0761 000000
            </p>
          </Col>

          <Col lg={4} md={6}>
            <h6
              className="text-uppercase small fw-bold mb-3"
              style={{ color: "#1a1a1a" }}
            >
              Informazioni Legali
            </h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-2">
                <Link
                  to="/privacy-policy"
                  className="text-decoration-none"
                  style={{ color: "#555555" }}
                >
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/cookie-policy"
                  className="text-decoration-none"
                  style={{ color: "#555555" }}
                >
                  Cookie Policy
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/terms"
                  className="text-decoration-none"
                  style={{ color: "#555555" }}
                >
                  Termini e Condizioni
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={4} md={12}>
            <h6
              className="text-uppercase small fw-bold mb-3"
              style={{ color: "#1a1a1a" }}
            >
              Avvertenze Allergeni
            </h6>
            <p
              className="small"
              style={{ lineHeight: "1.4", color: "#555555" }}
            >
              I prodotti preparati in questo esercizio possono contenere o
              essere contaminati da allergeni (cereali contenenti glutine,
              crostacei, uova, pesce, arachidi, soia, latte, frutta a guscio,
              sedano, senape, sesamo, solfiti, lupini, molluschi). Per qualsiasi
              informazione su intolleranze o allergie, si prega di rivolgersi al
              personale prima dell'ordine.
            </p>
          </Col>
        </Row>

        <hr className="my-4 border-dark opacity-25" />

        <div
          className="d-flex flex-column flex-md-row justify-content-between align-items-center small"
          style={{ color: "#555555" }}
        >
          <p className="mb-2 mb-md-0">
            &copy; {new Date().getFullYear()} Pizzeria La Storia. Tutti i
            diritti riservati.
          </p>
          <p className="mb-0">Sviluppato per la ristorazione.</p>
        </div>
      </Container>
    </footer>
  );
};
