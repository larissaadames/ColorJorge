import './MasterScreen.css';

function MasterScreen() {
  const handleKeywordSubmit = event => {
    event.preventDefault();
  };

  return (
    <main className="master-screen">
      <div className="grain-overlay" aria-hidden="true" />

      <p className="brand">VisaoMaster</p>

      <section className="master-panel" aria-label="Tela mestre do jogo">
        <nav className="role-nav" aria-label="Navegacao da tela">
          <button type="button" className="role-tab role-tab-active">
            <span className="tab-icon tab-icon-diamond" aria-hidden="true" />
            <span className="tab-label">Mestre</span>
          </button>

          <button type="button" className="role-tab">
            <span className="tab-icon tab-icon-circle" aria-hidden="true" />
            <span className="tab-label">Tabuleiro</span>
          </button>

          <button type="button" className="role-tab">
            <span className="tab-icon tab-icon-star" aria-hidden="true" />
            <span className="tab-label">Placar</span>
          </button>
        </nav>

        <article className="color-card">
          <div className="color-preview" role="img" aria-label="Cor sorteada da rodada" />
          <p className="color-code">F 29</p>
        </article>

        <form className="keyword-form" onSubmit={handleKeywordSubmit}>
          <label htmlFor="keyword-input" className="keyword-label">
            Palavra chave
          </label>
          <input
            id="keyword-input"
            name="keyword"
            type="text"
            className="keyword-input"
            placeholder="Ex: golfinho calmo"
            autoComplete="off"
          />
          <button type="submit" className="submit-button">
            Enviar pista
          </button>
        </form>
      </section>
    </main>
  );
}

export default MasterScreen;
