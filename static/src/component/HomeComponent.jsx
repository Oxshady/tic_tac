import React from 'react'
import "./HomeComponent.css"
import ImgTic from '../img/game-logo.png'
import { Link } from 'react-router-dom'

function HomeComponent() {
  return (
     <>
        <header>
            <img src={ImgTic} alt="Hand drow tic tac toe game board" />
            <h1 className='home-title'>Tic-Tac-Toe</h1>
            <p className='home-txt'>Play the classic game of Tic-Tac-Toe with a friend or against the computer.</p>
            <Link to="game" className='btn play-now'>Play Now</Link>
        </header>
     </>
  )
}

export default HomeComponent