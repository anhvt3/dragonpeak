import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MOBILE_BREAKPOINT = 768;

const AutoRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    navigate(isMobile ? "/mobile" : "/desktop", { replace: true });
  }, [navigate]);

  // No UI - just redirect
  return null;
};

export default AutoRedirect;
