import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { useMutation } from "react-query";
import moment from "moment";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";
import { editState, todoState, todosState } from "@recoils/todo";
import { deleteTodo, updateTodoComplete } from "@services/todo.service";
import { getClient } from "@services/core";

const TodoItem = ({ item }) => {
  const userId = "polly@gmail.com";
  const todoId = item.t_todoid;
  const queryClient = getClient();
  const setTodoList = useSetRecoilState(todosState);
  const setTodoItem = useSetRecoilState(todoState);
  const setIsEdit = useSetRecoilState(editState);

  const { mutate: deleteMutation, data: deletedData } = useMutation(
    deleteTodo({ queryClient, userId })
  );
  const { mutate: updateCompleteMutation, data: completedData } = useMutation(
    updateTodoComplete({ queryClient, userId })
  );

  useEffect(() => {
    if (deletedData) setTodoList([...deletedData]);
  }, [deletedData]);

  useEffect(() => {
    if (completedData) setTodoList([...completedData]);
  }, [completedData]);

  const completeHandler = () => {
    updateCompleteMutation({ todoId });
  };

  const editHandler = () => {
    setTodoItem({ ...item });
    setIsEdit(true);
  };

  const deleteHandler = () => {
    if (window.confirm(`"${item.t_content}"\n할 일 아이템을 삭제합니다.`)) {
      deleteMutation({ todoId });
    }
  };

  const today = moment().format("YYYY[-]MM[-]DD");
  const isToday = item.t_deadline === today;
  const dDay =
    (new Date(today) - new Date(item.t_deadline)) / (1000 * 60 * 60 * 24);

  return (
    <div className="item" data-id={todoId}>
      <div className="complete" onClick={completeHandler}>
        <AiOutlineCheck />
      </div>
      <div className="date">
        <div>{item.t_date}</div>
        <div>{item.t_time}</div>
      </div>
      <div
        className={item.t_compdate ? "content line" : "content"}
        onClick={editHandler}
        title="수정"
      >
        {item.t_content}
      </div>
      <div className={isToday ? "deadline active" : "deadline"}>
        {item.t_deadline}
      </div>
      <div className={isToday ? "deadline active" : "deadline"}>
        {!item?.t_deadline
          ? ""
          : isToday
          ? "D-day"
          : `D${dDay > 0 ? "+" : ""}${dDay}`}
      </div>
      <div className="prior" data-prior={item.t_prior}></div>
      <div className="delete" onClick={deleteHandler}>
        <AiOutlineClose />
      </div>
    </div>
  );
};

export default TodoItem;