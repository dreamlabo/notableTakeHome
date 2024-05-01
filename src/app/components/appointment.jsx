'use client'

import { useState } from 'react';
import { IoMdClose } from "react-icons/io";
export default function Appointment({data, removeAppt, rowNum, kindOptions, updateAppointment}) {

    const getTime = (dateString) => {
        var date = new Date(dateString);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var time = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
        // console.log("Time: ", time)
        return time
    }

    const [isEditable, setIsEditable] = useState(false)
    const [editedTime, setEditedTime] = useState(getTime(data.date))
    const [firstName, setFirstName] = useState(data.patientFirstName)
    const [lastName, setLastName] = useState(data.patientLastName)
    const [apptKind, setApptKind] = useState(data.kind)

    const renderTime = (dateString) => {
        const timestamp = new Date(dateString);
        const formattedTime = timestamp.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' });
        return formattedTime;
    }

    const deleteAppointment = () => {
        removeAppt(data._id)
    }

    const handleUpdate = () => {
        const updatedData = {
            patientFirstName: firstName,
            patientLastName: lastName,
            editedTime: editedTime,
            kind: apptKind,
            withDoctor: data.withDoctor,
            apptId: data._id
        }
        updateAppointment(updatedData);
        setIsEditable(false)
    }

    const handleCancelBtn = () => {
        setIsEditable(false);
        setFirstName(data.patientFirstName);
        setLastName(data.patientLastName);
        setEditedTime(getTime(data.date));
        setApptKind(data.kind)
    }

    return (
        <>
            {isEditable ? 
                (
                    <tr>
                        <td datecell="list-item-num">
                            {rowNum}
                        </td>
                        <td datecell="Name" className='edit-patient-name-cell'>
                            <label htmlFor='first-name'>First name</label>
                            <input 
                                id='first-name'  
                                value={firstName} 
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <label className='last-name' htmlFor='last-name'>Last name</label>
                            <input 
                                id="last-name" 
                                value={lastName} 
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </td>
                        <td datacell="Time">
                            <input 
                                type="time" 
                                value={editedTime} 
                                onChange={e => setEditedTime(e.target.value)} 
                                className="input-time"
                                
                            />
                        </td>
                        <td datecell="Kind">
                            <select value={apptKind}  onChange={e => setApptKind(e.target.value)}className="custom-select" name="kind" id="kind">
                                {kindOptions.map((option, index) => (
                                    <option key={option + index} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        </td>
                        <td datacell="Update">
                            <button onClick={handleUpdate} className="btn-edit">Update</button>
                        </td>
                        <td datecell="Remove">
                            <button onClick={handleCancelBtn} className="btn-edit">Cancel</button>
                        </td>
                    </tr>
                )
                : 
                (
                    <tr>
                        <td datecell="list-item-num">{rowNum}</td>
                        <td datecell="Name">{`${data.patientFirstName} ${data.patientLastName}`}</td>
                        <td datacell="Time">{renderTime(data.date)}</td>
                        <td datecell="Kind">{data.kind}</td>
                        <td datacell="Update">
                            <button onClick={() => setIsEditable(true)} className="btn-edit">Edit</button>
                        </td>
                        <td datecell="Remove">
                        <button className="btn-remove" 
                            aria-label="Delete appointment"
                            onClick={deleteAppointment}>
                            <IoMdClose className="btn-remove--icon" size={20} />
                        </button>
                        </td>
                    </tr>
                ) 
            }   
        </>
    )
}
