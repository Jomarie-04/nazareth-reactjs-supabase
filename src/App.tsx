import { useEffect, useState } from 'react';
import { supabase, Task } from './lib/supabase';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      setTasks(data || []);
    }
  };

  const addTask = async () => {
    if (!newTitle.trim()) return;

    const { error } = await supabase
      .from('tasks')
      .insert([{ title: newTitle, description: newDescription }]);

    if (error) {
      console.error('Error adding task:', error);
    } else {
      setNewTitle('');
      setNewDescription('');
      fetchTasks();
    }
  };

  const updateTask = async () => {
    if (!editingTask) return;

    const { error } = await supabase
      .from('tasks')
      .update({
        description: editDescription,
        updated_at: new Date().toISOString()
      })
      .eq('id', editingTask.id);

    if (error) {
      console.error('Error updating task:', error);
    } else {
      setEditingTask(null);
      setEditDescription('');
      fetchTasks();
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
    } else {
      setEditingTask(null);
      fetchTasks();
    }
  };

  const selectTask = (task: Task) => {
    setEditingTask(task);
    setEditDescription(task.description);
  };

  return (
    <div className="min-h-screen bg-neutral-800 text-white flex flex-col items-center py-16 px-4">
      <h1 className="text-5xl font-bold mb-12">Supabase x React js</h1>

      <div className="w-full max-w-2xl mb-12 flex gap-4">
        <input
          type="text"
          placeholder="Title Here"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="px-4 py-2 bg-transparent border border-neutral-600 focus:outline-none focus:border-neutral-400 flex-shrink-0 w-48"
        />
        <input
          type="text"
          placeholder="Description Here"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="px-4 py-2 bg-transparent border border-neutral-600 focus:outline-none focus:border-neutral-400 flex-1"
        />
        <button
          onClick={addTask}
          className="px-8 py-2 bg-white text-neutral-900 font-semibold hover:bg-neutral-200 transition-colors"
        >
          Add Task
        </button>
      </div>

      <div className="w-full max-w-2xl space-y-8">
        {tasks.map((task) => (
          <div key={task.id} className="border-l-4 border-white pl-8">
            <h2 className="text-3xl font-bold mb-4">{task.title}</h2>
            <p className="text-lg mb-6 text-neutral-300">Description</p>

            {editingTask?.id === task.id ? (
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Edit description"
                className="w-full px-4 py-3 bg-transparent border border-neutral-600 focus:outline-none focus:border-neutral-400 mb-4 resize-none"
                rows={3}
              />
            ) : (
              <p className="text-neutral-400 mb-6">{task.description}</p>
            )}

            <div className="flex gap-4">
              {editingTask?.id === task.id ? (
                <button
                  onClick={updateTask}
                  className="px-6 py-2 bg-white text-neutral-900 font-semibold hover:bg-neutral-200 transition-colors"
                >
                  Update Task
                </button>
              ) : (
                <button
                  onClick={() => selectTask(task)}
                  className="px-6 py-2 bg-white text-neutral-900 font-semibold hover:bg-neutral-200 transition-colors"
                >
                  Update Task
                </button>
              )}
              <button
                onClick={() => deleteTask(task.id)}
                className="px-6 py-2 bg-white text-neutral-900 font-semibold hover:bg-neutral-200 transition-colors"
              >
                Delete Task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
