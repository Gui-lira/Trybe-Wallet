import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCurrencies, sendExpenses, excludeAction } from '../actions';
import WalletHeader from '../components/walletHeader';
import WalletForm from '../components/walletForm';
import WalletTable from '../components/Table';

const tagStr = 'Alimentação';

class Wallet extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: tagStr,
      id: 0,
      edit: false,
      editId: 0,
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentDidMount() {
    const { getApi } = this.props;
    getApi();
  }

  handleInput(event) {
    const { id, value } = event.target;
    this.setState({
      [id]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { sendExpense, exclude } = this.props;
    const { edit, editId } = this.state;
    if (edit) {
      const state = { ...this.state };
      state.id = Number(editId);
      exclude(editId);
      sendExpense(state);
      this.setState(() => ({
        value: '',
        description: '',
        currency: 'USD',
        method: 'Dinheiro',
        tag: tagStr,
        edit: false,
      }));
    } else {
      const state = { ...this.state };
      sendExpense(state);
      this.setState((pastState) => ({
        value: '',
        description: '',
        currency: 'USD',
        method: 'Dinheiro',
        tag: tagStr,
        id: pastState.id + 1,
      }));
    }
  }

  handleTotal() {
    const { wallet: { expenses } } = this.props;
    return expenses.reduce((acumulator, element) => {
      const value = Number(element.value);
      const currence = Number(element.exchangeRates[element.currency].ask);
      const total = Number((value * currence).toFixed(2));
      return acumulator + total;
    }, 0);
  }

  handleEdit(event) {
    const { id } = event.target;
    const { wallet: { expenses } } = this.props;
    const expense = expenses.find((element) => element.id === Number(id));
    const { value, description, currency, method, tag } = expense;
    this.setState({
      value,
      description,
      currency,
      method,
      tag,
      editId: id,
      edit: true,
    });
  }

  render() {
    const { user: { email }, wallet: { currencies } } = this.props;
    const { value, description, currency, method, tag } = this.state;
    return (
      <div>
        <WalletHeader email={ email } total={ this.handleTotal() } currence="BRL" />
        <WalletForm
          currencies={ currencies }
          value={ value }
          description={ description }
          currence={ currency }
          method={ method }
          tag={ tag }
          onChange={ this.handleInput }
          onSubmit={ this.handleSubmit }
        />
        <WalletTable editButton={ this.handleEdit } />
      </div>);
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  wallet: state.wallet,
});

const mapDispatchToProps = (dispatch) => ({
  getApi: () => dispatch(getCurrencies()),
  sendExpense: (obj) => dispatch(sendExpenses(obj)),
  exclude: (str) => dispatch(excludeAction(str)),
});

Wallet.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
  }).isRequired,
  getApi: PropTypes.func.isRequired,
  sendExpense: PropTypes.func.isRequired,
  wallet: PropTypes.shape({
    currencies: PropTypes.arrayOf(PropTypes.string),
    expenses: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
