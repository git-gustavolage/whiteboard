import { useState, createContext } from 'react';
import Canvas from './main/Canvas';
import Sidebar from './view/Sidebar';
import Palette from './lib/core/Palette';
import Color from './lib/core/Color';

type VectorShape = { id: string; type: 'path'; props: any; fill: string; };
type History = { past: VectorShape[][]; present: VectorShape[]; future: VectorShape[][]; };
interface ComicPanel { id: string; history: History; filters: string; }

const LibraryContext = createContext({ library: [] as any[], addItem: (_: any) => {} });

export function initHistory(): History {
  return { past: [], present: [], future: [] };
}

export default function App() {
  const [currentColor, setCurrentColor] = useState<Color>(Palette[0]);
  const [panels, setPanels] = useState<ComicPanel[]>([{ id: String(Date.now()), history: initHistory(), filters: 'none' }]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Panel operations
  const addPanel = () => {
    const newPanel = { id: String(Date.now()), history: initHistory(), filters: 'none' };
    setPanels(prev => [...prev, newPanel]);
    setSelectedIndex(panels.length);
  };
  const selectPanel = (idx: number) => setSelectedIndex(idx);

  // Undo/Redo for selected panel
  const updatePanelHistory = (updater: (h: History) => History) => {
    setPanels(prev => prev.map((p, i) => i === selectedIndex ? { ...p, history: updater(p.history) } : p));
  };
  
  const undo = () => {
    const { past, present, future } = panels[selectedIndex].history;
    if (!past.length) return;
    const previous = past[past.length - 1];
    updatePanelHistory(() => ({ past: past.slice(0, -1), present: previous, future: [present, ...future] }));
  };

  const redo = () => {
    const { past, present, future } = panels[selectedIndex].history;
    if (!future.length) return;
    const next = future[0];
    updatePanelHistory(() => ({ past: [...past, present], present: next, future: future.slice(1) }));
  };
  const canUndo = panels[selectedIndex].history.past.length > 0;
  const canRedo = panels[selectedIndex].history.future.length > 0;

  // Shape update for selected panel
  const setShapes = (newShapes: VectorShape[]) => {
    const { history } = panels[selectedIndex];
    updatePanelHistory(() => ({ past: [...history.past, history.present], present: newShapes, future: [] }));
  };

  const shapes = panels[selectedIndex].history.present;
  const panelFilter = panels[selectedIndex].filters;

  return (
    <LibraryContext.Provider value={{ library: [], addItem: () => {} }}>
      <div className="flex h-screen">
        <Sidebar
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          panels={panels}
          selectedIndex={selectedIndex}
          addPanel={addPanel}
          selectPanel={selectPanel}
        />
        <Canvas
          shapes={shapes}
          setShapes={setShapes}
          currentColor={currentColor}
          filter={panelFilter}
        />
        <div className="w-64 p-4 bg-gray-50" />
      </div>
    </LibraryContext.Provider>
  );
}
