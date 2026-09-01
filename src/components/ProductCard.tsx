import { Badge, Card, Col } from "react-bootstrap";
import type { Product } from "../interfaces/Product";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  //Controlli se un prodotto ha la lista ingredienti o descrizione(le bevande non hanno gli ingredienti)
  const hasIngredients =
    product.ingredientNames && product.ingredientNames.length > 0;
  const hasDescription =
    product.description && product.description.trim() !== "";

  return (
    <Col>
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {product.categoryName}
          </Card.Subtitle>
        </Card.Body>
      </Card>
      {hasIngredients && (
        <Card>
          <small>Ingredienti:</small>
          <div>
            {product.ingredientNames?.map((ingredient, index) => (
              <Badge key={index}>{ingredient}</Badge>
            ))}
          </div>
        </Card>
      )}
      {hasDescription && <Card.Text>{product.description}</Card.Text>}
    </Col>
  );
};
