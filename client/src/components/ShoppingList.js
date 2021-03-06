import axios from "axios";
import React, { Component } from "react";
import { Container, ListGroup, Spinner, Col, Row } from "reactstrap";
import ShoppingListItem from "./ShoppingListItem";
import AddItemModal from "./AddItemModal";

class ShoppingList extends Component {
  state = { items: [], isDataFetched: false };

  componentDidMount() {
    axios.get("/items").then(res => {
      if (res.data.success)
        this.setState({
          items: res.data.items,
          isDataFetched: true
        });
      else
        alert(
          "Приносим свои извенения, но произошла при загрузке данных произошла ошибка!"
        );
    });
  }

  handleDeleteItem = id => {
    axios.delete(`/items/${id}`).then(res => {
      if (res.data.success)
        this.setState({
          items: this.state.items.filter(item => item._id !== res.data.item._id)
        });
      else
        alert(
          "Приносим свои извенения, но при удалении данных произошла ошибка!"
        );
    });
  };

  handleAddItem = name => {
    if (name) {
      axios.post("/items", { name }).then(res => {
        if (res.data.success)
          this.setState({ items: [...this.state.items, res.data.item] });
        else
          alert(
            "Приносим свои извенения, но при добавлении данных произошла ошибка!"
          );
      });
    }
  };

  render() {
    if (this.state.isDataFetched) {
      const { items } = this.state;
      return (
        <Container>
          <AddItemModal onAddItem={this.handleAddItem} />
          <ListGroup>
            {items.map(({ _id, name }) => (
              <ShoppingListItem
                key={_id}
                id={_id}
                name={name}
                onDelete={this.handleDeleteItem}
              />
            ))}
          </ListGroup>
        </Container>
      );
    } else {
      return (
        <Container>
          <Row>
            <Col size="mx-auto">
              <div className="text-center">
                <Spinner color="primary" />
              </div>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

export default ShoppingList;
