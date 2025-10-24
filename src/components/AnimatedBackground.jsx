import React from 'react';

export default function AnimatedBackground() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-pink-800 via-Fuchsia-100 to-rose-200">
      {/* Dégradé animé de fond */}
      <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/30 via-blue-500/20 to-white/10 animate-pulse"></div>
      
      {/* Bulles flottantes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/30 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-white/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-40 right-1/3 w-64 h-64 bg-violet-400/25 rounded-full blur-3xl animate-blob animation-delay-6000"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-8000"></div>
      
      {/* Petites bulles décoratives */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/10 backdrop-blur-sm animate-float"
          style={{
            width: `${Math.random() * 60 + 20}px`,
            height: `${Math.random() * 60 + 20}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 10 + 10}s`,
          }}
        ></div>
      ))}
      
      {/* Contenu de démonstration */}
      
      
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        
        .animate-blob {
          animation: blob 20s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        
        .animation-delay-8000 {
          animation-delay: 8s;
        }
        
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}