import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  fetchProblems,
  fetchTopics,
  setCurrentTopic,
  resetTopicsState,
} from "../features/topics/topicsSlice";

import {
  fetchProgress,
  updateProgress,
  resetProgressState,
} from "../features/progress/progressSlice";

import { logout } from "../features/auth/authSlice";

import Sidebar from "../components/Sidebar";
import ProblemList from "../components/ProblemList";

const Dashboard = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // AUTH

  const { user } = useSelector((state) => state.auth);

  // TOPICS

  const {
    topics,
    currentTopic,
    problems,

    topicsLoading,
    problemsLoading,

    error,
  } = useSelector((state) => state.topics);

  // PROGRESS

  const { progress, updateLoading } = useSelector((state) => state.progress);

  // FETCH INITIAL DATA

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (topics.length === 0) {
      dispatch(fetchTopics());
    }

    if (progress.length === 0) {
      dispatch(fetchProgress());
    }
  }, [user, dispatch, navigate]);

  // AUTO FETCH CURRENT TOPIC PROBLEMS

  useEffect(() => {
    if (!currentTopic) return;

    // already cached
    if (problems[currentTopic._id]) return;

    dispatch(fetchProblems(currentTopic._id));
  }, [currentTopic?._id]);

  // TOPIC SELECT

  const handleTopicSelect = (topic) => {
    dispatch(setCurrentTopic(topic));

    // avoid duplicate requests
    if (!problems[topic._id]) {
      dispatch(fetchProblems(topic._id));
    }
  };

  // LOGOUT

  const handleLogout = async () => {
    await dispatch(logout());

    dispatch(resetTopicsState());

    dispatch(resetProgressState());

    navigate("/login");
  };

  // CURRENT TOPIC PROBLEMS

  const currentTopicProblems = currentTopic
    ? problems[currentTopic._id] || []
    : [];

  // CURRENT TOPIC IDS

  const currentTopicProblemIds = new Set(
    currentTopicProblems.map((problem) => String(problem._id)),
  );

  // COMPLETED COUNT

  const completedCount = progress.filter(
    (item) =>
      item.completed && currentTopicProblemIds.has(String(item.problemId)),
  ).length;

  // TOTAL COUNT

  const totalProblems = currentTopicProblems.length;

  // LOADING STATE

  if (topicsLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600 text-lg">Loading topics...</div>
      </div>
    );
  }

  // AUTH GUARD

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600 text-lg">Redirecting...</div>
      </div>
    );
  }

  // EMPTY TOPICS STATE

  if (!topicsLoading && topics.length === 0) {
    return (
      <div className="h-screen bg-gray-100 flex flex-col">
        {/* HEADER */}

        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">DSA Sheet</h1>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </header>

        {/* EMPTY STATE */}

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-10 text-center max-w-md w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              No Topics Available
            </h2>

            <p className="text-gray-500">Topics have not been added yet.</p>
          </div>
        </div>
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

            <span className="text-gray-700 hidden sm:block">
              Welcome, {user.name}
            </span>

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
          {/* ERROR */}

          {error && (
            <div className="mb-4 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* NO TOPIC SELECTED */}

          {!currentTopic && (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a topic from the sidebar to view problems.
            </div>
          )}

          {/* LOADING PROBLEMS */}

          {currentTopic && problemsLoading && !problems[currentTopic._id] && (
            <div className="h-full flex items-center justify-center text-gray-500">
              Loading problems...
            </div>
          )}

          {/* EMPTY PROBLEMS */}

          {currentTopic &&
            !problemsLoading &&
            currentTopicProblems.length === 0 && (
              <div className="h-full flex items-center justify-center text-gray-500">
                No problems available for this topic.
              </div>
            )}

          {/* PROBLEM LIST */}

          {currentTopic && currentTopicProblems.length > 0 && (
            <ProblemList
              problems={currentTopicProblems}
              progress={progress}
              updateLoading={updateLoading}
              onProgressUpdate={(problemId, completed) =>
                dispatch(
                  updateProgress({
                    problemId,
                    completed,
                  }),
                )
              }
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
