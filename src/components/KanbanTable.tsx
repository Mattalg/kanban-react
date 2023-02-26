import tasksJson from '@/assets/tasks.json';
import { atom } from 'jotai';
import { useAtom } from 'jotai/react';
import { useState } from 'react';

type TaskType = 'todo' | 'progress' | 'done';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskType;
}

const tasksAtom = atom<Task[]>(tasksJson.tasks as Task[]);
const draggingAtom = atom<Task | null>(null);

export function KanbanTable() {
  const [tasks] = useAtom(tasksAtom);

  const todos = tasks.filter(({ status }) => status === 'todo');
  const progress = tasks.filter(({ status }) => status === 'progress');
  const dones = tasks.filter(({ status }) => status === 'done');

  return (
    <>
      <div className="grid h-full grid-cols-3 gap-5">
        <Column type="todo" color="bg-green-400" tasks={todos} />
        <Column type="progress" color="bg-yellow-400" tasks={progress} />
        <Column type="done" color="bg-purple-400" tasks={dones} />
      </div>
    </>
  );
}

function Column({ type, color, tasks }: { type: TaskType; color: string; tasks: Task[] }) {
  const [dragging, setDragging] = useAtom(draggingAtom);
  const [overed, setOvered] = useState(false);
  const [, setData] = useAtom(tasksAtom);

  function handleDrop(event: React.DragEvent) {
    if (!dragging) return;

    setData((state) => [
      ...state.filter(({ id }) => id !== dragging.id),
      {
        ...dragging,
        status: type,
      },
    ]);
    setDragging(null);
    setOvered(false);
  }

  function handleDragEnter(event: React.DragEvent) {
    setOvered(true);
  }

  function handleDragLeave(event: React.DragEvent) {
    setOvered(false);
  }

  function handleDragOver(event: React.DragEvent) {
    event.preventDefault();
  }

  function dynamicClass() {
    if (!dragging) return 'border-transparent bg-[#29282d]';

    if (overed) {
      return ['bg-[#2f2e34]', 'border-white'].join(' ');
    }

    return ['bg-[#29282d]', 'border-[#4a4950]'].join(' ');
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <div className={['h-3 w-3 rounded-full', color].join(' ')}></div>
        <h4 className="text-sm font-bold uppercase text-gray-400">{type}</h4>
      </div>
      <div
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        className={[
          'relative mt-4 flex flex-1 flex-col gap-3 overflow-hidden rounded-lg border-[3px] border-dashed p-3',
          dynamicClass(),
        ].join(' ')}>
        {tasks.map((item) => (
          <Card key={item.id} task={item} />
        ))}
      </div>
    </div>
  );
}

const Card: React.FC<{ task: Task }> = ({ task }: { task: Task | null }) => {
  const [dragging, setDragging] = useAtom(draggingAtom);

  function handleDragStart(event: React.DragEvent) {
    setDragging(task);
  }

  function handleDragEnd(event: React.DragEvent) {
    setDragging(null);
  }

  return (
    <>
      <div
        draggable
        className={[
          'relative z-50 rounded-lg bg-[#36353a] px-4 py-2',
          dragging && task && dragging.id === task.id && 'opacity-50',
        ].join(' ')}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}>
        <h3 className="font-bold text-white">{task?.title}</h3>
        <div className="text-gray-400">{task?.description}</div>
      </div>
    </>
  );
};
