interface ToolbarProps {
    brushes: any[];
    selectedIndex: number;
    onSelect: (index: number) => void;
    onCreate: () => void;
}

function Toolbar({ brushes, selectedIndex, onSelect, onCreate }: ToolbarProps) {
    return (
        <div style={{ width: '140px', borderRight: '1px solid #ccc', padding: '8px' }}>
            <button onClick={onCreate} style={{ marginBottom: '10px' }}>+ Nova Textura</button>
            {brushes.map((_, i) => (
                <button key={i} onClick={() => onSelect(i)} style={{ display: 'block', margin: '4px 0' }}>
                    Brush {i + 1}
                </button>
            ))}
        </div>
    );
}

export default Toolbar;
