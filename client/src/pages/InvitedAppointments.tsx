import { useEffect, useContext, useState } from "react"
import { AppContext } from "../App"
import { getInvitedAppointments, handleAppointment } from "../fb-sdk";
import { Link } from "react-router-dom";
import { IEvent } from "./SetAppointment";

export default function InvitedAppointments() {
  const { state } = useContext(AppContext);
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    if (state.user) {
      getInvitedAppointments(state.user.email).then(res => {
        setAppointments(res.data.appointments)
      }).catch(err => {
        setAppointments([])
      })
    }
  }, [state.user]);

  const handleClick = async (status: boolean, id: string) => {
    await handleAppointment(status, id);
  }
  
  return (
    <>
      <div>
        <Link to="/set-appointment">Go to set appointment</Link>
        {
          appointments.map((ap: IEvent) => (
            <div className="appointment" key={ap.id}>
              <p>You have an appointment from {new Date(ap?.start || new Date()).toString()} to {new Date(ap?.end || new Date()).toString()}. Do you want to accept?</p>
              <div className="d-flex justify-content-center">
                <button onClick={() => handleClick(true, ap.id)} style={{marginRight: 15}}>Accept</button>
                <button onClick={() => handleClick(false, ap.id)} className="btn-cancel">Decline</button>
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}
