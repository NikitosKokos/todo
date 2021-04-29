import React from 'react';
import { AddList, List, Tasks } from "./components";
import axios from 'axios';
import Popup from './components/Popup';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Route, useHistory, useLocation  } from "react-router-dom";


function App() {
  const [popup, setPopup] = React.useState([]);
  const [colors, setColors] = React.useState(null);
  const [lists, setLists] = React.useState(null);
  const [activeItem, setActiveItem] = React.useState(null);
  let history = useHistory();
  let location = useLocation();

  React.useEffect(() => {
    axios
      .get('http://localhost:3001/lists?_expand=color&_embed=tasks')
      .then(({ data }) => {
        setLists(data);
      });
    axios.get('http://localhost:3001/colors').then(({ data }) => {
      setColors(data);
    });
  }, []);
 
  const addPopup = (p) =>{
    if(popup.every((el) => el.id !== p.id) || popup.length === 0){
      setPopup([...popup, p]);
    }
  }

  const removePopup = id => {
    setPopup(popup.filter(p => p.id !== id && (p.listId ? p.listId !== id: true)));
  }

  const onAddList = (obj) => {
    setLists([ ...lists, obj]);
  }

  const onAddTask = (listId, obj) => {
    const newList = lists.map(item => {
      if(item.id === listId){
        item.tasks = [...item.tasks, obj];
      }
      return item;
    })
    setLists(newList);
  }

  const onRemoveTask = (listId, taskId) => {
    const newList = lists.map(item => {
      if(item.id === listId){
        item.tasks = item.tasks.filter(task => task.id !== taskId);
      }
      return item;
    });
    setLists(newList);
  }

  const onAddColor = (obj) => {
    setColors([ ...colors, obj]);
  }

  const onEditITitle = (id, title) => {
    setLists(lists.map(item => {
      if(item.id === id) item.name = title;
      return item;
    }));
  }

  const onEditTask = (listId, taskId, text) => {
    const newList = lists.map(item => {
      if(item.id === listId){
        item.tasks = item.tasks.map(task => {
          if(task.id === taskId){
            task.text = text;
          }
          return task;
        });
      }
      return item;
    });
    setLists(newList);
  }

  const onCopleteTask = (listId, taskId, completed) => {
    const newList = lists.map(item => {
      if(item.id === listId){
        item.tasks = item.tasks.map(task => {
          if(task.id === taskId){
            task.completed = completed;
          }
          return task;
        });
      }
      return item;
    });
    setLists(newList);
  }


  React.useEffect(() => {
    const listId = history.location.pathname.split('lists/')[1];
    if(lists){
      const list = lists.find(list => list.id === Number(listId));
      setActiveItem(list);
    }
  }, [lists, history.location.pathname])

  return (
    <div className="todo">
      <div className="todo__sidebar">
      <div className="todo__lists">
        <List
          onClickItem={item => history.push('/')}
          items={[
            {
              id: 1,
              name: "Все задачи",
              icon: (
                <svg width="14" height="12" viewBox="0 0 14 12" fill="#7C7C7C" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.96 5.10001H5.74001C5.24321 5.10001 5.20001 5.50231 5.20001 6.00001C5.20001 6.49771 5.24321 6.90001 5.74001 6.90001H10.96C11.4568 6.90001 11.5 6.49771 11.5 6.00001C11.5 5.50231 11.4568 5.10001 10.96 5.10001ZM12.76 9.60001H5.74001C5.24321 9.60001 5.20001 10.0023 5.20001 10.5C5.20001 10.9977 5.24321 11.4 5.74001 11.4H12.76C13.2568 11.4 13.3 10.9977 13.3 10.5C13.3 10.0023 13.2568 9.60001 12.76 9.60001ZM5.74001 2.40001H12.76C13.2568 2.40001 13.3 1.99771 13.3 1.50001C13.3 1.00231 13.2568 0.600006 12.76 0.600006H5.74001C5.24321 0.600006 5.20001 1.00231 5.20001 1.50001C5.20001 1.99771 5.24321 2.40001 5.74001 2.40001ZM2.86001 5.10001H1.24001C0.743212 5.10001 0.700012 5.50231 0.700012 6.00001C0.700012 6.49771 0.743212 6.90001 1.24001 6.90001H2.86001C3.35681 6.90001 3.40001 6.49771 3.40001 6.00001C3.40001 5.50231 3.35681 5.10001 2.86001 5.10001ZM2.86001 9.60001H1.24001C0.743212 9.60001 0.700012 10.0023 0.700012 10.5C0.700012 10.9977 0.743212 11.4 1.24001 11.4H2.86001C3.35681 11.4 3.40001 10.9977 3.40001 10.5C3.40001 10.0023 3.35681 9.60001 2.86001 9.60001ZM2.86001 0.600006H1.24001C0.743212 0.600006 0.700012 1.00231 0.700012 1.50001C0.700012 1.99771 0.743212 2.40001 1.24001 2.40001H2.86001C3.35681 2.40001 3.40001 1.99771 3.40001 1.50001C3.40001 1.00231 3.35681 0.600006 2.86001 0.600006Z" fill="#7C7C7C"/>
                    </svg>
              ),
              active: history.location.pathname === '/',
          }]}
      />
      {lists ? (
          <List
            items={lists}
            setPopup={addPopup}
            onRemove={id => {
              const newLists = lists.filter(item => item.id !== id);
              setLists(newLists);
              history.push('/');
            }}
            onClickItem={item => history.push(`/lists/${item.id}`)}
            activeItem={activeItem}
            isRemovable
          />
        ) : (
          <div className='todo__loading'>Загрузка...</div>
        )}
      </div>
      {colors && <AddList popup={popup} setPopup={addPopup} onAddList={onAddList} onAddColor={onAddColor} colors={colors} />}
      </div>
      
      <div className="todo__tasks">
      <Route path='/' exact>
        { lists &&
          lists.map(list => <Tasks 
              key={list.id}
              setPopup={addPopup}
              list={list}
              onEditITitle={onEditITitle}
              onAddTask={onAddTask}
              onRemoveTask={onRemoveTask}
              onEditTask={onEditTask}
              onCopleteTask={onCopleteTask}
           />)
        }
      </Route>
        <Route path='/lists/:id'>
          {lists && activeItem && 
            <Tasks 
              setPopup={addPopup}
              list={activeItem}
              onEditITitle={onEditITitle}
              onAddTask={onAddTask}
              onRemoveTask={onRemoveTask}
              onEditTask={onEditTask}
              onCopleteTask={onCopleteTask}
           />}
        </Route>
      </div> 
      
      <TransitionGroup className='todo__popups'>
        {popup.map((({questionCallback,error,text,id,input}) => 
         <CSSTransition
         timeout={300}
         mountOnEnter
         unmountOnExit
         className="popup"
         key={id} 
     > 
        <Popup 
          questionCallback={questionCallback}
          error={error}
          text={text}
          id={id}
          input={input}
          removePopup={removePopup}
        />
    </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
}

export default App;
