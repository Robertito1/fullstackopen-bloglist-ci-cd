import React from 'react'
import '../Notification.css'

const Notification = ({ message, status }) => {
    return (
        <div className={status ? 'positive' : 'negative'}>{message}</div>
    )
}

export default Notification;