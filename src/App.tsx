import { KanbanTable } from './components/KanbanTable';

function App() {
  return (
    <div className="h-screen w-screen bg-[#1c1b20]">
      <div className="container mx-auto flex h-full flex-col">
        <div className="mx-auto w-max py-6 text-xl font-bold text-white">Kanban App</div>
        <div className="flex-1 py-4">
          <KanbanTable />
        </div>
      </div>
    </div>
  );
}

export default App;
