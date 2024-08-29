import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import Modal from '../UI/Modal'; // Import the Modal component

// Define Action function to post data
async function Action({ username, gamesPlayed, wins, losses, draws }) {
  const response = await fetch('http://localhost:2000/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, gamesPlayed, wins, losses, draws }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Profile data successfully posted:', data);
  return data;
}

// SaveButton component
function SaveButton() {
  const { username, gamesPlayed, wins, losses, draws } = useSelector((state) => state.user);
  const [lastGamesPlayed, setLastGamesPlayed] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {}, onCancel: () => {} });

  const mutation = useMutation({
    mutationFn: () => Action({ username, gamesPlayed, wins, losses, draws }),
    onError: (error) => {
      setModal({
        isOpen: true,
        title: 'Error',
        message: 'Failed to save data. Please try again.',
        onConfirm: () => setModal((prev) => ({ ...prev, isOpen: false })),
        onCancel: () => setModal((prev) => ({ ...prev, isOpen: false })),
      });
    },
    onSuccess: () => {
      setModal({
        isOpen: true,
        title: 'Success',
        message: 'Data saved successfully!',
        onConfirm: () => {
          setModal((prev) => ({ ...prev, isOpen: false }));
          setLastGamesPlayed(gamesPlayed);
        },
        onCancel: () => setModal((prev) => ({ ...prev, isOpen: false })),
      });
    }
  });

  const handleClick = () => {
    if (gamesPlayed !== lastGamesPlayed) {
      mutation.mutate();
    } else {
      setModal({
        isOpen: true,
        title: 'No Changes',
        message: 'No changes detected. Nothing to save.',
        onConfirm: () => setModal((prev) => ({ ...prev, isOpen: false })),
        onCancel: () => setModal((prev) => ({ ...prev, isOpen: false })),
      });
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={mutation.isLoading}>
        {mutation.isLoading ? 'Saving...' : 'Save'}
      </button>
      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
      />
    </div>
  );
}

export default SaveButton;
