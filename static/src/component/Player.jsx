import { useState } from "react"

export default function Player({initialName, isActive}) {
    const [PlayerName, setPlayerName] = useState(initialName);

    function handleChange(event) {
        setPlayerName(event.target.value)
    }

    let editablePlayerName = <span className="player-name">{PlayerName}</span>;
    return (
        <li className= {isActive ? 'active' : undefined}>
            <span className="player">
                {editablePlayerName}
            </span>
        </li>
    )
}
