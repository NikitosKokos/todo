import React from 'react'
import classNames from 'classnames';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';

const AddTask = ({ list, onAddTask, setPopup}) => {
    const [inputValue, setInputValue] = React.useState('');
    const [errorInput, setErrorInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [visibleForm, setFormVisible] = React.useState(false);

    const colseForm = () => {
        setFormVisible(false);
        setInputValue('');
        setErrorInput('');
    }

    const addTask = () => {
        if(!inputValue){
            setErrorInput('Введите название задачи');
            return;
        }
        const obj = {
            listId: list.id,
            text: inputValue,
            completed: false
        };
        setIsLoading(true);
        axios.post('http://localhost:3001/tasks', obj)
        .then(({data}) => {
            onAddTask(list.id, data);
            colseForm();
            setPopup( 
                { id:Math.random(),
                text:`Добавленна задача ${inputValue}` });
        })
        .catch(() => {
            setPopup( 
            { id:Math.random(),
            error: true,
            text:`Не удалось добавить задачу ${inputValue}` });
        }).finally(() => {
            setIsLoading(false);
        })
    }

    const onInputChange = (e) => {
        setInputValue(e.target.value);
        if(e.target.value){
            setErrorInput('');
        }
    }

    return (
        <div className='add-task'>
            <CSSTransition 
                in={!visibleForm} 
                timeout={300}
                mountOnEnter
                unmountOnExit
            >
                <div onClick={() => setFormVisible(true)} className="add-task__new animate">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 1V11" stroke="#B4B4B4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 6H11" stroke="#B4B4B4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Новая задача</span>
                </div>
            </CSSTransition>
            <CSSTransition 
                in={visibleForm} 
                timeout={300}
                mountOnEnter
                unmountOnExit
            >
                <div className="add-task__form animate">
                    <div className="add-task__input">
                        <input 
                            value={inputValue}
                            onChange={onInputChange}
                            type="text"
                            placeholder='Текст задачи'
                            className={classNames('field',{'error': !!errorInput})}
                        /> 
                    </div>
                    <CSSTransition 
                        in={!!errorInput} 
                        timeout={300}
                        mountOnEnter
                        unmountOnExit
                    >
                        <div className="add-list__error error-input animate">{errorInput}</div>
                    </CSSTransition>
                    <div className="add-task__buttons">
                        <button disabled={isLoading} className="add-task__add btn" onClick={addTask}>{isLoading ? 'Добавление...' :'Добавить задачу'}</button>
                        <button disabled={isLoading} className="add-task__back btn-grey" onClick={colseForm} >Отмена</button> 
                    </div> 
                </div> 
            </CSSTransition>
        </div>
    )
}

export default AddTask;
