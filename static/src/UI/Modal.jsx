// components/Modal.jsx
import React from 'react';
import './Modal.css'; // Your CSS for styling the modal

function Modal({ isOpen, onClose, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onConfirm}>OK</button>
        <button onClick={onCancel || onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default Modal;
