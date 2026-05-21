import './ScreenNoticeCard.css';

function ScreenNoticeCard({ title, text }) {
  return (
    <article className="screen-notice-card">
      <h1 className="screen-notice-title">{title}</h1>
      <p className="screen-notice-text">{text}</p>
    </article>
  );
}

export default ScreenNoticeCard;
