import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProblems,
  fetchTopics,
  setCurrentTopic,
} from "../features/topics/topicsSlice";

import {
  fetchProgress,
  updateProgress,
} from "../features/progress/progressSlice";

import { logout } from "../features/auth/authSlice";

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import ProblemList from "../components/ProblemList";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const {
    topics,
    currentTopic,
    problems,
    topicsLoading,
    problemsLoading,
    error,
  } = useSelector((state) => state.topics);

  const { progress } = useSelector((state) => state.progress);

  // FETCH INITIAL DATA

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (topics.length === 0) {
      dispatch(fetchTopics());
    }

    dispatch(fetchProgress());
  }, [user, dispatch, navigate]);

  // AUTO FETCH CURRENT TOPIC PROBLEMS

  useEffect(() => {
    if (currentTopic && !problems[currentTopic._id]) {
      dispatch(fetchProblems(currentTopic._id));
    }
  }, [currentTopic, dispatch]);

  // TOPIC SELECT HANDLER

  const handleTopicSelect = (topic) => {
    dispatch(setCurrentTopic(topic));

    // Avoid duplicate API calls
    if (!problems[topic._id]) {
      dispatch(fetchProblems(topic._id));
    }
  };

  // LOGOUT

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // PROGRESS CALCULATIONS

  const currentTopicProblems = currentTopic
    ? problems[currentTopic._id] || []
    : [];
  const totalProblems = currentTopicProblems.length;
  const currentTopicProblemIds = new Set(
    currentTopicProblems.map((problem) => String(problem._id)),
  );

  const completedCount = progress.filter(
    (item) =>
      item.completed && currentTopicProblemIds.has(String(item.problemId)),
  ).length;

  // GUARDS

  if (!user) return null;

  if (topicsLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading topics...
      </div>
    );
  }

  if (!topicsLoading && topics.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        No topics available
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* SIDEBAR */}

      <Sidebar
        topics={topics}
        currentTopic={currentTopic}
        onTopicSelect={handleTopicSelect}
      />

      {/* MAIN CONTENT */}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}

        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">DSA Sheet</h1>

          <div className="flex items-center gap-6">
            {/* PROGRESS */}

            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-indigo-600">
                  {completedCount}
                </span>{" "}
                / {totalProblems} completed
              </div>
            </div>

            {/* USER */}

            <span className="text-gray-700">Welcome, {user.name}</span>

            {/* LOGOUT */}

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* MAIN */}

        <main className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 bg-red-100 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {currentTopic ? (
            problemsLoading && !problems[currentTopic._id] ? (
              <div className="text-center text-gray-500">
                Loading problems...
              </div>
            ) : (
              <ProblemList
                problems={problems[currentTopic._id] || []}
                progress={progress}
                onProgressUpdate={(problemId, completed) =>
                  dispatch(
                    updateProgress({
                      problemId,
                      completed,
                    }),
                  )
                }
              />
            )
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a topic from the sidebar to view problems.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
