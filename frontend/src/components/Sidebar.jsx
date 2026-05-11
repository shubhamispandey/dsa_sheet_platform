const Sidebar = ({ topics, currentTopic, onTopicSelect }) => {
  return (
    <div className="w-64 shrink-0 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Topics</h2>
      </div>

      <ul className="p-3 space-y-2">
        {topics.map((topic) => (
          <li key={topic._id}>
            <button
              onClick={() => onTopicSelect(topic)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                currentTopic?._id === topic._id
                  ? "bg-indigo-100 text-indigo-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {topic.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
