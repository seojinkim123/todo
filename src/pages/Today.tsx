import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabase';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'react-feather';
import { useAuth } from '../store/AuthContext';

interface Todo {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: number;
  urgent: boolean;
  is_done: boolean;
  tag: string;
}

const Today = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [newPriority, setNewPriority] = useState(3);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const navigate = useNavigate();

  const today = new Date().toISOString().slice(0, 10);

  const fetchTodos = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .eq('due_date', today)
      .order('priority', { ascending: true });
    if (!error && data) setTodos(data as Todo[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line
  }, [user]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !user) return;
    setAdding(true);
    const { error } = await supabase.from('todos').insert([
      {
        user_id: user.id,
        title: newTitle,
        due_date: newDueDate,
        priority: newPriority,
        urgent: false,
        is_done: false,
        tag: '',
      },
    ]);
    setAdding(false);
    setNewTitle('');
    setNewDueDate(today);
    setNewPriority(3);
    setShowInput(false);
    if (!error) fetchTodos();
  };

  const handleToggleDone = async (id: string, is_done: boolean) => {
    setUpdating(id);
    await supabase.from('todos').update({ is_done: !is_done }).eq('id', id);
    setUpdating(null);
    fetchTodos();
  };

  const handleDelete = async (id: string) => {
    setUpdating(id);
    await supabase.from('todos').delete().eq('id', id);
    setUpdating(null);
    fetchTodos();
  };

  return (
    <div className="p-4 pb-24 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">오늘의 할일</h1>
      {showInput && (
        <form onSubmit={handleAddTodo} className="card mb-6 space-y-3">
          <input
            type="text"
            className="input"
            placeholder="할일을 입력하세요"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            disabled={adding}
            autoFocus
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs mb-1">마감일</label>
              <input
                type="date"
                className="input"
                value={newDueDate}
                onChange={e => setNewDueDate(e.target.value)}
                disabled={adding}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs mb-1">우선순위</label>
              <select
                className="input"
                value={newPriority}
                onChange={e => setNewPriority(Number(e.target.value))}
                disabled={adding}
              >
                <option value={1}>1 (최상)</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5 (최하)</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1" disabled={adding}>추가</button>
            <button type="button" className="btn-primary bg-gray-200 text-gray-700 hover:bg-gray-300 flex-1" onClick={() => setShowInput(false)}>취소</button>
          </div>
        </form>
      )}
      {loading ? (
        <p className="text-center text-gray-400">로딩 중...</p>
      ) : todos.length === 0 ? (
        <div className="card text-center text-gray-400">오늘 할일이 없습니다.</div>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li key={todo.id} className="card flex flex-col gap-1 relative group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.is_done}
                    onChange={() => handleToggleDone(todo.id, todo.is_done)}
                    disabled={updating === todo.id}
                    className="accent-blue-600 w-5 h-5"
                  />
                  <span
                    className={`font-semibold cursor-pointer text-lg ${todo.is_done ? 'line-through text-gray-400' : ''}`}
                    onClick={() => navigate(`/todo/${todo.id}`)}
                  >
                    {todo.title}
                  </span>
                  {todo.urgent && <span className="text-red-500 text-xs ml-2">긴급</span>}
                </div>
                <button
                  className="text-xs text-red-400 hover:text-red-600 ml-2 opacity-0 group-hover:opacity-100 transition"
                  onClick={() => handleDelete(todo.id)}
                  disabled={updating === todo.id}
                >
                  삭제
                </button>
              </div>
              {todo.description && <div className="text-sm text-gray-500">{todo.description}</div>}
              <div className="flex justify-between text-xs mt-1 text-gray-500">
                <span>마감: {todo.due_date}</span>
                <span>우선순위: {todo.priority}</span>
                <span>태그: {todo.tag}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button className="fab" onClick={() => setShowInput(true)} title="할일 추가">
        <Plus size={28} />
      </button>
    </div>
  );
};

export default Today; 