import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import todoList from './reducers/reducers'
import { ADD_TODO, TOGGLE_TODO, SET_VISIBILITY_FILTER,
        SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from './actions'

let store = createStore(todoList)
let nextCounterID = 0;

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case (SHOW_COMPLETED):
      return todos.filter(t => t.completed)
    case (SHOW_ACTIVE):
      return todos.filter(t => !t.completed)   
    case (SHOW_ALL):
    default: 
      return todos
  }
}

const FilterLink = ({filter, children, currentFilter}) => {
  if (filter === currentFilter) {
    return <span>{children}</span>
  }
  return (
    <a href="#"
      onClick={e => {
        e.preventDefault();
        store.dispatch({
          type: SET_VISIBILITY_FILTER,
          filter
        })
      }}
    >
      {children}
    </a>
  )
}

class TodoApp extends React.Component {
  constructor(props) {
    super(props)
    this.addTodo = this.addTodo.bind(this)
  }

  addTodo() {
    store.dispatch({
      type: ADD_TODO,
      text: this.addTodoValue.value,
      id: nextCounterID++
    })
    this.addTodoValue.value = '';
  }

  toggleTodo(id) {
    store.dispatch({
      type: TOGGLE_TODO,
      id: id
    })
  }

  render() {
    const visibleTodos = getVisibleTodos(
      this.props.todos,
      this.props.visibilityFilter
    )

    console.log(visibleTodos);

    return (
      <div>
        <input ref={node => {
          this.addTodoValue = node
        }} />
        <button onClick={this.addTodo}>
          Add Todo
        </button>
        <ul>
          {visibleTodos.map(todo => (
            <li key={todo.id} 
                onClick={() => this.toggleTodo(todo.id)}
                style={{textDecoration: 
                  todo.completed
                    ? 'line-through'
                    : 'none'
                  }
                }
              >
              {todo.text}
            </li>
          ))}
        </ul>
        <p>
          Show:
          {' '}
          <FilterLink
            filter={SHOW_ALL}
            currentFilter={this.props.visibilityFilter}
          >
            All
          </FilterLink>
          {' '}
          <FilterLink
            filter={SHOW_ACTIVE}
            currentFilter={this.props.visibilityFilter}
          >
            Active
          </FilterLink>
          {' '}
          <FilterLink
            filter={SHOW_COMPLETED}
            currentFilter={this.props.visibilityFilter}
          >
            Completed
          </FilterLink>
        </p>
      </div>
    )
  }
}

function render() {
  ReactDOM.render(
    <TodoApp 
      {...store.getState()}
    />,
    document.getElementById('root')
  )
}

store.subscribe(render);
render();