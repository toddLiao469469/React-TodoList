import React, { useState,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { rootState } from "../store/reducers/index";
import { ADD_TODO ,SORT_TODO} from "../store/constants/index";
import styled from "@emotion/styled";
import {OutlinedInput , Button} from '@material-ui/core';
import {addToDoApi} from "../common/utility"

const ToDoInputContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100px;
  margin-bottom: 10px;
`;
const ToDoListInput = styled(OutlinedInput)`
  width: 30%;
  min-width: 200px;
  height: 40px;
  margin-bottom: 20px;
  box-sizing: border-box;
`;

const NewToDoBtn = styled(Button)`
  width: 30%;
  min-width: 200px;
  height: 40px;
`;

export default function ToDoInput() {
  const ToDoListCount = useSelector((state: rootState) => state.ToDoList).count;
  const lastKey = useSelector((state: rootState) => state.ToDoList).ToDoList.slice(-1)[0].key
  const dispatch = useDispatch();
  const [state, setState] = useState({ name: "", key: 1 });
  const addToDo = () => {
    if (state.name) {
      
      const data = { name: state.name, key: state.key }
      dispatch({
        type: ADD_TODO,
        payload: {
          ToDoList: data,
        },
      });
      setState({ ...state, name: "" });
      addToDoApi("http://localhost:9010/ToDoApi/key",{...data,finished:false})
    }
  };
  const addTaskAsync = ()=>{
    console.log("1");
    return (dispatch:any) => {
      console.log(dispatch,"123");
      setTimeout(() => {
        dispatch({
          type: ADD_TODO,
          payload: {
            ToDoList: {name:state.name,key:state.key},
          }});
          setState({ ...state, name: "" });

      }, 1000);
    };
  }

  useEffect(() => {
    setState({...state,key:lastKey+1})
  }, [ToDoListCount])

  return (
    <ToDoInputContainer>
      <ToDoListInput
        
        data-testid="Input"
        type="text"
        value={state.name}
        onChange={(e) => setState({ key: state.key, name: e.target.value })}
        onKeyDown={(e)=>e.key==='Enter' ? addToDo() :""}
      />
      <NewToDoBtn variant="contained" color="primary"
       onClick={()=>{dispatch(addTaskAsync())}}>新增ToDo{state.key}</NewToDoBtn>
    </ToDoInputContainer>
  );
}
