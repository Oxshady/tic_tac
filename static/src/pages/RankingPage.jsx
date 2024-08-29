import React from 'react';
import { useSelector } from 'react-redux';
import SaveButton from './SaveButton';
import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '../util/http';


function UserStats() {
  const { username, gamesPlayed, wins, losses, draws } = useSelector((state) => state.user);
    const {data, Error} = useQuery({
        queryKey: ['profile'],
        queryFn: fetchProfile
    });
    console.log(data)
  return (
    <div id="user-stats">
        <h2>User Stats</h2>
        <p>Username: {username}</p>
        <p>Games Played: {gamesPlayed}</p>
        <p>Wins: {wins}</p>
        <p>Losses: {losses}</p>
        <p>Draws: {draws}</p>
        <SaveButton />
    </div>
  );
}

export default UserStats;
