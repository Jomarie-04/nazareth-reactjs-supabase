import { useEffect, useState } from 'react';
import { supabase, Task } from './lib/supabase';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('webtask')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetch task', error.message);
      return;
    }

    console.log('Succesful fetch');
    setTasks(data || []);
  };

  const submitTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim()) return;

    const { error } = await supabase
      .from('webtask')
      .insert([{ title: newTitle, description: newDescription }]);

    if (error) {
      console.error('Error insert task', error.message);
      return;
    }

    console.log('Succesful insert');
    setNewTitle('');
    setNewDescription('');
    fetchTasks();
  };

  const updateTask = async (id: number) => {
    const { error } = await supabase
      .from('webtask')
      .update({ description: newDescription })
      .eq('id', id);

    if (error) {
      console.error('Error update task', error.message);
      return;
    }

    console.log('Succesful update');
    setNewDescription('');
    setEditingTask(null);
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    const { error } = await supabase
      .from('webtask')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error delete task', error.message);
      return;
    }

    console.log('Succesful delete');
    setEditingTask(null);
    fetchTasks();
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
    setNewDescription(task.description);
  };

  return (
    <>
      <h1>Supabase x React js</h1>

      <form onSubmit={submitTask}>
        <input
          type="text"
          placeholder="Title Here"
          required
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea
          placeholder="Description Here"
          required
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>

              {editingTask?.id === task.id ? (
                <>
                  <textarea
                    placeholder="Edit description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                  <button onClick={() => updateTask(task.id)}>Update Task</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEditing(task)}>Update Task</button>
                </>
              )}

              <button onClick={() => deleteTask(task.id)}>Delete Task</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
