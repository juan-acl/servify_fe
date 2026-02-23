export const Branding = () => {
  return (
    <div className="auth-right">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />
      <div className="auth-orb auth-orb-4" />
      <div className="auth-right-overlay" />

      <div className="auth-right-content">
        <div className="auth-brand-icon">🔧</div>
        <h2 className="auth-brand-title">Servify</h2>
        <p className="auth-brand-subtitle">
          Conectamos a los mejores profesionales con quienes los necesitan.
          Servicios para el hogar en Guatemala, al alcance de un click.
        </p>

        <div className="auth-stats">
          <div>
            <div className="auth-stat-value">500+</div>
            <div className="auth-stat-label">Profesionales</div>
          </div>
          <div>
            <div className="auth-stat-value">2,000+</div>
            <div className="auth-stat-label">Servicios</div>
          </div>
          <div>
            <div className="auth-stat-value">4.8★</div>
            <div className="auth-stat-label">Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};
