import GroupSettingsForm from "@/components/forms/group-settings"
import React from "react"

const GroupSettingsPage = ({ params }: { params: { groupid: string } }) => {
  return (
    <div className="flex flex-col w-full h-full gap-10 px-16 py-10  overflow-auto">
      <div className=" flex flex-col gap-5">
        <h3 className=" text-3xl font-bold">Group Settings</h3>
        <p className="text-sm text-themeTextGray">
          Adjust your group settings here. These settings might take time to
          reflect on the explore page.
        </p>
      </div>
      <div className=" p-5">
        <GroupSettingsForm groupId={params.groupid} />
      </div>
    </div>
  )
}

export default GroupSettingsPage