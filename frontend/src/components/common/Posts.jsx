import Post from "./Post"
import PostSkeleton from "../skeletons/PostSkeleton"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

const Posts = ({ feedType, username, userId }) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all"
      case "following":
        return "/api/posts/following"
      case "posts":
        return `/api/posts/user/${username}`
      case "likes":
        return `/api/posts/likes/${userId}`
      default:
        return "/api/posts/all"
    }
  }

  const {
    data: posts,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(getPostEndpoint())
        const data = await res.json()
        if (!res.ok) throw new Error(data.Error || "Error while fetching posts")
        return data
      } catch (error) {}
      console.error(error)
      throw new Error(error)
    },
  })

  useEffect(() => {
    refetch()
  }, [refetch, feedType, username])

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {(!isLoading || !isRefetching) && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {(!isLoading || !isRefetching) && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  )
}
export default Posts