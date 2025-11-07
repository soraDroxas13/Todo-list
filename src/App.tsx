import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import { Construction } from "lucide-react";

type priority = 'urgente' | 'moyenne' | 'basse';

type Todo = {
  id: number;
  text: string;
  priority: priority;
}

function App() {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<priority>("moyenne");

  const savedTodos = localStorage.getItem("todos");
  const initialTodos = savedTodos ? JSON.parse(savedTodos) : [];
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filter , setFilter] = useState<priority | "Tous">("Tous");

  useEffect(()=>{
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos])

  function addTodo() {
    if(input.trim() == ""){
      return
    }

    const newTodo: Todo = {
      id: Date.now(), 
      text: input.trim(),
      priority: priority
    }

    const newTodos = [newTodo, ...todos];
    setTodos(newTodos);
    setInput("");
    setPriority("moyenne");
    console.log(newTodos);
  }

  let filteredTodos: Todo[] = [];

  if(filter === "Tous"){
    filteredTodos = todos;
  }else{
    filteredTodos = todos.filter((todo) => todo.priority === filter); 
  }

  const urgentCount = todos.filter((t) => t.priority === "urgente").length
  const mediumCount = todos.filter((t) => t.priority === "moyenne").length
  const lowCount = todos.filter((t) => t.priority === "basse").length

  const totalCount = todos.length

  function deleteTodo(id: number){
    const newTodos = todos.filter((todo) => todo.id !== id)
    setTodos(newTodos)
  }

  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set());

  function toggleSelectTodo(id: number) {
    const newSelectedTodos = new Set(selectedTodos);
    if (newSelectedTodos.has(id)) {
      newSelectedTodos.delete(id);
    } else {
      newSelectedTodos.add(id);
    }
    setSelectedTodos(newSelectedTodos);
  }

  function finishSelected(){
    const newTodos = todos.filter((todo) => {
      if(selectedTodos.has(todo.id)){
        return false
      }else{
        return true
      }
    })
    setTodos(newTodos)
    setSelectedTodos(new Set());
  }

  return (
    <div className="flex justify-center">
      <div className="w-2/3 flex-col gap-4 mt-15 bg-base-300 p-5 rounded-2xl">
        <div className="flex gap-4">
          <input type="text" className="input w-full" placeholder="Ajouter une tache..." value={input} onChange={(e) => setInput(e.target.value)} />
          
          <select className="select select-bordered" value={priority} onChange={(e) => setPriority(e.target.value as priority)}>
            <option value="urgente">Urgente</option>
            <option value="moyenne">Moyenne</option>
            <option value="basse">Basse</option>
          </select>

          <button onClick={addTodo} className="btn btn-primary">Ajouter</button>
        </div>

        <div className="space-y-2 flex-1 h-fit">
          <div className="flex item-center justify-between">
            <div className="flex flex-wrap gap-4 mt-3">
              <button 
                className={`btn btn-soft ${filter === "Tous" ? "btn-primary" : ""}`} 
                onClick={() => setFilter("Tous")}
              >
                Tous({totalCount})
              </button>

              <button 
                className={`btn btn-soft ${filter === "urgente" ? "btn-primary" : ""}`} 
                onClick={() => setFilter("urgente")}
              >
                Urgente({urgentCount})
              </button>

              <button 
                className={`btn btn-soft ${filter === "moyenne" ? "btn-primary" : ""}`} 
                onClick={() => setFilter("moyenne")}
              >
                Moyenne({mediumCount})
              </button>

              <button 
                className={`btn btn-soft ${filter === "basse" ? "btn-primary" : ""}`} 
                onClick={() => setFilter("basse")}
              >
                Basse({lowCount})
              </button>

              
            </div>
            <button 
              onClick={finishSelected}
              className="btn btn-primary mt-5" 
              disabled={selectedTodos.size == 0}>
              Finir la Selection 
            </button>
          </div>
          

          {filteredTodos.length > 0 ? ( 
            <ul className="divide-y divide-primary/20">
              {filteredTodos.map((todo) => (
                <li key={todo.id} className="py-2">
                  <TodoItem 
                    todo={todo}
                    isSelected={selectedTodos.has(todo.id)}
                    onDelete={() => deleteTodo(todo.id)}
                    onToggleSelect={() => toggleSelectTodo(todo.id)}
                  />
                </li>
              ))}
            </ul>
          ) : (

            <div className="flex justify-center item-center flex-col p-5">
              <div>
                <Construction strokeWidth={1} className="w-40 h-40 mx-auto mt-3 text-primary"/>
              </div>
              <p className="text-center text-primary/50 mt-5">Aucune tache</p>

            </div>
          )}

        </div>
        
      </div>
    </div>
  )
}

export default App
