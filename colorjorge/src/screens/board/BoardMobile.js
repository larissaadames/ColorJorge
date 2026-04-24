import React, { useState, useEffect } from 'react';
import GameShell from '../../components/game/GameShell';

function BoardMobile() {
  const [colors, setColors] = useState([]);
  const [selected, setSelected] = useState(null);
  const rows = 16;
  const cols = 16;

  // Gera um tabuleiro de cores aleatórias para teste
  useEffect(() => {
    const testColors = Array.from({ length: rows * cols }, () => {
      const h = Math.floor(Math.random() * 360);
      return `hsl(${h}, 70%, 50%)`;
    });
    setColors(testColors);
  }, []);

  const handleSelect = (index) => {
    // Cálculo das coordenadas (A-P para colunas, 1-16 para linhas)
    const colLabel = String.fromCharCode(65 + (index % cols));
    const rowLabel = Math.floor(index / cols) + 1;
    
    setSelected({
      index,
      coord: `${colLabel}${rowLabel}`,
      color: colors[index]
    });

    // Feedback visual no console
    console.log(`Clicou em: ${colLabel}${rowLabel}`);
  };

  return (
    <GameShell panelLabel="TESTE DE TABULEIRO">
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '10px',
        backgroundColor: '#1a1a1a', // Fundo escuro para destacar as cores
        minHeight: '80vh'
      }}>
        
        {/* TABULEIRO (GRID) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: '1px',
          width: '100%',
          maxWidth: '380px',
          backgroundColor: '#000',
          border: '2px solid #333'
        }}>
          {colors.map((color, i) => (
            <div
              key={i}
              onClick={() => handleSelect(i)}
              style={{
                backgroundColor: color,
                aspectRatio: '1 / 1',
                cursor: 'pointer',
                border: selected?.index === i ? '2px solid white' : 'none',
                boxSizing: 'border-box'
              }}
            />
          ))}
        </div>

        {/* ÁREA DE FEEDBACK (ZOOM) */}
        <div style={{ 
          marginTop: '20px', 
          width: '100%', 
          textAlign: 'center',
          color: '#fff',
          fontFamily: 'monospace'
        }}>
          {selected ? (
            <div style={{ 
              border: '2px solid #555', 
              padding: '15px', 
              borderRadius: '8px',
              backgroundColor: '#222'
            }}>
              <p style={{ fontSize: '18px', margin: '0 0 10px 0' }}>
                SELECIONADO: <span style={{ color: '#0f0' }}>{selected.coord}</span>
              </p>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: selected.color,
                margin: '0 auto',
                border: '4px solid #fff',
                boxShadow: '0 0 15px rgba(255,255,255,0.3)'
              }} />
              <button 
                style={{
                  marginTop: '15px',
                  padding: '8px 20px',
                  backgroundColor: '#0f0',
                  color: '#000',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onClick={() => alert(`Voto enviado: ${selected.coord}`)}
              >
                CONFIRMAR VOTO
              </button>
            </div>
          ) : (
            <p style={{ color: '#888' }}>Toque em uma cor no tabuleiro</p>
          )}
        </div>
      </div>
    </GameShell>
  );
}

export default BoardMobile;