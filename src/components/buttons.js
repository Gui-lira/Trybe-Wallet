import React from 'react';

class Buttons extends React.Component {
  render() {
    const { id, excludeButton, editButton} = this.props;
    return (
      <div>
        <button
          id={ id }
          onClick={ excludeButton }
          type="button"
          data-testid="delete-btn"
        >
          Excluir
        </button>
        <button
          id={ id }
          onClick={ editButton }
          type="button"
          data-testid="edit-btn"
        >
          Editar despesa
        </button>
      </div>
    );
  }
}

export default Buttons;
