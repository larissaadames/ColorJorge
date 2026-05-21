import './AnswerList.css';

function AnswerList({ answers, title = 'Respostas dos jogadores' }) {
  return (
    <section className="answer-list" aria-label={title}>
      <h2 className="answer-list-title">{title}</h2>

      {answers.length === 0 ? (
        <p className="answer-list-empty">Nenhuma resposta recebida ainda.</p>
      ) : (
        <ul className="answer-list-items">
          {answers.map((answer, index) => (
            <li key={`${answer.playerId}-${answer.at}-${index}`} className="answer-list-item">
              <span className="answer-list-player">Jogador {answer.playerId.slice(0, 6)}</span>
              <p className="answer-list-text">{answer.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default AnswerList;
