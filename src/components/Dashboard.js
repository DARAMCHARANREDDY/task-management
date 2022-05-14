import React, { Component } from 'react';
// import {
//   Button, TextField, Dialog, DialogActions, LinearProgress,
//   DialogTitle, DialogContent, TableBody, Table,
//   TableContainer, TableHead, TableRow, TableCell
// } from '@material-ui/core';
import swal from 'sweetalert';
import axios from 'axios';

import App from './App'
// import { Pagination } from '@material-ui/lab';

const API = axios.create({ baseURL: "http://localhost:5000" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  const id = localStorage.getItem('user_id')
  if (token && id) {
    req.headers.Authorization = `Bearer ${token}`
    req.headers.id = id
  }
  return req;
})
export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      openProductModal: false,
      openProductEditModal: false,
      id: '',
      name: '',
      desc: '',
      price: '',
      discount: '',
      file: '',
      fileName: '',
      page: 1,
      search: '',
      tasks: [],
      pages: 0,
      loading: false
    };
  }

  deleteTask = (taskId) => {
    axios.delete(`/tasks/${taskId}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((res) => {
      this.setState(res.data);
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });

      this.setState({ page: 1 }, () => {
        this.pageChange(null, 1);
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  }
  addTask = (taskToAdd) => {
    API.post('/tasks', JSON.stringify(taskToAdd), {
      headers: {
        'content-type': 'application/json',
      },
    }).then((res) => {
      this.getTasks()
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });

  }
  addEmptyTask = (status) => {
    var tasks = this.state.tasks
    const lastTask = tasks[tasks.length - 1];

    let newTaskId = 1;

    if (lastTask !== undefined) {
      newTaskId = lastTask.id + 1;
    }

    // this.setState((tasks) => [
    //   ...tasks,
    //   {
    //     id: newTaskId,
    //     title: "",
    //     description: "",
    //     urgency: "",
    //     status: status,
    //   },
    // ]);

    this.setState({
      tasks: [...tasks, {
        title: "",
        description: "",
        urgency: "",
        status: status,
      }]
    })
  }

  getTasks = () => {
    axios.get('http://localhost:5000/tasks', {
      headers: {
        'content-type': 'application/json',
      },
    }).then(res => {
      console.log(res?.data)
      this.setState({ tasks: res?.data })
    })
  }
  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/login');
    } else {
      console.log(token)
      this.setState({ token: token }, () => {
        this.getTasks();
      });
    }
  }



  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getTasks();
    });
  }

  logOut = () => {
    localStorage.setItem('token', null);
    this.props.history.push('/');
  }
  render() {
    return (
      <App setState={this.setState} addTask={this.addTask} deleteTask={this.deleteTask} tasks={this.state.tasks} addEmptyTask={this.addEmptyTask} />
    );
  }
}