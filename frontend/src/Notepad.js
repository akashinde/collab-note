import { useEffect, useState } from "react";
import { useSyncState } from "./SyncProvider";

export default function Notepad() {
    const [notepad, setNotepad] = useState({value: ''});
    const [syncPad, setSyncPad] = useSyncState('notepad');

    const handleChange = (e) => {
        setNotepad({...notepad, value: e.target.value});
    }

    const handleKeyUp = (e) => {
        const syncKeys = [32, 13, 8, 188, 190]
        if (syncKeys.includes(e.keyCode)) {
            setSyncPad(notepad)
        }
    }

    useEffect(() => {
        setNotepad(prevState => {
            return {value: syncPad && syncPad.value}
        })
    }, [syncPad])

    return (
        <>
            <h1>
                Collab Note
            </h1>
            <div className="input-area-container">
                <textarea onKeyUp={handleKeyUp} onChange={handleChange} id="notepad" class="input-area" value={notepad.value}></textarea>
            </div>
        </>
    )
}