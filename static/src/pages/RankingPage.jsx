import React from 'react';
import { useSelector } from 'react-redux';
import SaveButton from './SaveButton';
import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '../util/http';
import player1Image from "../../src/img/player1.jpg";
import './Ranking.css';

let userNum = 0;

function UserStats() {
  const { username, gamesPlayed, wins, losses, draws } = useSelector((state) => state.user);
  const { data = [], error } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  if (error) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="rank-page">
      <div className="playerInfo">
        <div className="pfp">
          <img src={player1Image} alt="player pfp" />
        </div>
        <div className="player-name">{username}</div>

        <div className="player-stats">
          <div className="stat">
            Wins: <span className='user-info win'>{wins}</span>
          </div>
          <div className="stat">
            Losses: <span className='user-info lose'>{losses}</span> 
          </div>
          <div className="stat">
            Draws: <span className='user-info'>{draws}</span> 
          </div>
          <div className="stat">
            Games Played: <span className='user-info'>{gamesPlayed}</span> 
          </div>
          <SaveButton />
        </div>
      </div>
      <div className="rant-table-container">
        <table className="rank-table">
          <caption>Global Ranking</caption>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Draws</th>
              <th>Games Played</th>
            </tr>
          </thead>
          <tbody>
            {data.map((player, index) => (
              <tr key={index}>
                <td className="firstcol">{++userNum}</td> {/* Increment userNum correctly */}
                <td className='user-info'>{player.username}</td>
                <td className='user-info win'>{player.wins}</td>
                <td className='user-info lose'>{player.losses}</td>
                <td className='user-info'>{player.draws}</td>
                <td className='user-info'>{player.gamesPlayed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserStats;
