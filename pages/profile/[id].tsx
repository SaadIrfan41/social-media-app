/* eslint-disable @next/next/no-img-element */
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { Menu, Segment } from "semantic-ui-react";
import React, { useState } from "react";
import { BadgeCheckIcon } from "@heroicons/react/outline";
import client from "../../utils/apollo";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import PostUserData from "../../components/PostUserData";
import DeletePostButton from "../../components/DeletePostButton";
import Comment_Like_Section from "../../components/Comment_Like_Section";
import UserProfile from "../../components/UserProfile";
import UserFollowers, {
  FOLLOW_UNFOLLOW_USER,
} from "../../components/UserFollowers";

export const USER_PROFILE_STATS = gql`
  query ($id: ID!) {
    userFollowStats(id: $id) {
      followers {
        user {
          _id
          profilePicUrl
          name
          username
        }
      }
      following {
        user {
          _id
          profilePicUrl
          name
          username
        }
      }
      user {
        username
        name
        profilePicUrl
        _id
      }
    }
  }
`;

type pageProp = {
  userid: string;
  logedInUserFollowStats: [Follow];
};
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
};
type Follow = {
  _id: string;
  user: User;
};

const Index = ({ userid, logedInUserFollowStats }: pageProp) => {
  const router = useRouter();
  const [activeItem, setactiveItem] = useState("profile");
  const { id } = router.query;
  const { loading, error, data } = useQuery(USER_PROFILE_STATS, {
    variables: { id },
  });
  const [followUser] = useMutation(FOLLOW_UNFOLLOW_USER, {
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: USER_PROFILE_STATS,
        variables: { id },
      },
    ],
  });
  // const {
  //   data: posts,
  //   loading: postLoading,
  //   error: posterror,
  // } = useQuery(SINGLE_USER_POSTS, {
  //   variables: { id },
  // })
  if (loading)
    return (
      <div className=" mx-auto mt-4 flex w-full max-w-2xl justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  if (error) return <h1>Error</h1>;
  // console.log('ALL POSTS', posts)

  // console.log('USER', data)
  const isFollowing =
    data?.userFollowStats?.followers.filter(
      //@ts-ignore
      (follower: [Follow]) => follower?.user?._id === userid
    ).length > 0;
  // console.log(isFollowing)
  // console.log(activeItem)
  // console.log('logedInUserFollowStats', logedInUserFollowStats)
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
  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <div className="flex flex-shrink-0 justify-center ">
          <img
            className="h-40 w-40 rounded-full"
            src={data?.userFollowStats?.user?.profilePicUrl}
            alt=""
          />
        </div>
        <div className="text-center">
          <p className="text-xl font-medium text-gray-900">
            {data?.userFollowStats?.user?.name}
          </p>
          {data?.userFollowStats?.user?._id !== userid && (
            <button
              onClick={() =>
                handel_follow_unfollow(data?.userFollowStats?.user?._id)
              }
              type="button"
              className={`inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isFollowing
                  ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  : ""
              }`}
            >
              <BadgeCheckIcon
                className="-ml-1 mr-3 h-5 w-5"
                aria-hidden="true"
              />
              {isFollowing ? "FOLLOWING" : "FOLLOW"}
            </button>
          )}
        </div>
      </div>
      <div className="border-b-0 border-gray-500">
        <Menu pointing secondary className="flex justify-center ">
          <Menu.Item
            name="profile"
            active={activeItem === "profile"}
            onClick={() => setactiveItem("profile")}
          />
          <Menu.Item
            name={`${data?.userFollowStats?.followers.length}followers`}
            active={activeItem === "followers"}
            onClick={() => setactiveItem("followers")}
          />
          <Menu.Item
            name={`${data?.userFollowStats?.following.length}following`}
            active={activeItem === "following"}
            onClick={() => setactiveItem("following")}
          />

          <Menu.Item
            name="settings"
            active={activeItem === "settings"}
            onClick={() => setactiveItem("settings")}
          />
        </Menu>
      </div>
      {activeItem === "profile" && (
        <UserProfile logedInUser={userid} userProfileId={id} />
      )}
      {activeItem === "following" && (
        <UserFollowers
          data={data?.userFollowStats?.following}
          logedInUserFollowingStats={logedInUserFollowStats}
          logedInUser={userid}
          refetchqueryId={id}
        />
      )}
      {activeItem === "followers" && (
        <UserFollowers
          data={data?.userFollowStats?.followers}
          logedInUserFollowingStats={logedInUserFollowStats}
          logedInUser={userid}
        />
      )}
    </div>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const { data } = await client.query({
    query: gql`
      query ($id: ID!) {
        userFollowStats(id: $id) {
          # followers {
          #   user {
          #     _id
          #   }
          # }
          following {
            user {
              _id
            }
          }
        }
      }
    `,
    //@ts-ignore
    variables: { id: session?.user?.id },
  });
  // console.log(session)
  return {
    props: {
      //@ts-ignore
      userid: session?.user?.id,
      logedInUserFollowStats: data?.userFollowStats?.following,
    },
  };
};
