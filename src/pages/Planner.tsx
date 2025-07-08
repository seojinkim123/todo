import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabase';
import { useAuth } from '../store/AuthContext';

interface Todo {
  id: string;
  title: string;
  due_date: string;
  is_done: boolean;
}

const days = ['일', '월', '화', '수', '목', '금', '토'];

function getWeekDates() {
  const today = new Date();
  const week: string[] = [];
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    week.push(d.toISOString().slice(0, 10));
  }
  return week;
}

const Planner = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const weekDates = getWeekDates();

  useEffect(() => {
    const fetchTodos = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('id, title, due_date, is_done')
        .eq('user_id', user.id)
        .in('due_date', weekDates);
      if (!error && data) setTodos(data as Todo[]);
      setLoading(false);
    };
    fetchTodos();
    // eslint-disable-next-line
  }, [user]);

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">주간 플래너</h1>
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date, idx) => (
          <div key={date} className="bg-gray-50 rounded p-2 min-h-[120px] flex flex-col">
            <div className="font-bold text-center mb-2">{days[idx]}</div>
            <ul className="flex-1 space-y-1">
              {todos.filter(t => t.due_date === date).length === 0 ? (
                <li className="text-xs text-gray-400 text-center">할일 없음</li>
              ) : (
                todos.filter(t => t.due_date === date).map(t => (
                  <li key={t.id} className={`text-xs ${t.is_done ? 'line-through text-gray-400' : ''}`}>{t.title}</li>
                ))
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Planner; 