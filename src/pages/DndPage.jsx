import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import "../pages/dndPage.css";
const ItemType = 'TASK';

// Задаёт тип элемента, который будет перетаскиваться. В данном случае — это TASK.
// Задача, хук для перетаскивания, 
const Task = ({ task, index, moveTask, columnId, deleteTask }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemType,
    item: { index, columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef} // привязка элемента к перетаскиванию
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: '#ffffff',
        padding: '12px',
        marginBottom: '12px',
        borderRadius: '8px',
        cursor: 'move',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
      }}
    >
      <span style={{ color: '#333' }}>{task.content}</span>
      <button
        onClick={() => deleteTask(columnId, task.id)}
        style={{
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          padding: '6px 12px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
      >
        X
      </button>
    </div>
  );
};

// Колонка задач
// useDrop - область в которую можно перетаскивать задачи
const Column = ({ column, moveTask, deleteTask }) => {
  const [, dropRef] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.columnId !== column.id) {
        moveTask(draggedItem.index, draggedItem.columnId, column.id);
        draggedItem.columnId = column.id;
      }
    },
  });

  return (
    <div
      ref={dropRef}
      style={{
        margin: '0 20px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        minHeight: '400px',
        width: '280px',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <h2 style={{ color: '#2c3e50', marginBottom: '15px' }}>{column.name}</h2>
      {column.items.map((task, index) => (
        <Task
          key={task.id}
          task={task}
          index={index}
          moveTask={moveTask}
          columnId={column.id}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  );
};


// Основной компонент страницы, где создаются колонки и задачи
function DndPage() {
  const [columns, setColumns] = useState([
    {
      id: 'todo',
      name: 'To Do',
      items: [
        { id: '1', content: 'Записать дис на Ковтуна' },
        { id: '2', content: 'Извиниться перед Ковтуном' },
        { id: '3', content: 'Случайно пожать руку Ковтуну' },
        { id: '4', content: 'Помыть руку трижды' }
      ],
    },
    {
      id: 'inProgress',
      name: 'In Progress',
      items: [],
    },
    {
      id: 'done',
      name: 'Done',
      items: [],
    },
    {
      id: 'blocked',
      name: 'Blocked',
      items: [],
    },
  ]);

  // Функция для перемещения задач между колонками
  // Она находит исходную и целевую колонку, затем обновляет их списки задач
  const moveTask = (taskIndex, sourceColumnId, destinationColumnId) => {
    const sourceColumn = columns.find((col) => col.id === sourceColumnId);
    const destinationColumn = columns.find((col) => col.id === destinationColumnId);

    const taskToMove = sourceColumn.items[taskIndex];

    const updatedSourceItems = sourceColumn.items.filter((_, idx) => idx !== taskIndex);
    const updatedDestinationItems = [...destinationColumn.items, taskToMove];

    setColumns((prevColumns) =>
      prevColumns.map((col) => {
        if (col.id === sourceColumnId) {
          return { ...col, items: updatedSourceItems };
        }
        if (col.id === destinationColumnId) {
          return { ...col, items: updatedDestinationItems };
        }
        return col;
      })
    );
  };
  // функция для удаления задачи по её ID из соответствующей колонки.
  const deleteTask = (columnId, taskId) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            items: column.items.filter((task) => task.id !== taskId),
          };
        }
        return column;
      })
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
        backgroundColor: '#2c3e50',
        padding: '20px',
        borderRadius: '10px',
        minHeight: '50vh',
        color: '#ecf0f1'
      }}>
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            moveTask={moveTask}
            deleteTask={deleteTask}
          />
        ))}
      </div>
      <a
        href='http://localhost:5173'
        className='goback_btn'
        style={{
          display: 'block',
          textAlign: 'center',
          padding: '12px 20px',
          marginTop: '30px',
          backgroundColor: '#3498db',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
        }}
      >
        Вернуться назад
      </a>
    </DndProvider>
  );
}

export default DndPage;
