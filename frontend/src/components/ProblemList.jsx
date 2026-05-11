import React from "react";

const ProblemList = ({ problems, progress, onProgressUpdate }) => {
  const getProgressForProblem = (problemId) => {
    return progress.find((p) => p.problemId === problemId);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Problems</h2>
      <div className="grid gap-4">
        {problems.map((problem) => {
          const userProgress = getProgressForProblem(problem._id);
          return (
            <div
              key={problem._id}
              className="bg-white p-4 rounded-lg shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {problem.title}
                  </h3>
                  <div className="mt-2 flex items-center space-x-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(problem.difficulty)}`}
                    >
                      {problem.difficulty}
                    </span>
                    {problem.articleUrl && (
                      <a
                        href={problem.articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-500 text-sm"
                      >
                        Article
                      </a>
                    )}
                    {problem.youtubeUrl && (
                      <a
                        href={problem.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-500 text-sm"
                      >
                        YouTube
                      </a>
                    )}
                    {problem.codingPlatformUrl && (
                      <a
                        href={problem.codingPlatformUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500 text-sm"
                      >
                        LeetCode
                      </a>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={userProgress?.completed || false}
                    onChange={(e) =>
                      onProgressUpdate(problem._id, e.target.checked)
                    }
                    className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProblemList;
