import './ColorCard.css';

type ColorCardProps = {
  code: string;
  color: string;
  colorLabel: string;
};

function ColorCard({ code, color, colorLabel }: ColorCardProps) {
  return (
    <article className="color-card">
      <div className="color-preview" style={{ backgroundColor: color }} role="img" aria-label={colorLabel} />
      <p className="color-code">{code}</p>
    </article>
  );
}

export default ColorCard;
