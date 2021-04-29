import React from 'react';
import List from '../List';
import classNames from 'classnames';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';

import './style.scss';

const AddNewList = ({colors, setPopup, onAddList, onAddColor}) => {
    const [visiblePopup, setVisiblePopup] = React.useState(false);
    const [selectedColor, selectColor] = React.useState(null);
    const [inputNameValue, setInputNameValue] = React.useState('');
    const [inputColorValue, setInputColorValue] = React.useState('');
    const [errorInputName, setErrorInputName] = React.useState('');
    const [errorInputColor, setErrorInputColor] = React.useState('');
    const [addColorBlock, setAddColorBlock] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingColor, setIsLoadingColor] = React.useState(false);

    React. useEffect(() => {
        if (Array.isArray(colors)) {
            selectColor(colors[0].id);
        }
    }, [colors]);

    const onClickColor = () => {
        
    }

    const onClose = () => {
        setVisiblePopup(false);
        setAddColorBlock(false);
        setInputNameValue('');
        setInputColorValue('');
        selectColor(colors[0].id);
        setErrorInputName('');
        setErrorInputColor('');
    }

    const colseAddColor = () => {
        setAddColorBlock(false);
        setInputColorValue('');
        setErrorInputColor('');
    }

    const addList = () => {
        if(!inputNameValue){
            setErrorInputName('Введите название списка');
            return;
        }
        setIsLoading(true);
        axios.post('http://localhost:3001/lists', {
                name: inputNameValue,
                colorId: selectedColor
        }).then(({ data }) => {
            setPopup({ id:Math.random(),
            text:`Добавлен список ${inputNameValue}` });

            const color = colors.filter(c => c.id === selectedColor)[0].hex;
            const listObj = {...data, color: { hex: color}, tasks: [] };
            onAddList(listObj);
            onClose();
            setIsLoading(false);
        }).catch(() => {
            setPopup({ id:Math.random(),
            error: true,
            text:`Не удалось добавить список ${inputNameValue}` });
        }).finally(() => {
            setIsLoading(false);
        })
        
    }
    const addColor = () => {
        if(!inputColorValue){
            setErrorInputColor('Введите цвет');
            return;
        }
        
        if(!inputColorValue.match(/^([0-9a-f]{3}){1,2}$/i)){
            setErrorInputColor('Введите корректный цвет');
            return;
        }
        setIsLoadingColor(true);
        axios.post('http://localhost:3001/colors', {
                hex: `#${inputColorValue}`,
        }).then(({ data }) => {
            setPopup({ id:Math.random(),
            text:`Добавлен цвет #${inputColorValue}` });

            onAddColor(data);
            setIsLoadingColor(false);
            colseAddColor();
        }).catch(() => {
            setPopup( 
            { id:Math.random(),
            error: true,
            text:`Не удалось добавить цвет #${inputColorValue}` });
        }).finally(() => {
            setIsLoadingColor(false);
        })
    }

    const onInputNameChange = (e) => {
        setInputNameValue(e.target.value);
        if(e.target.value){
            setErrorInputName('');
        }

    }

    const onInputColorChange = (e) => {
        const reg = /[0-9a-f]/g ;
        
        if(e.target.value.match(reg)){
            setInputColorValue(e.target.value.match(reg).join(''));
        }
        if(e.target.value === ''){
            setInputColorValue(e.target.value);
        }
        if(e.target.value){
            setErrorInputColor('');
        }

    }

    return (
        <div className='list-todo__add add-list'>
            <List
                onClick={() => setVisiblePopup(true)}
                items={[
                {
                    className: 'list-todo__add',
                    id: 1,
                    name: "Добавить список",
                    icon: (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 1V11" stroke="#868686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 6H11" stroke="#868686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    )
                }]}
            />
            <CSSTransition 
                in={visiblePopup} 
                timeout={300}
                mountOnEnter
                unmountOnExit
            >
             <div className="add-list__popup animate" >
                <div className="add-list__close" onClick={onClose} >
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="5C5C5C" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.315 0C4.62737 0 0 4.62737 0 10.315C0 16.0026 4.62737 20.63 10.315 20.63C16.0026 20.63 20.63 16.0026 20.63 10.315C20.63 4.62737 16.0026 0 10.315 0ZM14.0497 12.928C14.1265 13.0009 14.1879 13.0885 14.2303 13.1855C14.2727 13.2826 14.2952 13.3872 14.2966 13.4931C14.298 13.599 14.2781 13.7041 14.2382 13.8022C14.1983 13.9003 14.1392 13.9894 14.0643 14.0643C13.9894 14.1392 13.9003 14.1983 13.8022 14.2382C13.7041 14.2781 13.599 14.298 13.4931 14.2966C13.3872 14.2952 13.2826 14.2727 13.1855 14.2303C13.0885 14.1879 13.0009 14.1265 12.928 14.0497L10.315 11.4373L7.70203 14.0497C7.55202 14.1922 7.35226 14.2705 7.14536 14.2679C6.93846 14.2652 6.74077 14.1819 6.59446 14.0355C6.44814 13.8892 6.36477 13.6915 6.36212 13.4846C6.35947 13.2777 6.43775 13.078 6.58028 12.928L9.19275 10.315L6.58028 7.70203C6.43775 7.55202 6.35947 7.35226 6.36212 7.14536C6.36477 6.93846 6.44814 6.74077 6.59446 6.59446C6.74077 6.44814 6.93846 6.36477 7.14536 6.36212C7.35226 6.35947 7.55202 6.43775 7.70203 6.58028L10.315 9.19275L12.928 6.58028C13.078 6.43775 13.2777 6.35947 13.4846 6.36212C13.6915 6.36477 13.8892 6.44814 14.0355 6.59446C14.1819 6.74077 14.2652 6.93846 14.2679 7.14536C14.2705 7.35226 14.1922 7.55202 14.0497 7.70203L11.4373 10.315L14.0497 12.928Z" fill="#5C5C5C"/>
                    </svg>
                </div>
                <input 
                    value={inputNameValue} 
                    onChange={onInputNameChange}
                    type="text" 
                    placeholder='Название списка' 
                    className={classNames('field',{'error': !!errorInputName})}
                />
                <CSSTransition 
                    in={!!errorInputName} 
                    timeout={300}
                    mountOnEnter
                    unmountOnExit
                >
                    <div className="add-list__error error-input animate">{errorInputName}</div>
                </CSSTransition>
                <div className="add-list__info">
                    <div className="add-list__label">{!addColorBlock ? 'Выбрать' : 'Добавить'} цвет</div>
                    <div className="add-list__controls">
                        <div className="add-list__addColor" onClick={() => setAddColorBlock(true)}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 1V11" stroke="#767676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M1 6H11" stroke="#767676" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <CSSTransition 
                    in={addColorBlock} 
                    timeout={300}
                    mountOnEnter
                    unmountOnExit
                >
                    <div className="add-list__newColor newColor-add animate">
                        <div className="newColor-add__colorInput">
                        <input 
                                value={inputColorValue}
                                onChange={onInputColorChange}
                                type="text"
                                maxLength={6}
                                placeholder='Введите цвет'
                                className={classNames('field',{'error': !!errorInputColor})}
                            /> 
                        </div>
                        <CSSTransition 
                            in={!!errorInputColor} 
                            timeout={300}
                            mountOnEnter
                            unmountOnExit
                        >
                            <div className="add-list__error error-input animate">{errorInputColor}</div>
                        </CSSTransition>
                        <div className="add-list__buttons">
                        <button disabled={isLoadingColor} className="newColor-add__add btn" onClick={addColor}>Добавить</button>
                        <button disabled={isLoadingColor} className="newColor-add__back btn-grey" onClick={colseAddColor} >Отмена</button>  
                        </div>
                        
                    </div>
                </CSSTransition>
                <ul className="add-list__colors">
                    {colors.map(({hex,id}) => (
                        <li 
                            onClick={() => selectColor(id)} 
                            key={id} 
                            className={classNames({'active': selectedColor === id})} 
                            style={{background: hex}}
                        ></li>
                    ))}
                </ul>
                <button disabled={isLoading} onClick={addList} className='add-list__btn btn'>
                    {isLoading ? 'Добавление...' :'Добавить'}</button> 
            </div>   
            </CSSTransition>
            
        </div>
    )
}

export default AddNewList;
