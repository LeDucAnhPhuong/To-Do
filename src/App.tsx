/* eslint-disable no-case-declarations */
import { useState, useRef, useEffect } from "react";
import "./App.css";
import addIcon from "../asset/images/home/add.svg";
import editIcon from "../asset/images/home/edit.svg";
import deleteIcon from "../asset/images/home/delete.svg";
import Button from "../components/button";
import Dialog from "../components/dialog";
import CanvasFireWorks from "../components/canvas";
import CanvasBackground from "../components/canvasBackground";
import "./app.scss";
type TaskList = {
  desc: string;
  priority: string;
  state: number;
  id: number;
  angle: number;
};
type taskInDialog = {
  desc: string;
  priority: string;
};
type TaskSelect = {
  id: number;
  isSelect: boolean;
};
function App() {
  const S = 2 * Math.PI * 24;
  const listRef = useRef<Array<HTMLLIElement>>([]);
  const stateRef = useRef<HTMLButtonElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement | null>();
  const [taskSelect, setTaskSelect] = useState<TaskSelect>({
    id: 0,
    isSelect: false,
  });
  const [taskList, setTaskList] = useState<Array<TaskList>>(() => {
    if (localStorage.getItem("taskList") !== "undefined") {
      return JSON.parse(localStorage.getItem("taskList") || "[]");
    }
    return [];
  });
  const [open, setOpen] = useState<boolean>(false);
  const [openCanvas, setOpenCanvas] = useState<number>(0);
  const [position, setPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [innerWindow, setInnerWindow] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [typeDialog, setTypeDialog] = useState<string>("");
  useEffect(() => {
    window.addEventListener("resize", () => {
      setInnerWindow({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });
  });
  useEffect(() => {
    listRef.current = listRef.current.filter((e) => e !== null);
  }, [listRef.current.length]);
  useEffect(() => {
    localStorage.setItem("taskList", JSON.stringify(taskList));
  }, [taskList]);
  function handleDialog(type: string | undefined) {
    setOpen(true);
    setTypeDialog(type || "");
  }
  function handleEditDeleteTaskList(
    array: Array<TaskList>,
    position: number,
    type: string,
    newTask = {
      desc: "",
      priority: "",
      state: 0,
      id: taskList.length,
      angle: 0,
    }
  ): Array<TaskList> {
    switch (type) {
      case "edit":
        array.splice(position, 1, newTask);
        break;
      case "delete":
        array.splice(position, 1);
        break;
    }
    return array;
  }
  function handleState(position: number, x: number, y: number) {
    let array: Array<TaskList> = [];
    switch (taskList[position]?.state) {
      case 0:
        array = handleEditDeleteTaskList(taskList, position, "edit", {
          ...taskList[position],
          state: 1,
          angle: 180,
        });
        break;
      case 1:
        array = handleEditDeleteTaskList(taskList, position, "edit", {
          ...taskList[position],
          state: 2,
          angle: 360,
        });
        setPosition({ x: x, y: y });
        setOpenCanvas(openCanvas + 1);
        break;
      case 2:
        array = handleEditDeleteTaskList(taskList, position, "edit", {
          ...taskList[position],
          state: 0,
          angle: 0,
        });

        break;
    }
    setTaskList([...array]);
  }
  function addNewTask(task: taskInDialog) {
    setTaskList([
      { ...task, state: 0, id: taskList.length, angle: 0 },
      ...taskList,
    ]);
    animationAddNewTask();
  }
  function editTask(task: taskInDialog) {
    let array = [];
    array = handleEditDeleteTaskList(taskList, taskSelect.id, "edit", {
      ...taskList[taskSelect.id],
      ...task,
    });
    setTaskList(array);
  }
  function deleteTask() {
    setTimeout(() => {
      let array: Array<TaskList> = [];
      array = handleEditDeleteTaskList(taskList, taskSelect.id, "delete");
      setTaskList([...array]);
    }, 500);

    animationDeleteTask(taskSelect.id);
  }
  function animationAddNewTask() {
    containerRef?.current?.classList.add("overflow-hidden");
    const height = listRef?.current[0]
      ? `${listRef?.current[0]?.clientHeight}px`
      : "100%";
    ulRef?.current?.animate(
      [
        // keyframes
        { transform: `translateY(-${height})` },
        { transform: "translateY(0px)" },
      ],
      {
        // timing options
        duration: 500,
      }
    );
  }

  function animationDeleteTask(index: number) {
    containerRef?.current?.classList.remove("overflow-hidden");

    const gap = listRef?.current[1]?.offsetTop - listRef?.current[0]?.offsetTop;
    const length = listRef.current.length;

    listRef.current[index]?.animate(
      [
        // keyframes
        { transform: `translateX(0)`, opacity: 1 },
        { transform: "translateX(-100px)", opacity: 0 },
      ],
      {
        // timing options
        duration: 500,
      }
    );
    for (let i = index + 1; i < length; i++) {
      listRef.current[i]?.animate(
        [
          // keyframes
          { transform: `translateY(0)` },
          { transform: `translateY(-${gap}px)` },
        ],
        {
          // timing options
          duration: 500,
        }
      );
    }
  }
  return (
    <>
      <CanvasBackground
        width={innerWindow.width - 1}
        height={innerWindow.height - 1}
      ></CanvasBackground>
      <CanvasFireWorks
        open={openCanvas}
        setOpen={setOpenCanvas}
        position={position}
        width={innerWindow.width - 1}
        height={innerWindow.height - 1}
      ></CanvasFireWorks>
      <Dialog
        open={open}
        setOpen={setOpen}
        addNewTask={addNewTask}
        editTask={editTask}
        deleteTask={deleteTask}
        name={typeDialog}
        task={taskSelect.isSelect ? taskList[taskSelect.id] : undefined}
      ></Dialog>
      <section className="home">
        <header className="home-header">
          <h1 className="home-header__title">Task List</h1>
          <Button
            value="add"
            id="add"
            onClick={() => {
              setTaskSelect({ id: 0, isSelect: false });
              handleDialog("add");
            }}
            icon={addIcon}
            title="Add Task"
            color="#713FFF"
            type="contained"
            size="big"
            disable={false}
            textColor={undefined}
          ></Button>
        </header>
        <div
          ref={(el) => (containerRef.current = el)}
          className="home-main-container"
        >
          <ul ref={ulRef} className="task-list">
            {taskList.map((task: TaskList, index: number) => (
              <li
                key={task.id}
                ref={(el: HTMLLIElement) => (listRef.current[index] = el)}
                className="task-list__item"
              >
                <div className="task-list__item-task">
                  <div className="task-list__item-task-tag tag-name">Task</div>
                  <p className="task-list__item-task-desc text--transform-first-letter">
                    {task.desc}
                  </p>
                </div>
                <div className="task-list__item-priority">
                  <div className="task-list__item-priority-tag tag-name">
                    Priority
                  </div>
                  <p
                    className={`task-list__item-priority-value text--transform-first-letter text--color-${task.priority}`}
                  >
                    {task.priority}
                  </p>
                </div>
                <button
                  ref={stateRef}
                  onClick={(event: React.MouseEvent) => {
                    handleState(index, event.clientX, event.clientY - 70);
                  }}
                  className="task-list__item-state button button--color-gray text--transform-first-letter"
                >
                  <ul className={`state__list translate-${task.state * 25}`}>
                    <li className="state__list-item">To do</li>
                    <li className="state__list-item">In Progress</li>
                    <li className="state__list-item">Done</li>
                    <li className="state__list-item">To do</li>
                  </ul>
                  {/* {task?.state} */}
                </button>
                <div className="task-list__item-state-loading">
                  <svg>
                    <circle
                      cx="50%"
                      cy="50%"
                      r="50%"
                      stroke="#713FFF"
                      stroke-width="4"
                      shape-rendering="geometricPrecision"
                      stroke-dashoffset={`${(1 / 4) * S}`}
                      stroke-dasharray={`${(task.angle / 360) * S} ${
                        S - (task.angle / 360) * S
                      }`}
                    ></circle>
                  </svg>
                </div>
                <div className="task-list__item-icon">
                  <div className="task-list__item-icon-edit">
                    <button
                      onClick={() => {
                        setTaskSelect({
                          id: index,
                          isSelect: true,
                        });
                        handleDialog("edit");
                      }}
                      className="button"
                    >
                      <img src={editIcon} alt="" />
                    </button>
                  </div>
                  <div className="task-list__item-icon-delete">
                    <button
                      onClick={() => {
                        setTaskSelect({
                          id: index,
                          isSelect: true,
                        });
                        handleDialog("delete");
                      }}
                      className="button"
                    >
                      <img src={deleteIcon} alt="" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export default App;
