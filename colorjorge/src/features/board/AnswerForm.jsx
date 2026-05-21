import { useState } from 'react';
import '../master/KeywordForm.css';

function AnswerForm({ onSubmit }) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = event => {
    event.preventDefault();

    const cleanAnswer = answer.trim();
    if (!cleanAnswer) {
      return;
    }

    if (onSubmit) {
      onSubmit(cleanAnswer);
    }

    setAnswer('');
  };

  return (
    <form className="keyword-form" onSubmit={handleSubmit}>
      <label htmlFor="answer-input" className="keyword-label">
        Sua resposta
      </label>
      <input
        id="answer-input"
        name="answer"
        type="text"
        className="keyword-input"
        placeholder="Ex: azul escuro"
        autoComplete="off"
        value={answer}
        onChange={event => setAnswer(event.target.value)}
      />
      <button type="submit" className="submit-button">
        Enviar resposta
      </button>
    </form>
  );
}

export default AnswerForm;
