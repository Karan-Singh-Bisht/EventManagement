import { useDispatch } from "react-redux";
import { setFilters } from "../../state/Event/eventSlice";

export default function Filters() {
  const dispatch = useDispatch();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ [name]: value }));
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg flex flex-wrap gap-4 items-center">
      <select
        name="category"
        className="border border-gray-300 rounded-md p-2"
        onChange={handleFilterChange}
      >
        <option value="">All Categories</option>
        <option value="Music">Music</option>
        <option value="Tech">Tech</option>
        <option value="Sports">Sports</option>
      </select>

      <input
        type="date"
        name="date"
        className="border border-gray-300 rounded-md p-2"
        onChange={handleFilterChange}
      />

      <input
        type="text"
        name="location"
        placeholder="Search by location..."
        className="border border-gray-300 rounded-md p-2"
        onChange={handleFilterChange}
      />
    </div>
  );
}
