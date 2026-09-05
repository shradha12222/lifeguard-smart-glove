import { useEffect } from "react";

function BotpressChat() {
  useEffect(() => {
    // Botpress Webchat scripts
    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v3.7/shareable.html?configUrl=https://files.bpcontent.cloud/2026/06/09/09/20260609094305-8VAUE130.json";
    script1.async = true;

    const script2 = document.createElement("script");
    script2.src = "https://cdn.botpress.cloud/webchat/v3.7/shareable.html?configUrl=https://files.bpcontent.cloud/2026/06/09/09/20260609094305-8VAUE130.json";
    script2.async = true;

    document.body.appendChild(script1);
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  return null;
}

export default BotpressChat;
