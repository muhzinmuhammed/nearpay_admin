import { useState } from "react";
import { useDashboardQuery, useUpdateUserScoreMutation } from "../../features/api/adminAuth/AdminAuth";

const Home = () => {
  // Pagination, search, and modal states
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newScore, setNewScore] = useState("");

  // Fetch data based on current page and search input
  const { data: usersData, refetch, isLoading: isUsersLoading } = useDashboardQuery({
    page,
    search,
  });

  // Mutation for updating user score
  const [updateUserScore] = useUpdateUserScoreMutation();

  // Extract users data and total pages
  const users = usersData?.data;
  const totalPages = usersData?.totalPages;

  // Sort users by score (descending) and alphabetically by name if scores are equal
  const sortedUsers = users?.slice().sort((a, b) => {
    if (a.score === b.score) {
      return a.name.localeCompare(b.name); // Sort alphabetically if scores are equal
    }
    return b.score - a.score; // Sort by score in descending order
  });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 when search changes
  };

  // Open modal and set selected user
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setNewScore(user.score);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setNewScore("");
  };

  // Handle score update
  const handleUpdateScore = async () => {
    if (selectedUser && newScore !== "") {
      try {
        await updateUserScore({ id: selectedUser._id, score: newScore });
        closeModal();
        refetch(); // Refetch the users list after update
      } catch (error) {
        console.error("Error updating score:", error);
      }
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Users List</h2>

          {/* Search Input */}
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name"
            className="mb-4 p-2 w-full border rounded"
          />

          {/* Table */}
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Score</th>
                <th className="py-3 px-6 text-center">Rank</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {
                sortedUsers?.map((user, index) => (
                  <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left">{user?.name}</td>
                    <td className="py-3 px-6 text-left">{user.score}</td>
                    <td className="py-3 px-6 text-center">{index + 1}</td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={`px-4 py-2 bg-blue-500 text-white rounded mr-2 ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Previous
            </button>
            <span className="mx-2">{`Page ${page} of ${totalPages}`}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className={`px-4 py-2 bg-blue-500 text-white rounded ml-2 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Update Score Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Update Score for {selectedUser?.name}</h3>
            <input
              type="number"
              value={newScore}
              onChange={(e) => setNewScore(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter new score"
            />
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateScore}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
