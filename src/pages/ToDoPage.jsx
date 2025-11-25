import { useState, useEffect } from 'react'
import ToDoItem from '../components/ToDoItem'
import ToDoForm from '../components/ToDoForm'
import { getAllTodos, saveTodo, deleteTodo, toggleTodoComplete, getTodosByPriority, getOverdueTodos } from '../utils/todoStorage'
import './ToDoPage.css'

function ToDoPage() {
  const [todos, setTodos] = useState([])
  const [showTodoForm, setShowTodoForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'active', 'completed'

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = () => {
    const allTodos = getAllTodos()
    setTodos(allTodos)
  }

  const handleTodoSave = (todoData) => {
    saveTodo(todoData)
    loadTodos()
    setShowTodoForm(false)
    setEditingTodo(null)
  }

  const handleTodoToggle = (todoId) => {
    toggleTodoComplete(todoId)
    loadTodos()
  }

  const handleTodoDelete = (todoId) => {
    if (window.confirm('Are you sure you want to delete this to do item?')) {
      deleteTodo(todoId)
      loadTodos()
    }
  }

  const handleTodoEdit = (todo) => {
    setEditingTodo(todo)
    setShowTodoForm(true)
  }

  const handleNewTodo = () => {
    setEditingTodo(null)
    setShowTodoForm(true)
  }

  const getFilteredTodos = () => {
    let filtered = todos
    
    if (filter === 'active') {
      filtered = filtered.filter(t => !t.completed)
    } else if (filter === 'completed') {
      filtered = filtered.filter(t => t.completed)
    }
    
    return getTodosByPriority(filtered)
  }

  const filteredTodos = getFilteredTodos()
  const overdueTodos = getOverdueTodos(todos)
  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length

  return (
    <>
      <div className="todos-header">
        <div className="todos-header-content">
          <h2>My To Do List</h2>
          <button className="create-todo-btn" onClick={handleNewTodo}>
            + New To Do
          </button>
        </div>
        
        {todos.length > 0 && (
          <div className="todos-stats">
            <span className="stat-item">
              {activeCount} active
            </span>
            {overdueTodos.length > 0 && (
              <span className="stat-item overdue-stat">
                {overdueTodos.length} overdue
              </span>
            )}
            <span className="stat-item">
              {completedCount} completed
            </span>
          </div>
        )}

        <div className="todo-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="todos-container">
        {overdueTodos.length > 0 && filter !== 'completed' && (
          <div className="overdue-section">
            <h3 className="overdue-title">⚠️ Overdue</h3>
            {overdueTodos.map(todo => (
              <ToDoItem
                key={todo.id}
                todo={todo}
                onToggle={handleTodoToggle}
                onEdit={handleTodoEdit}
                onDelete={handleTodoDelete}
              />
            ))}
          </div>
        )}

        {filteredTodos.length === 0 ? (
          <div className="empty-todos">
            <div className="empty-todos-icon">📝</div>
            <h3>No to do items yet</h3>
            <p>Create your first to do item to get started!</p>
            <button className="create-todo-btn-large" onClick={handleNewTodo}>
              + Create Your First To Do
            </button>
          </div>
        ) : (
          <div className="todos-list">
            {filteredTodos.map(todo => (
              <ToDoItem
                key={todo.id}
                todo={todo}
                onToggle={handleTodoToggle}
                onEdit={handleTodoEdit}
                onDelete={handleTodoDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showTodoForm && (
        <ToDoForm
          todo={editingTodo}
          onSave={handleTodoSave}
          onCancel={() => { setShowTodoForm(false); setEditingTodo(null); }}
        />
      )}
    </>
  )
}

export default ToDoPage
