/* eslint-disable @next/next/no-img-element */
import { gql, useQuery } from "@apollo/client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "semantic-ui-react";

const Search_By_Name = gql`
  query ($name: String!) {
    filterUsers(name: $name) {
      _id
      name
      profilePicUrl
      username
    }
  }
`;

const Navbar = () => {
  const [name, setname] = useState("");
  const [showDiv, setshowDiv] = useState(false);
  const { data: session, status } = useSession();
  const { data, loading, error, refetch } = useQuery(Search_By_Name, {
    variables: { name },
  });

  // if (status === 'loading')
  //   return (
  //     <div className=' min-h-screen flex justify-center items-center'>
  //       <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500'></div>
  //     </div>
  //   )
  // console.log('Session', user)
  if (error) return <h1>ERROR</h1>;
  console.log(data);
  console.log(loading);
  return (
    <div>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 ">
        <div className="mx-auto flex items-center justify-between border-b-2 border-gray-100  py-4">
          <div className="flex">
            <Link href="/">
              <a className="flex h-10 w-40 flex-shrink-0 items-center text-indigo-500">
                <svg
                  className=""
                  xmlns="http://www.w3.org/2000/svg"
                  width="160"
                  height="140"
                  version="1"
                  viewBox="0 0 1000 800"
                  fill="#6366F1"
                >
                  <path
                    className=""
                    d="M2733 4728l-143-82V3419l148 3 147 3v38c0 20 2 37 4 37s20-13 40-29c113-90 306-104 451-34 78 38 179 142 219 225 50 105 68 209 54 315-19 145-69 250-163 341-49 47-88 70-176 103-48 18-72 21-158 17-85-4-110-9-156-32-30-16-67-40-82-54-16-14-28-22-28-16-1 5 0 114 0 242 0 127-3 232-7 232s-72-37-150-82zm503-596c101-52 146-172 110-295-31-107-103-157-226-157-106 0-178 46-217 137-20 48-16 160 7 211 52 115 207 165 326 104zM1140 4681c-43-14-104-57-131-92-56-74-59-97-59-389v-270l88 45c48 25 139 74 202 110l115 65h261c208 0 270 3 305 15 174 62 234 279 118 426-17 21-52 52-77 67l-47 27-375 2c-206 1-386-2-400-6zm725-122c22-6 54-26 72-46 29-30 33-41 33-86 0-62-25-108-72-134-29-16-69-19-318-23l-285-5-100-58c-55-31-104-57-110-57s-9 60-7 165l3 166 39 39c21 21 49 40 62 43 53 10 644 7 683-4zM4117 4425c-183-50-329-203-366-383-38-185 18-394 136-503 165-153 441-193 651-94 64 30 182 124 182 145 0 5-52 38-115 75l-116 67-38-25c-108-71-266-63-348 19-76 77-88 74 306 74 309 0 350 2 355 16 11 29 6 188-8 240-64 240-252 385-498 383-51 0-115-7-141-14zm203-256c52-12 104-49 131-93 35-57 38-56-191-56-115 0-210 2-210 5s9 23 20 45c44 85 141 124 250 99zM5190 4422c-102-34-165-78-229-159-50-63-76-115-101-204-58-210 22-454 188-576 91-66 152-86 267-87 117-1 180 17 249 70l46 35v-81h300l2 495c2 272 1 495-2 495-3 1-70 1-150 2h-145l-3-41-3-41-37 30c-66 53-127 73-232 77-73 2-108-1-150-15zm257-274c60-15 137-87 152-143 14-50 14-129 1-176-14-50-72-114-122-134-62-24-157-22-210 5-89 45-137 140-124 247 19 158 144 241 303 201zM6512 4417c-29-12-68-36-87-54l-34-31-3 40-3 41-145-1-145-1-3-496-2-495h299l3 324c3 310 4 326 24 352 37 51 70 68 127 68 60 0 99-21 125-68 15-27 17-73 20-353l3-323h298l3 323 3 324 25 36c14 20 39 42 55 49 42 18 115 15 147-6 55-36 58-55 58-405v-321h300v348c0 291-3 357-16 403-50 168-158 256-329 266-128 8-210-16-280-82l-37-35-50 45c-61 55-124 75-227 75-55-1-91-7-129-23zM8105 4430c-54-11-146-52-192-87-207-152-270-428-155-671 40-84 139-181 232-225 211-100 434-65 606 96 130 121 183 316 139 505-44 185-199 338-385 381-52 12-187 12-245 1zm196-291c93-28 149-112 149-222 0-160-124-262-277-227-144 32-217 198-148 337 14 28 34 58 44 67 56 51 150 69 232 45zM2180 4163c-25-14-90-51-145-81s-120-67-145-81c-45-26-46-26-325-31-260-5-283-7-327-27-210-97-209-397 2-492 43-19 64-21 415-21 368 0 370 0 420 24 54 25 88 58 126 121 23 39 24 48 27 265 2 124 2 253 0 287l-3 61-45-25zm-80-350c0-177-8-204-72-243-32-20-48-20-385-18l-353 3-36 37c-31 30-38 45-42 89-6 62 12 103 61 137 32 21 40 22 308 22h274l115 64c63 36 118 65 123 65 4 1 7-70 7-156z"
                    transform="matrix(.1 0 0 -.1 0 800)"
                  ></path>
                </svg>
              </a>
            </Link>
          </div>

          <div>
            <div className="ui  search icon input relative mt-1 w-96 ">
              <input
                className={` h-10 w-full rounded-md p-5 sm:text-sm ${
                  showDiv ? "" : ""
                }`}
                onChange={(e) => setname(e.target.value)}
                placeholder="Search Users..."
                onFocus={() => setshowDiv(true)}
                onBlur={() => setshowDiv(false)}
              />

              {loading === true ? (
                <i aria-hidden="true" className="spinner icon"></i>
              ) : (
                <i aria-hidden="true" className="search icon"></i>
              )}
              {data?.filterUsers?.length > 0 && (
                <div
                  className={` ${
                    showDiv ? "" : "hidden"
                  } absolute  mt-12 w-96 overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 `}
                >
                  <div
                    className={` relative grid gap-3 divide-y divide-gray-200 bg-white  px-5 py-6 sm:gap-3 sm:p-8`}
                  >
                    {data?.filterUsers?.map((user: any) => (
                      <Link key={user?._id} href={`/profile/${user?._id}`}>
                        <a className="group block w-full flex-shrink-0 rounded-md p-2 hover:bg-gray-100 ">
                          <div className="flex items-center ">
                            <div>
                              <img
                                className="inline-block h-11 w-11 rounded-full"
                                src={user?.profilePicUrl}
                                alt=""
                              />
                            </div>
                            <div className="ml-10">
                              <p className="text-lg font-medium  capitalize text-gray-700 group-hover:text-gray-900 ">
                                {user.name}
                              </p>
                            </div>
                          </div>
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex">
            {status === "unauthenticated" && (
              <>
                <div className=" px-2">
                  <Link href="/login">
                    <a className=" font-xl ransition flex items-center justify-center space-x-10 rounded-md border border-transparent border-indigo-400 bg-white px-4 py-2 text-lg  text-indigo-500 shadow-sm duration-500 ease-in-out hover:bg-indigo-600 hover:text-white">
                      Sign In
                    </a>
                  </Link>
                </div>
                <div>
                  <Link href="/register">
                    <a className=" ransition flex items-center justify-center space-x-10 rounded-md border border-transparent border-indigo-400 bg-white px-4 py-2 text-lg font-medium  text-indigo-500 shadow-sm duration-500 ease-in-out hover:bg-indigo-600 hover:text-white">
                      Sign Up
                    </a>
                  </Link>
                </div>
              </>
            )}{" "}
            {status === "authenticated" && (
              <>
                <div>
                  <button
                    className=" flex items-center justify-center space-x-10 rounded-md border border-transparent bg-yellow-900 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-yellow-700"
                    onClick={() => signOut()}
                  >
                    LogOut
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
