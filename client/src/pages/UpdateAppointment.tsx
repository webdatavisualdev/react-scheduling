import { handleAppointment, getAppointment } from "../fb-sdk";
import { useEffect, useState } from "react";
import { IEvent } from "./SetAppointment";
import Loader from "../components/Loader";

export default function UpdateAppointment(props: any) {
  const id = props.match.params.id;
  const [appointment, setAppointment] = useState<IEvent>();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getAppointment(id).then(res => {
        setAppointment(res.data.data);
        setLoading(false);
      }).catch(err => {
        setAppointment(undefined);
        setLoading(false);
      });
    }
  }, [id]);

  const handleClick = async (status: boolean) => {
    await handleAppointment(status, id);
    if (status) {
      setMessage('You accepted the appointment');
    } else {
      setMessage('You declined the appointment');
    }
  }

  if (loading) {
    return <Loader />;
  }

  if (message) {
    return <p>{message}</p>;
  }

  if (appointment?.accepted) {
    return <p>You already accepted this appointment.</p>;
  }

  return (
    <>
      {
        !appointment ?
        <p>There is no appointment.</p> :
        (
          <div className="">
            <p>You have an appointment from {new Date(appointment?.start || new Date()).toString()} to {new Date(appointment?.end || new Date()).toString()}. Do you want to accept?</p>
            <div className="d-flex justify-content-center">
              <button onClick={() => handleClick(true)} style={{marginRight: 15}}>Accept</button>
              <button onClick={() => handleClick(false)} className="btn-cancel">Decline</button>
            </div>
          </div>
        )
      }
    </>
  )
}