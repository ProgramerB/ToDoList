import React, {useState, useRef, useEffect} from "react";
import ToDoList from "./ToDoList";
import { v4 as uuidv4 } from 'uuid';
import styles from './App.module.css';
// import {Elements} from '@stripe/react-stripe-js';
// import {loadStripe} from '@stripe/stripe-js';
// import CheckoutForm from "./CheckoutForm"
import Timer from './Timer';

const apiURL = "http://127.0.0.1:5000/"
const localKey = 'toDoApp.toDos'

// const stripePromise = loadStripe('pk_test_51MLg3nSIGyjyh5JWjBYRtroGMlL7kYLS8luj3lN1fBPzF8tEEqDg6hRHGmziEOVS5aXZI17id7iMxkqdRuIeuygi00chJH02ao');

function App() {
  const[toDos, setToDos] = useState([])
  const toDoNameAddRef = useRef()
  const toDoContentAddRef = useRef()

  // const options = {clientSecret: '{{sk_test_51MLg3nSIGyjyh5JWEbXRvyLyhBFSOQ0tNQisVLbhAXBaNfYZAzDU7pw2dIk6cc10a46rzwBmRgiTwMa3wthJM3Zj00lZdObVR4}}'};

  const postData = async (item) => {
    try {
      const newData = {
        "query": 'mutation MyMutation{ createItem( itemInput: { id:"'+item.id+'",name:"'+item.name+'",content:"'+item.content+
        '",status:'+item.status+',image:"'+item.image+'",time:"'+item.time+
        '"} ) { item{ id name content status image time } status } }'
      }
      console.log(newData)
      const response = await fetch(apiURL+"postGraphql", {method:'POST',mode:'cors',body: JSON.stringify(newData),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
      },});
      const data = await response.json();
      console.log(data)
      // setToDos(data.list)
    }
    catch (e) {
      console.log(e)
    }
  }

  const updateData = async (list) => {
    try {
      const response = await fetch(apiURL+"updateGraphql", {method:'POST',mode:'cors',body: JSON.stringify(list),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
      },});
      const data = await response.json();
      // setToDos(data.list)
    }
    catch (e) {
      console.log(e)
    }
  }
  const getData = async (getData) => {
    try {
      const newData = {
        "access_token": getData,
        "query": "query myQuery{name id paid list{ id name status content image time} }"
      }
      const response = await fetch(apiURL+"getGraphql", {method:'POST',mode:'cors',body: JSON.stringify(newData),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
      },});
      const data = await response.json();
      if(data.list == null){
        console.log("new user detected")
        updateData([])
      }
      setToDos(data.list)
      console.log(data.list)
      
    }
    catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    console.log(localStorage.getItem('react-token'))
    getData(localStorage.getItem('react-token'))
  }, [])

  useEffect(()=>{
    const storedToDos = JSON.parse(localStorage.getItem(localKey))
    if (storedToDos) setToDos(prevTodos => [...prevTodos, ...storedToDos]);
  },[])

  useEffect(()=>{
    localStorage.setItem(localKey,JSON.stringify(toDos))
  },[toDos])

  function toggleToDo(id){
    const newToDos = [...toDos]
    const toDo = newToDos.find(toDo => toDo.id === id)
    toDo.status = !toDo.status
    setToDos(newToDos)
    updateData(newToDos)
  }

  function editToDo(id){
    const newToDos = [...toDos]
    const toDo = newToDos.find(toDo => toDo.id === id)
    const name = toDoNameAddRef.current.value
    const content = toDoContentAddRef.current.value
    if (name==='') return
    toDo.name = name
    toDo.content = content
    setToDos(newToDos)
    toDoNameAddRef.current.value=null
    toDoContentAddRef.current.value=null
    updateData(newToDos)
  }

  function removeToDo(id){
    const newToDos = toDos.filter(toDo => toDo.id !== id)
    setToDos(newToDos)
    console.log(newToDos)
    updateData(newToDos)
  }

  function addToDo(e){
      const name = toDoNameAddRef.current.value
      const content = toDoContentAddRef.current.value
      const item = {id: uuidv4().slice(0,8), name:name, status:false, content:content, time:new Date().toLocaleString(), image:"null"}
      if (name==='') return
      setToDos(prevToDos=>{
        return [...prevToDos,item]
      })
      toDoNameAddRef.current.value=null
      toDoContentAddRef.current.value=null
      postData(item)
  }

  return (

    <div className={styles.body}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />

      <h1>TO DO LIST</h1>
      <Timer />
      <div class={styles.notice} >{toDos.filter(toDo => !toDo.status).length} left to do</div>
      <table className={styles.todo}>
        <tr>
          <th>Check</th>
          <th>Title</th>
          <th>Description</th>
          <th>Time</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
        <ToDoList toDos={ toDos } toggleToDo = {toggleToDo} editToDo = {editToDo} removeToDo = {removeToDo}/>
      </table>
      <div className={styles.options}>
        <table class={styles.option}>
          <tr>
            <td>
              <input className={styles.textbox} ref={toDoNameAddRef} type="text" placeholder="Title"/>
            </td>
            <td>
              <input className={styles.textbox} ref={toDoContentAddRef} type="textbox" placeholder="Description"/>
            </td>
            <td>
              <button className={styles.submit_button} onClick={ addToDo }><i class="fa fa-plus-circle" aria-hidden="true"></i></button>
            </td>
            {/* <td>
              <i class="fa fa-picture-o" aria-hidden="true"></i>
              <input type="file" accept="image/*" />
            </td> */}
          </tr>
        </table>
      </div>
    </div>
  );
}

export default App;
