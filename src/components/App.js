import React, { useState, useEffect } from "react";
import "../styles/App.css";
import StatusLine from "./StatusLine";
import swal from 'sweetalert';


function App({ setState, tasks, addTask, deleteTask, addEmptyTask}) {

 
  console.log(tasks)
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


  function moveTask(id, newStatus) {
    let task = tasks.filter((task) => {
      return task.id === id;
    })[0];

    let filteredTasks = tasks.filter((task) => {
      return task.id !== id;
    });

    task.status = newStatus;

    let newTaskList = [...filteredTasks, task];

    setState(newTaskList);

    saveTasksToLocalStorage(newTaskList);
  }

  function saveTasksToLocalStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
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
