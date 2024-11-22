import Notification from "../models/notificationModel.js"
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      to: req.user._id,
    }).populate({ path: "from", select: "username profileImg" })

    await Notification.updateMany({ to: req.user._id }, { read: true })
    res.status(200).json(notifications)
  } catch (error) {
    console.log("Error in getNotifications controller", error.message)
    res.status(500).json({ Error: "Internal server error" })
  }
}
export const deleteNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ to: req.user._id })
    res.status(200).json({ Message: "Notifications deleted successfully" })
  } catch (error) {
    console.log("Error in deleteNotifications controller", error.message)
    res.status(500).json({ Error: "Internal server error" })
  }
}
