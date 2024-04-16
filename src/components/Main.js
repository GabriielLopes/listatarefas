import React, { Component } from "react";
import Swal from "sweetalert2";
import Form from './Form/index';
import Tarefas from "./Tarefas/index";

import './Main.css';


export default class Main extends Component {
  state = {
    novaTarefa: '',
    tarefas: [],
    index: -1,
  }

  componentDidMount() {
    const tarefas = JSON.parse(localStorage.getItem('tarefas'));

    if (!tarefas) return
    this.setState({ tarefas });
  }

  componentDidUpdate(prevProps, prevState) {
    const { tarefas } = this.state;

    if (tarefas === prevState.tarefas) return;
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  }

  handleChange = (event) => {
    this.setState({
      novaTarefa: event.target.value,
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { tarefas, index } = this.state;
    let { novaTarefa } = this.state;
    novaTarefa = novaTarefa.trim();

    if (tarefas.indexOf(novaTarefa) !== -1) {
      Swal.fire({
        title: "Ops!",
        text: "Essa tarefa já existe!",
        confirmButtonColor: "#3085d6",
        icon: "info"
      });
      return
    }
    const novasTarefas = [...tarefas];

    if (novaTarefa === '') {

      Swal.fire({
        title: "ERRO!",
        text: "Você precisa escrever algo!",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
      return

    }

    if (index === -1) {
      this.setState({
        tarefas: [...novasTarefas, novaTarefa],
        novaTarefa: '',
      })
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "Tarefa adicionada!"
      });

    } else {
      novasTarefas[index] = novaTarefa;

      this.setState({
        tarefas: [...novasTarefas],
        index: -1,
      })
    }
  }

  handleDelete = (event, index) => {
    Swal.fire({
      title: "Você tem certeza?",
      text: "Você não poderá resgatar a tarefa!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancelar',
      confirmButtonText: "Sim, apagar!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Apagado!",
          text: "A tarefa foi apagada.",
          icon: "success"
        });
        const { tarefas } = this.state;
        const novasTarefas = [...tarefas];
        novasTarefas.splice(index, 1);

        this.setState({
          tarefas: [...novasTarefas],
        })
      }
    });



  }

  handleEdit = (e, index) => {
    const { tarefas } = this.state;

    Swal.fire({
      title: "Editar tarefa",
      input: "text",
      inputLabel: "Edite a sua tarefa: ",
      inputValue: tarefas[index],
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const novaTarefa = result.value;
        // Atualizar a lista de tarefas com a novaTarefa
        Swal.fire({
          title: 'Sucesso!',
          text: "A tarefa foi editada com sucesso!",
          icon: 'success'
        })
        this.setState((prevState) => ({
          tarefas: [...prevState.tarefas.slice(0, index), novaTarefa, ...prevState.tarefas.slice(index + 1)],
        }));
      } else {
        return
      }
    });
  };

  render() {
    const { novaTarefa, tarefas } = this.state;

    return (
      <div className="main">
        <h1>Lista de tarefas</h1>
        <Form
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          novaTarefa={novaTarefa}
        />
        <Tarefas
          tarefas={tarefas}
          handleEdit={this.handleEdit}
          handleDelete={this.handleDelete}
        />
      </div>
    );
  }
}
