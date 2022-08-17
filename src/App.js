import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getlocalStorage = () => {
  let list = localStorage.getItem("list")
  if (list) {
    return JSON.parse(localStorage.getItem("list"))
  } else {
    return []
  }
}

function App() {
  const [input, setInput] = useState("");
  const [editSubmit, setEditSubmit] = useState(false);
  const [editID, setEditID] = useState(null);
  const [list, setList] = useState(getlocalStorage());
  const [alert, setAlert] = useState({ show: false, msg: '', type: "" })
  
  const handleForm = (e) => {
    e.preventDefault();
    if (!input) {
      showAlert(true, "danger", "please enter item", )
    }else if (input && editSubmit) {
      setList(list.map((item) => {
        if (item.id === editID) {
          return { ...item, title:input }
        }
        return item
      }));
      setInput("")
      setEditID(null);
      setEditSubmit(false);
      showAlert(true, "success", "item edited");
    } else {
      const newItem = { id: new Date().getTime().toString(), title: input }
      setList([...list, newItem])
      setInput("");
      showAlert( true, "success", "Item added")
    }
  }

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({show, type, msg})
  }

  const clearList = () => {
    showAlert(true, "danger", "All items deleted")
    setList([]);
  }

  const handleDelete = (id) => {
    showAlert(true, "danger", "Item deleted")
    setList(list.filter((item) => item.id !== id))

  }

  const handleEdit = (id) => {
    const specificItem = list.find((item) => item.id === id); 
    setEditSubmit(true);
    setEditID(id);
    setInput(specificItem.title)
  }

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list))
  }, [list])

  return <main>
    <section className='section-center'>
      <div className='grocery-form'>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={ list } />}
        <h3>Grocery Bud</h3>
        <form
          className='form-control'
          onSubmit={handleForm}>
        <input
          className='grocery'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder = "e.g eggs"
        />
          <button
            type="submit" className='submit-btn'>{editSubmit ? "edit" : "submit"}</button>
        </form>
        {list.length > 0 && (
          <div className='grocery-container'>
            <List items={list} handleDelete={handleDelete} handleEdit={ handleEdit} />
            <button
              className='clear-btn'
            onClick={clearList}>Clear Items</button>
        </div>
        )}
      </div>
      
    </section>
  </main>
}

export default App
