import React, { useState, useEffect } from "react";
import "../styles/App.css";
import StatusLine from "./StatusLine";
import swal from 'sweetalert';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasksFromLocalStorage();
  }, []);

  function addEmptyTask(status) {
    const lastTask = tasks[tasks.length - 1];

    let newTaskId = 1;

    if (lastTask !== undefined) {
      newTaskId = lastTask.id + 1;
    }

    setTasks((tasks) => [
      ...tasks,
      {
        id: newTaskId,
        title: "",
        description: "",
        urgency: "",
        status: status,
      },
    ]);
  }

  function addTask(taskToAdd) {

    // setTasks(newTaskList);

    // saveTasksToLocalStorage(newTaskList);
    const formdata = new FormData();
    formdata.append('name', taskToAdd.name);
    formdata.append('desc', taskToAdd.desc);
    formdata.append('discount', taskToAdd.discount);
    formdata.append('price', taskToAdd.price);

    axios.post('https://taskmanagementbk.azurewebsites.net/add-product', {
      headers: {
        'content-type': 'multipart/form-data',
        'token': this.state.token
      }
    }).then((res) => {

      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });
      // this.setState({ name: '', desc: '', discount: '', price: '', file: null, page: 1 }, () => {
      //   this.getProduct();
      // });
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });

  }

  // updateProduct = () => {
  //   const formdata = new FormData();
  //   formdata.append('title', this.state.title);
  //   formdata.append('name', this.state.name);
  //   formdata.append('desc', this.state.desc);
  //   formdata.append('discount', this.state.discount);
  //   formdata.append('price', this.state.price);

  //   axios.post('https://taskmanagementbk.azurewebsites.net/update-product', file, {
  //     headers: {
  //       'content-type': 'multipart/form-data',
  //       'token': this.state.token
  //     }
  //   }).then((res) => {

  //     swal({
  //       text: res.data.title,
  //       icon: "success",
  //       type: "success"
  //     });
  //   }).catch((err) => {
  //     swal({
  //       text: err.response.data.errorMessage,
  //       icon: "error",
  //       type: "error"
  //     });
  //   });

  // }

  function deleteTask(taskId) {
    axios.post('https://taskmanagementbk.azurewebsites.net/delete-product', {
      id: taskId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'token': this.state.token
      }
    }).then((res) => {
      setTasks(res.data);
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

  function moveTask(id, newStatus) {
    let task = tasks.filter((task) => {
      return task.id === id;
    })[0];

    let filteredTasks = tasks.filter((task) => {
      return task.id !== id;
    });

    task.status = newStatus;

    let newTaskList = [...filteredTasks, task];

    setTasks(newTaskList);

    saveTasksToLocalStorage(newTaskList);
  }

  function saveTasksToLocalStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasksFromLocalStorage() {
    let loadedTasks = localStorage.getItem("tasks");

    let tasks = JSON.parse(loadedTasks);

    if (tasks) {
      setTasks(tasks);
    }
  }

  return (
    <div className="App">
      <h1>Task Management</h1>
      <main>
        <section>
          <StatusLine
            tasks={tasks}
            addEmptyTask={addEmptyTask}
            addTask={addTask}
            deleteTask={deleteTask}
            moveTask={moveTask}
            status="Backlog"
          />
          <StatusLine
            tasks={tasks}
            addEmptyTask={addEmptyTask}
            addTask={addTask}
            deleteTask={deleteTask}
            moveTask={moveTask}
            status="In Progress"
          />
          <StatusLine
            tasks={tasks}
            addEmptyTask={addEmptyTask}
            addTask={addTask}
            deleteTask={deleteTask}
            moveTask={moveTask}
            status="Done"
          />
        </section>
      </main>
    </div>
  );
}

export default App;
