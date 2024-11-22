import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch("/api/users/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.Error || "Profile update failed")
        return data
      } catch (error) {
        console.error(error)
        throw new Error(error)
      }
    },
    onSuccess: () => {
      toast.success("Profile updated")
      queryClient.invalidateQueries({ queryKey: ["userProfile"] })
      queryClient.invalidateQueries({ queryKey: ["authUser"] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
  return { updateProfile, isUpdating }
}
export default useUpdateProfile
