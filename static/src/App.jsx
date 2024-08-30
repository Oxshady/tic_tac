import React from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
// import HomePage from './pages/RootPage';
import { queryClient } from "./util/http";
import RankPage from "./pages/RankingPage";

// import GamePage from "./pages/GamePage";
import RootPage from "./pages/RootPage";
import Home from "./pages/Home";
import PrivateRoute from "./pages/AuthPage/PrivateRoute";
import LoginPage from "./pages/AuthPage/Login";
import SignUp from "./pages/AuthPage/SignUp";
import GameSelection from "./component/GameComponent/GameSelection";
// import GameBoard from "./component/GameComponent/css/GameBoard";
import PlayerTwoMain from "./component/TwoPlayer/PlayerTwoMain";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />, // HomePage includes SideBar, BodyPage, and Cricle
    children: [
      {
        path: "/",
        element: <Home />,
      },
      // <PrivateRoute>

      // </PrivateRoute>
      {
        path: "game",
        children: [
          {
            path: "",
            element: (
              <PrivateRoute>
                <GameSelection />,
              </PrivateRoute>
            ),
          },
          {
            path: 'humans',
            element: (
              <PrivateRoute>
                <PlayerTwoMain />,
              </PrivateRoute>
            ),
          }
          // {
          //   path: "multiplayer",
          //   element: (
          //     <PrivateRoute>
          //         <GameBoard />,
          //     </PrivateRoute>
          //   )
          // },
        ],
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: 'rank',
        element: <RankPage />,
      }
    ],

    //   {
    //     path: "game", // This is the protected route
    //     element: (
    //       <PrivateRoute>
    //         <UserPage />
    //       </PrivateRoute>
    //     ),
    //   },
    // {
    //   path: "game",
    //   element: <GamePage />,
    // },
    //   {
    //     path: "rank",
    //     element: <RankPage />,
    //   },
    //   {
    //     path: "settings",
    //     element: <SettingsPage />,
    //   }
    // ]
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
