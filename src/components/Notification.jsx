import React, { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { useStateContext } from '../contexts/ContextProvider'
import Button from '../components/Button'
import { MdOutlineCancel } from 'react-icons/md'
import {
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaGlobe,
} from 'react-icons/fa'

const Notification = () => {
  const { currentColor } = useStateContext()
  const [notifications, setNotifications] = useState([])
  const prevNotificationIds = useRef(new Set())

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/notifications')
      const data = await response.json()

      // Only trigger toast for new ones
      data.forEach((item) => {
        if (!prevNotificationIds.current.has(item._id)) {
          toast.info(
            `${item.category}: ${item.reasoning.length > 80
              ? item.reasoning.slice(0, 80) + '...'
              : item.reasoning
            }`
          )
          prevNotificationIds.current.add(item._id)
        }
      })

      setNotifications(data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  useEffect(() => {
    // fetchNotifications()
    // const interval = setInterval(fetchNotifications, 10000)
    // return () => clearInterval(interval)
  }, [])

  const sourceIcons = {
    twitter: <FaTwitter className="text-blue-400" />,
    instagram: <FaInstagram className="text-pink-500" />,
    youtube: <FaYoutube className="text-red-500" />,
    facebook: <FaFacebook className="text-blue-600" />,
    default: <FaGlobe className="text-gray-500" />,
  }

  return (
    <div className="nav-item absolute right-5 md:right-40 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg md:w-96">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <p className="font-semibold text-lg dark:text-gray-200">Notifications</p>
          <button className="text-white text-xs rounded p-1 px-2 bg-orange-theme">
            {notifications.length} New
          </button>
        </div>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>

      <div className="mt-5">
        {notifications.map((item, index) => (
          <div
            key={item._id || index}
            className="flex items-start gap-3 border-b border-color p-3"
          >
            <div className="text-xl mt-1">
              {sourceIcons[item?.source?.toLowerCase()] || sourceIcons.default}
            </div>
            <div>
              <p className="text-md font-semibold text-gray-800 dark:text-gray-200">
                {item.category}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item?.reasoning}
              </p>
            </div>
          </div>
        ))}

        <div className="mt-5">
          <Button
            color="white"
            bgColor={currentColor}
            text="See all notifications"
            borderRadius="10px"
            width="full"
          />
        </div>
      </div>
    </div>
  )
}

export default Notification
