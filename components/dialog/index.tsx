import { useEffect, useRef, useState } from "react";
import "./style_dialog.scss";
import cancleIcon from "../../asset/images/home/cancel.svg";
import Button from "../button";
type TaskInput = {
  desc: string;
  priority: string;
};
type TaskList = {
  desc: string;
  priority: string;
  state: number;
  id: number;
  angle: number;
};
type Props = {
  open: boolean;
  name: string;
  setOpen: (open: boolean) => void;
  addNewTask: (task: TaskInput) => void;
  editTask: (task: TaskInput) => void;
  deleteTask: () => void;
  task?: TaskList | null | undefined;
};
const Dialog = ({
  open,
  name,
  setOpen,
  addNewTask,
  task,
  editTask,
  deleteTask,
}: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [taskInput, setTaskInput] = useState<TaskInput>({
    desc: "",
    priority: "medium",
  });
  const [disable, setDisable] = useState<boolean>(true);
  function resetTaskLog() {
    setTaskInput(
      task || {
        desc: "",
        priority: "medium",
      }
    );
  }
  function cancelDialog() {
    setOpen(false);
    resetTaskLog();
  }
  useEffect(() => {
    if (!taskInput.desc.trim()) {
      setDisable(true);
    } else setDisable(false);
  }, [taskInput.desc]);
  function handleInput(type: string, value: string) {
    setTaskInput({
      ...taskInput,
      [type]: value,
    });
  }

  function handleAccept() {
    switch (name) {
      case "add":
        addNewTask(taskInput);
        break;
      case "edit":
        editTask(taskInput);
        break;
      case "delete":
        deleteTask();
        break;
    }
    cancelDialog();
  }
  useEffect(() => {
    resetTaskLog();
  }, [task]);
  return (
    <dialog
      onClick={(mouseEvent: React.MouseEvent) => {
        const target = mouseEvent.target as HTMLDialogElement;
        if (!contentRef.current?.contains(target)) {
          cancelDialog();
        }
      }}
      className={`dialog dialog--display-${open ? "show" : "hidden"} `}
    >
      <div
        ref={contentRef}
        className={`dialog__content dialog--animation-${
          open ? "show" : "hidden"
        }`}
      >
        {name != "delete" ? (
          <>
            <div className="dialog__tag">
              <h1 className="dialog__tag-name">
                {name == "add"
                  ? "Add Task"
                  : name === "edit"
                  ? "Edit Task"
                  : null}
              </h1>
              <button onClick={cancelDialog} className="button">
                <img src={cancleIcon} alt="cancle" />
              </button>
            </div>
            <div className="dialog__task-input">
              <label htmlFor="task" className="tag-name">
                Task
              </label>
              <div className="task__input">
                <input
                  value={taskInput.desc}
                  onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleInput("desc", event.target.value)
                  }
                  type="text"
                  id="task"
                  placeholder="Task name"
                />
              </div>
            </div>
            <div className="dialog__priority">
              <label htmlFor="task" className="tag-name">
                Priority
              </label>
              <form
                onSubmit={(event: React.ChangeEvent<HTMLFormElement>) => {
                  event.preventDefault();
                }}
                onClick={(event: React.MouseEvent<HTMLFormElement>) => {
                  handleInput(
                    "priority",
                    (event.target as HTMLFormElement).value
                  );
                }}
                className="dialog__priority-list"
              >
                <Button
                  id="high"
                  type={
                    taskInput.priority === "high" ? "contained" : "outlined"
                  }
                  color="#F73446"
                  title="High"
                  size="small"
                  value="high"
                  onClick={() => {}}
                  icon={undefined}
                  disable={false}
                  textColor={undefined}
                ></Button>
                <Button
                  id="normal"
                  type={
                    taskInput.priority === "medium" ? "contained" : "outlined"
                  }
                  color="#FFBD21"
                  title="Medium"
                  value="medium"
                  size="small"
                  onClick={() => {}}
                  icon={undefined}
                  disable={false}
                  textColor={undefined}
                ></Button>
                <Button
                  id="low"
                  type={taskInput.priority === "low" ? "contained" : "outlined"}
                  color="#0AC947"
                  title="Low"
                  size="small"
                  value="low"
                  onClick={() => {}}
                  icon={undefined}
                  disable={false}
                  textColor={undefined}
                ></Button>
              </form>
            </div>
            <div className="dialog__action">
              <Button
                value={name}
                id="add"
                type="contained"
                color="#713FFF"
                title={name}
                size="normal"
                onClick={handleAccept}
                icon={undefined}
                disable={disable}
                textColor={undefined}
              ></Button>
              <Button
                value="cancel"
                id="cancel"
                type="outlined"
                color="#D8E0F0"
                textColor="#7D8592"
                title={"cancle"}
                size="normal"
                onClick={cancelDialog}
                icon={undefined}
                disable={false}
              ></Button>
            </div>
          </>
        ) : (
          <>
            <p className="dialog__delete">
              Are you sure you want to delete this task?
            </p>
            <div className="dialog__action">
              <Button
                value={name ? name : "delete"}
                id={name ? name : "delete"}
                type="contained"
                color="#713FFF"
                title={name ? name : "delete"}
                size="normal"
                onClick={handleAccept}
                icon={undefined}
                disable={false}
                textColor={undefined}
              ></Button>
              <Button
                value="cancle"
                id="cancle"
                type="outlined"
                color="#D8E0F0"
                textColor="#7D8592"
                title={"cancle"}
                size="normal"
                onClick={cancelDialog}
                icon={undefined}
                disable={false}
              ></Button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
};

export default Dialog;
