import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';

import './style.scss';

const Popup = ({questionCallback, removePopup, error, text,id, input}) => {
    const [inputValue, setInputValue] = React.useState(input ? input: '');
    const [errorInput, setErrorInput] = React.useState('');

    let popup = <div></div>;
    const completedPopup = () => {
        questionCallback();
        removePopup(id);
    };
    const completedInputPopup = () => {
        if(!inputValue){
            setErrorInput('Введите название списка');
            return;
        }
        questionCallback(inputValue);
        removePopup(id);
        setInputValue('');
    };
    const onInputChange = (e) => {
        setInputValue(e.target.value);
        if(e.target.value){
            setErrorInput('');
        }

    }
    const undoPopup = () => {
        removePopup(id);
    }
    React.useEffect(() => {
        if(!questionCallback){
            setTimeout(undoPopup, 1500);
        }
    }, []);

    if(!!input){
        popup = 
        <div className="popup__body">
            <div className="popup__text">{text}</div>
            <div className="popup__input">
            <input 
                value={inputValue} 
                onChange={onInputChange} 
                type="text" 
                placeholder={text}
                className={classNames('field',{'error': !!errorInput})} 
            /></div>
            <CSSTransition 
                in={!!errorInput} 
                timeout={300}
                mountOnEnter
                unmountOnExit
            >
                <div className="add-list__error error-input animate">{errorInput}</div>
            </CSSTransition>
            <div className="popup__buttons">
                <div className="popup__completed btn" onClick={completedInputPopup} >Да</div>
                <div className="popup__undo btn-grey" onClick={undoPopup} >Отмена</div>
            </div>
        </div>
    }else if(!!questionCallback){
        popup = 
        <div className="popup__body">
            <div className="popup__text">{text}</div>
            <div className="popup__buttons">
                <div className="popup__completed btn" onClick={completedPopup} >Да</div>
                <div className="popup__undo btn-grey" onClick={undoPopup} >Отмена</div>
            </div>
        </div>
    }else{
        popup = 
        <div className="popup__body">
            <div className="popup__text">{text}</div>
        </div>
    }
    
    return (
   
    <div className={classNames('popup', {'popup_error': error})} >
        {popup}
    </div>);
}

export default Popup;
