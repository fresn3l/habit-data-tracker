import { useState } from 'react'
import ToDoItem from '../components/todos/ToDoItem'
import ToDoForm from '../components/todos/ToDoForm'
import RecurrenceManager from '../components/todos/RecurrenceManager'
import { useTodos } from '../hooks/useTodos'
import './ToDoPage.css'

/**
 * To Do Page Component
 * 
 * Displays and manages user todos. Uses the useTodos custom hook
 * for all todo-related state and operations.
 * 
 * @component
 * @returns {JSX.Element} To Do page component
 */
function ToDoPage() {
  const {
    todos,
    showForm: showTodoForm,
    editingTodo,
    filter,
    handleSave: handleTodoSave,
    handleDelete: handleTodoDelete,
    handleToggle: handleTodoToggle,
    handleEdit: handleTodoEdit,
    handleNew: handleNewTodo,
    closeForm,
    setFilter,
    getFilteredTodos,
    getOverdueList,
    loadTodos,
  } = useTodos()
  
  const [showRecurrenceManager, setShowRecurrenceManager] = useState(false)

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
  const overdueTodos = getOverdueList()
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
          onCancel={closeForm}
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
