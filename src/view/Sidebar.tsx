import palette from "../lib/core/Palette";

function Sidebar({ currentColor, setCurrentColor, onUndo, onRedo, canUndo, canRedo, panels, selectedIndex, addPanel, selectPanel }: any) {

  return (
    <div className="w-64 p-4 bg-gray-100 flex flex-col space-y-4">
      <div className="flex space-x-2">
        <button onClick={onUndo} disabled={!canUndo} className="px-2 py-1 border rounded">Voltar</button>
        <button onClick={onRedo} disabled={!canRedo} className="px-2 py-1 border rounded">Avançar</button>
      </div>

      <button onClick={addPanel} className="w-full p-2 bg-blue-500 text-white rounded">+ Painel</button>

      <div className="flex-1 overflow-auto">
        {panels.map((p, i) => (
          <div
            key={p.id}
            onClick={() => selectPanel(i)}
            className={`p-2 mb-1 cursor-pointer border rounded ${selectedIndex === i ? 'bg-blue-200' : 'bg-white'}`}
          >
            Painel {i + 1}
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-bold">Paleta</h2>
        <div className="flex space-x-2 mt-2">
          {palette.map(col => (
            <div key={col}
              className={`w-6 h-6 rounded cursor-pointer border-2 ${currentColor === col ? 'border-black' : 'border-transparent'}`}
              style={{ backgroundColor: col }}
              onClick={() => setCurrentColor(col)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


export default Sidebar;