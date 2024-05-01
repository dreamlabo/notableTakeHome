'use client'
import { useState, useEffect} from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getBaseURL } from '@/utils/baseUrl';

import Appointment from './components/appointment';
import { GoDot } from "react-icons/go";

import Link from "next/link";


export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  let tableRowIndex = 1;
  const kindOptions = [
                        {
                          label: "New Patient",
                          value: "New Patient"
                        },
                        {
                          label: "Follow-up",
                          value: "Follow-up"
                        }
                      ];
  
 
  let id = searchParams.get('doctorId')
  let date = searchParams.get('date')
  const [doctors, setDoctors] = useState([])
  const [appts, setAppts] = useState([])

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [apptTime, setApptTime] = useState('')
  const [kind, setKind] = useState("New Patient")
  
  // const [apptDate, setApptDate] = useState('')
  const [viewDate, setViewDate] = useState(date)
  

  const getDoctors = async () => {
    const data = await fetch(`${getBaseURL()}/api/doctors`)
    const { doctors } = await data.json();
    setDoctors(doctors);

    if(!id) {
         id = doctors[0]._id
    }

    if(!date) {
      const today = new Date();
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      date = today.toLocaleDateString('en-CA', options).split('/').reverse().join('-');
    }
  }
  function getCurrentDoctorInfo() {
    // const d = doctors.find(doctor => doctor._id === id)
    return doctors.find(doctor => doctor._id === id)
  }

  function renderDoctorHeading() {
    const doctor = getCurrentDoctorInfo();
    return (
      <div>
        <h2>{`Dr. ${doctor?.firstName} ${doctor?.lastName}` }</h2>
        <a href="">{`${doctor?.lastName.toLowerCase()}@herohealth.com`}</a>
      </div>
    )
  }

  const getAppointments = async () => {
    const url = `${getBaseURL()}/api/appointments/byDoctor?doctorId=${id}&date=${date}`
    const response = await fetch(url)
    const info = await response.json()
    if(info.appointments) {
      setAppts(info.appointments)
    }
    else {
    }
  }

  const handleChangeDoctorView = (lastName, firstName, doctorId) => {
    router.push(`/?doctorId=${doctorId}&date=${date}`)
    // id = doctorId;
    // getAppointments()

  }

  const renderDoctors = () => {
    return doctors.map(doctor => {
      console.log("button")
      return (<li key={doctor._id}>
               <button className={`btn-doctor ${doctor._id === id ? "active-doctor": ""}`} 
                       onClick={() => handleChangeDoctorView(doctor.lastName, doctor.firstName, doctor._id)}>
                <GoDot /><span>{`${doctor.lastName}, ${doctor.firstName}`}</span>
                </button>
              </li>)
    })
  }

  const removeAppt = async (apptId) => {
    const response = await fetch(`${getBaseURL()}/api/appointments/${apptId}`, {
      method: "DELETE",
    })
    getAppointments();
  }

  const updateAppointment = async (data) => {
    const apptData = {
      patientFirstName: data.patientFirstName,
      patientLastName: data.patientLastName,
      date: viewDate + 'T' + data.editedTime,
      withDoctor: data.withDoctor,
      kind: data.kind,
    }

    try {
      const updatedAppt = await fetch(`${getBaseURL()}/api/appointments/${data.apptId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apptData)
              }
            )
    }catch(error) {
      console.log("error", error)
    }
    setKind('New Patient');
    getAppointments();
  }

  const addAppointment = async () => {
    const doctor = getCurrentDoctorInfo()
    const apptData = {
      patientFirstName: firstName,
      patientLastName: lastName,
      date: viewDate + 'T' + apptTime,
      withDoctor: doctor._id,
      kind: kind,
    }

    try {
      const newAppt = await fetch(`${getBaseURL()}/api/appointments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apptData)
      }
    )
    getAppointments();
    setFirstName('')
    setLastName('')
    setApptTime('')
    setKind('New Patient');

    }catch(error) {
      console.log("error", error)
    }
  }

  const renderAppointments = () => {
    return appts.map((appointment, index) => {
      tableRowIndex = index + 2;
        return (
          <Appointment key={appointment._id}
            data={appointment}
            removeAppt={removeAppt}
            rowNum={index + 1}
            kindOptions={kindOptions}
            updateAppointment={updateAppointment}
          />
        )
    })
  }

  function handleDateChange(e) {
    setViewDate(e.target.value)
    date = e.target.value;
    router.push(`/?doctorId=${id}&date=${e.target.value}`)
    getAppointments()

  }

  useEffect(() => {
    getDoctors();
    getAppointments();
  }, [id])

  return (
    <main className="section-wrapper">
      <div className="outside-column--left"></div>
      <div className="column-one">
        <h1 className="header-text">hero health</h1>
        <div className="side-navigation--doctors">
          <h2 className="side-nav-hdr-sub-text">Physicians</h2>
          <nav>
            <ul className="physicians-list">
              { renderDoctors() }
            </ul>
          </nav>
          <div className="btn-container"> 
            <button className="btn-logout">Logout</button>
          </div>
        </div>
      </div>
      <div className="column-two">
        <div className="appt-upper-container">
          {doctors && renderDoctorHeading()}
          <div>
          <input 
              value={viewDate}
              onChange={(e) => handleDateChange(e)}
              type="date" 
              id="date-view" 
              name="appt-date"
              min="2024-01-01" max="2025-12-31" />
          </div>
        </div>
        <div className="appt-table-container">
          <table>
            <caption></caption>
            <tbody>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Time</th>
                <th>Kind</th>
                <th></th>
                <th></th>
              </tr>
              {renderAppointments()}
              <tr>
                <td datecell="list-item-num">{tableRowIndex}</td>
                  <td datecell="Name" 
                      className="last-row--name-inputs">
                      <input 
                          value={firstName} 
                          onChange={e => setFirstName(e.target.value)} 
                          placeholder="First name"/>
                      <input 
                          value={lastName} 
                          onChange={e => setLastName(e.target.value)} 
                          placeholder="Last name"/>
                  </td>
                  <td>
                      <input type="time" 
                             value={apptTime} 
                             onChange={e => setApptTime(e.target.value)} 
                             className="input-time"
                             placeholder="09:00 AM"/>
                  </td>
                  <td datecell="Kind">
                    <select value={kind}  onChange={e => setKind(e.target.value)}className="custom-select" name="kind" id="kind">
                        {kindOptions.map((option, index) => (
                            <option key={option + index} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                  </td>
                  <td datacell="Update"></td>
                  <td datecell="Remove">
                    <button onClick={addAppointment}
                            className="btn-add" 
                            aria-label="Add appointment">
                             +
                    </button>
                  </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="column-three">
      </div>
    </main>
  );
}
