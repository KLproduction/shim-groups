"use client"

import { useAppSelector } from "@/redux/store"
import { selectOnlineMembers } from "@/redux/slices/online-member-slice"

const OnlineUsersList = () => {
  const onlineMembers = useAppSelector(selectOnlineMembers)

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-lg font-bold text-white mb-4">Online Users</h2>
      {onlineMembers.length === 0 ? (
        <p className="text-gray-400">No users are online</p>
      ) : (
        <ul className="text-white">
          <p>{onlineMembers.length}</p>
          {onlineMembers.map((member) => (
            <div key={member.id} className="py-2 flex items-center">
              {member.userName}
            </div>
          ))}
        </ul>
      )}
    </div>
  )
}

export default OnlineUsersList
