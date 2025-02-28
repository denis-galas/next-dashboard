'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function AddCustomerModal({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) {
    const [render, setRender] = useState(false);

    useEffect(()=>{
        setRender(true)
    },[])

    useEffect(()=>{
        function handler(e: KeyboardEvent){
            if(e.key === "Escape") onClose()
        }
        document.addEventListener("keydown",handler)
        return ()=>{
            document.removeEventListener("keydown",handler)
        }
    },[onClose])

    return render ? createPortal(
        <div className={`modal-overlay ${isOpen && "show"}` }>
            {children}
        </div>
        ,document.querySelector("#modal-container") as Element) : null;
}

