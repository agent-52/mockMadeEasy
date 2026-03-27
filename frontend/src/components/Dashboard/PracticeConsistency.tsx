export function PracticeConsistency({practiceConsistency}:{practiceConsistency: {sessionsThisWeek: number}}) {
  const message = `You’ve practiced ${practiceConsistency.sessionsThisWeek} times this week.`;

  return (
    <section className="subtle flexC gap2 padY5 borderB">
      <strong className="fL">Practice consistency</strong>
      <p className="textSecondary fM">{message}</p>
    </section>
  );
}
