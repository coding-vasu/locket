export function AuroraBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Aurora Orbs */}
      <div
        className="aurora-orb"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4), transparent)',
          top: '10%',
          left: '20%',
          animationDelay: '0s',
        }}
      />
      <div
        className="aurora-orb"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.35), transparent)',
          top: '50%',
          right: '15%',
          animationDelay: '3s',
        }}
      />
      <div
        className="aurora-orb"
        style={{
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3), transparent)',
          bottom: '15%',
          left: '30%',
          animationDelay: '6s',
        }}
      />
      <div
        className="aurora-orb"
        style={{
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25), transparent)',
          top: '60%',
          left: '60%',
          animationDelay: '9s',
        }}
      />
    </div>
  );
}
