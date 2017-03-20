import React, {Component, PropTypes} from 'react';
import * as session from '../session';

class ChangeEmail extends Component {
  state = {
    loading: false,
    password: '',
    newEmail: '',
    loginError: '',
    error: '',
  };

  _handleUpdateInput = e => {
    this.setState({[e.target.name]: e.target.value, error: ''});
  };

  _handleSubmit = async e => {
    e.preventDefault();

    this.setState({loading: true});
    const {whoami} = this.props;

    try {
      await session.login(whoami.email, this.state.password);
    } catch (err) {
      this.setState({loginError: err.message, error: '', loading: false});
      return;
    }

    try {
      await session.changePasswordAndEmail(
        this.state.password,
        this.state.password,
        this.state.newEmail
      );
      window.location = '/app/';
    } catch (err) {
      console.error('Failed to update email', err.stack);
      this.setState({error: err.message, loading: false});
    }
  };

  render () {
    const {error, loginError, loading} = this.state;
    return (
      <form onSubmit={this._handleSubmit}>
        <div className="form-control">
          <label>New Email
            <input type="email"
                   name="newEmail"
                   required
                   onChange={this._handleUpdateInput}
                   placeholder="new@domain.com"/>
          </label>
        </div>
        <div className="form-control">
          <label>Confirm Password {loginError ? <small className="error">({loginError})</small> : null}
            <input type="password"
                   name="password"
                   required
                   autoFocus
                   onChange={this._handleUpdateInput}
                   placeholder="••••••••••"/>
          </label>
        </div>
        {error ? <div className="form-control error">** {error}</div> : null}
        <div className="form-control padding-top-sm right">
          {loading ?
            <button type="button" disabled className="button">Updating...</button> :
            <button type="submit" className="button">Update Password</button>
          }
        </div>
      </form>
    )
  }
}

ChangeEmail.propTypes = {
  whoami: PropTypes.shape({
    email: PropTypes.string.isRequired,
  }).isRequired
};

export default ChangeEmail;
