import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-detect device based on user agent and screen width
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) 
      || window.innerWidth < 768;
    
    navigate(isMobile ? "/mobile" : "/desktop", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-tet-cream to-tet-peach">
      <span className="text-xl font-semibold text-tet-red">Đang tải...</span>
    </div>
  );
};

export default Index;
