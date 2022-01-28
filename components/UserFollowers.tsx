import { gql, useMutation } from "@apollo/client";
import React from "react";
import { toast } from "react-toastify";
import { USER_PROFILE_STATS } from "../pages/profile/[id]";

export const FOLLOW_UNFOLLOW_USER = gql`
  mutation ($userToFollowId: ID!) {
    followUser(userToFollowId: $userToFollowId)
  }
`;

type User = {
  _id: string;
  username: string;
  email: string;
  profilePicUrl: string;
  name: string;
  role: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __typename: string;
};
type Props = {
  __typename: string;
  user: User;
};
// 61e82419bf0703a0fc8bd63b

const UserFollowers = ({
  data,
  logedInUserFollowingStats,
  logedInUser,
  refetchqueryId,
}: any) => {
  const [followUser] = useMutation(FOLLOW_UNFOLLOW_USER, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: USER_PROFILE_STATS,
        variables: { id: refetchqueryId },
      },
    ],
  });

  const handel_follow_unfollow = async (userId: any) => {
    try {
      const { data } = await followUser({
        variables: { userToFollowId: userId },
      });
      console.log(data);

      // toast.success(data.like_dislike_Post);
    } catch (err) {
      //@ts-ignore
      toast.error(err?.message);
    }
  };

  console.log("FOLLOWERS DATA", data);
  console.log(
    "FOLLOWING USERS"
    // logedInUserFollowStats.find(
    //   (following: any) => following.user._id === user?._id
    // )
  );

  return (
    <div>
      <div className="mt-6 flow-root">
        <ul className="-my-5 divide-y divide-gray-200">
          {data?.map(({ user }: Props) => (
            <li key={user?._id} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user?.profilePicUrl}
                    alt=""
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {"@" + user?.username}
                  </p>
                </div>
                <div>
                  {logedInUserFollowingStats.find(
                    (following: any) => following.user._id === user?._id
                  ) ? (
                    logedInUser === user?._id ? (
                      ""
                    ) : (
                      <button
                        onClick={() => handel_follow_unfollow(user?._id)}
                        className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50"
                      >
                        FOLLOWING
                      </button>
                    )
                  ) : logedInUser === user?._id ? (
                    ""
                  ) : (
                    <button
                      onClick={() => handel_follow_unfollow(user?._id)}
                      className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      FOLLOW
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* <div className='mt-6'>
        <a
          href='#'
          className='w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
        >
          View all
        </a>
      </div> */}
    </div>
  );
};

export default UserFollowers;
