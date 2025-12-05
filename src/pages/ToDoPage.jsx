import { useState, useEffect } from 'react'
import ToDoItem from '../components/todos/ToDoItem'
import ToDoForm from '../components/todos/ToDoForm'
import RecurrenceManager from '../components/todos/RecurrenceManager'
import { getAllTodos, saveTodo, deleteTodo, toggleTodoComplete, getTodosByPriority, getOverdueTodos } from '../utils/todoStorage'
import { generateRecurringTodo, shouldGenerateNext } from '../utils/recurrenceUtils'
import './ToDoPage.css'

function ToDoPage() {
  const [todos, setTodos] = useState([])
  const [showTodoForm, setShowTodoForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'active', 'completed'
  const [showRecurrenceManager, setShowRecurrenceManager] = useState(false)

  useEffect(() => {
    loadTodos()
    checkRecurringTodos()
  }, [])

  useEffect(() => {
    // Check for recurring todos whenever todos change
    checkRecurringTodos()
  }, [todos])

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

  const checkRecurringTodos = () => {
    const allTodos = getAllTodos()
    const recurringTemplates = allTodos.filter(t => 
      t.isRecurring && !t.isRecurringInstance
    )
    
    recurringTemplates.forEach(template => {
      // Check if we need to generate a new instance
      if (shouldGenerateNext(template)) {
        // Check if an instance for this due date already exists
        const nextDue = template.nextDueDate || template.dueDate
        const existingInstance = allTodos.find(t => 
          t.originalRecurringId === template.id &&
          t.dueDate &&
          new Date(t.dueDate).toDateString() === new Date(nextDue).toDateString()
        )
        
        if (!existingInstance) {
          const newInstance = generateRecurringTodo(template)
          if (newInstance) {
            saveTodo(newInstance)
          }
        }
      }
    })
    
    loadTodos()
  }

  const handleTodoToggle = (todoId) => {
    const todo = toggleTodoComplete(todoId)
    
    // If completing a recurring todo instance, check if we need to generate next
    if (todo && todo.completed && todo.originalRecurringId) {
      setTimeout(() => {
        checkRecurringTodos()
      }, 1000)
    }
    
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

  /**
   * Group todos by priority for display in sections.
   */
  const groupTodosByPriority = (todos) => {
    const groups = {
      now: [],
      next: [],
      later: []
    }
    
    todos.forEach(todo => {
      const priority = todo.priority || 'next'
      if (priority === 'now') {
        groups.now.push(todo)
      } else if (priority === 'next') {
        groups.next.push(todo)
      } else {
        groups.later.push(todo)
      }
    })
    
    return groups
  }

  const filteredTodos = getFilteredTodos()
  const todosByPriority = groupTodosByPriority(filteredTodos)
  const overdueTodos = getOverdueTodos(todos)
  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length

  return (
    <>
      <div className="todos-header">
        <div className="todos-header-content">
          <h2>My To Do List</h2>
          <div className="header-buttons">
            <button className="create-todo-btn" onClick={handleNewTodo}>
              + New To Do
            </button>
            <button 
              className="recurring-btn" 
              onClick={() => setShowRecurrenceManager(true)}
              title="Manage Recurring Todos"
            >
              🔄 Recurring
            </button>
          </div>
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
            {/* Now Priority Section */}
            {todosByPriority.now.length > 0 && (
              <div className="priority-section">
                <h3 className="priority-section-title priority-now">
                  🔴 Now ({todosByPriority.now.length})
                </h3>
                {todosByPriority.now.map(todo => (
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
            
            {/* Next Priority Section */}
            {todosByPriority.next.length > 0 && (
              <div className="priority-section">
                <h3 className="priority-section-title priority-next">
                  🟠 Next ({todosByPriority.next.length})
                </h3>
                {todosByPriority.next.map(todo => (
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
            
            {/* Later Priority Section */}
            {todosByPriority.later.length > 0 && (
              <div className="priority-section">
                <h3 className="priority-section-title priority-later">
                  🔵 Later ({todosByPriority.later.length})
                </h3>
                {todosByPriority.later.map(todo => (
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
        )}
      </div>

      {showTodoForm && (
        <ToDoForm
          todo={editingTodo}
          onSave={handleTodoSave}
          onCancel={() => { setShowTodoForm(false); setEditingTodo(null); }}
        />
      )}

      {showRecurrenceManager && (
        <RecurrenceManager 
          onClose={() => {
            setShowRecurrenceManager(false)
            loadTodos()
          }}
        />
      )}
    </>
  )
}

export default ToDoPage
