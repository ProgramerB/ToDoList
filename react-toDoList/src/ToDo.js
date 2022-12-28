import React from 'react'
import styles from './App.module.css';
export default function ToDO( {toDo, toggleToDo, editToDo, removeToDo} ) {

    function toDoClick(){
        toggleToDo(toDo.id)
    }

    function toDoEdit(){
        editToDo(toDo.id)
    }

    function toDoRemove(){
        removeToDo(toDo.id)
    }

  return (
    <tr>
        <td>
            <input className={styles.checkbox_custom} type="checkbox" checked={toDo.status} onChange={toDoClick} />
        </td>
        <td>
            {toDo.name}
        </td>
        <td>
            {toDo.content}
        </td>
        <td>
            {toDo.time}
        </td>
        <td>
            <button className={styles.submit_button} onClick={toDoEdit}><i class="fa fa-pencil" aria-hidden="true"></i></button>
        </td>
        <td>
            <button className={styles.submit_button} onClick={toDoRemove}><i class="fa fa-trash-o" aria-hidden="true"></i></button>
        </td>
    </tr>
  )
}
