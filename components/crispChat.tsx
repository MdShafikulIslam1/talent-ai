"use client";
import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";

const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("bc72f7a4-51e7-4eca-a3fc-7fca33cafa96");
  }, []);
  return null;
};

export default CrispChat;
