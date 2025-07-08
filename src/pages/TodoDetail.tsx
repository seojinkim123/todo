import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../api/supabase';

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

const TodoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 3,
    urgent: false,
    tag: '',
  });

  useEffect(() => {
    const fetchTodo = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('todos').select('*').eq('id', id).single();
      if (!error && data) {
        setTodo(data as Todo);
        setForm({
          title: data.title,
          description: data.description || '',
          due_date: data.due_date,
          priority: data.priority,
          urgent: data.urgent,
          tag: data.tag || '',
        });
      }
      setLoading(false);
    };
    if (id) fetchTodo();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === 'checkbox') {
      fieldValue = (e.target as HTMLInputElement).checked;
    }
    setForm((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    await supabase.from('todos').update({
      ...form,
    }).eq('id', id);
    setSaving(false);
    navigate('/');
  };

  if (loading) return <div className="p-4">로딩 중...</div>;
  if (!todo) return <div className="p-4">할일을 찾을 수 없습니다.</div>;

  return (
    <div className="p-4 pb-20 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">할일 상세/편집</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">제목</label>
          <input name="title" value={form.title} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">설명</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block mb-1 font-medium">마감일</label>
            <input type="date" name="due_date" value={form.due_date} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">우선순위</label>
            <select name="priority" value={form.priority} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value={1}>1 (최상)</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5 (최하)</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <label className="font-medium">긴급</label>
          <input type="checkbox" name="urgent" checked={form.urgent} onChange={handleChange} />
        </div>
        <div>
          <label className="block mb-1 font-medium">태그</label>
          <input name="tag" value={form.tag} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full" disabled={saving}>
          저장
        </button>
      </form>
    </div>
  );
};

export default TodoDetail; 