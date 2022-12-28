import React from 'react'
import ToDo from './ToDo'

export default function ToDoList({ toDos, toggleToDo, editToDo, removeToDo}) {
  return (
      toDos.map(toDo => {
        return <ToDo key={toDo.id} toDo={toDo} toggleToDo = {toggleToDo} editToDo={editToDo} removeToDo={removeToDo} />
      })
  )
}
