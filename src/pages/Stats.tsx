import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabase';
import { useAuth } from '../store/AuthContext';

interface Todo {
  id: string;
  is_done: boolean;
  tag: string;
  due_date: string;
}

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

const Stats = () => {
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
        .select('id, is_done, tag, due_date')
        .eq('user_id', user.id)
        .in('due_date', weekDates);
      if (!error && data) setTodos(data as Todo[]);
      setLoading(false);
    };
    fetchTodos();
    // eslint-disable-next-line
  }, [user]);

  // 통계 계산
  const total = todos.length;
  const completed = todos.filter(t => t.is_done).length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
  const postponedTags = todos.filter(t => !t.is_done).map(t => t.tag).filter(Boolean);
  const mostPostponedTag = (() => {
    if (postponedTags.length === 0) return '-';
    const freq: Record<string, number> = {};
    postponedTags.forEach(tag => { freq[tag] = (freq[tag] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
  })();

  return (
    <div className="p-4 pb-20 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">통계</h1>
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded shadow p-4 flex flex-col items-center">
            <div className="text-lg font-semibold mb-2">이번 주 완료율</div>
            <div className="text-3xl font-bold text-blue-600">{completionRate}%</div>
            <div className="text-xs text-gray-500 mt-1">({completed} / {total}건 완료)</div>
          </div>
          <div className="bg-white rounded shadow p-4 flex flex-col items-center">
            <div className="text-lg font-semibold mb-2">가장 자주 미루는 태그</div>
            <div className="text-xl font-bold text-red-500">{mostPostponedTag}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats; 