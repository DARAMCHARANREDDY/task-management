import React from 'react';
import swal from 'sweetalert';
import { Button, TextField, Link } from '@material-ui/core';
import axios from 'axios';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  login = () => {

    axios.post('http://localhost:5000/users/login', {
      email: this.state.email,
      password: this.state.password,
    }).then((res) => {
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user_id', res.data.result._id);
        this.props.history.push('/dashboard');
      } else {
        throw new Error("Invalid Username or Password")
      }

    }).catch((err) => {
      swal({
        text: err.toString(),
        icon: "error",
        type: "error"
      });
    });
  }

  render() {
    return (
      <div className='container'>
        <div>
          <h2>Login</h2>
        </div>

        <div>
          <TextField
            id="standard-basic"
            type="email"
            autoComplete="off"
            name="email"
            value={this.state.email}
            onChange={this.onChange}
            placeholder="Email Address"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            placeholder="Password"
            required
          />
          <br /><br />
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            disabled={this.state.email === '' && this.state.password === ''}
            onClick={this.login}
          >
            Login
          </Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link href="/register">
            Register
          </Link>
        </div>
      </div>
    );
  }
}
