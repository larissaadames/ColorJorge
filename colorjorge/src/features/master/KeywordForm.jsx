import { useState } from 'react';
import './KeywordForm.css';

function KeywordForm({ onSubmit }) {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = event => {
    event.preventDefault();

    const cleanKeyword = keyword.trim();
    if (!cleanKeyword) {
      return;
    }

    if (onSubmit) {
      onSubmit(cleanKeyword);
    }

    setKeyword('');
  };

  return (
    <form className="keyword-form" onSubmit={handleSubmit}>
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
        value={keyword}
        onChange={event => setKeyword(event.target.value)}
      />
      <button type="submit" className="submit-button">
        Enviar pista
      </button>
    </form>
  );
}

export default KeywordForm;
