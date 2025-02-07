import { useSelector, useDispatch } from "react-redux";
import { registerUser } from "../../state/Auth/authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

export default function SignUpForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSignUpFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const userData = {
      name: formData.get("fullName"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    // Update formData values if necessary (ensuring keys are properly set)
    Object.keys(userData).forEach((key) => {
      formData.set(key, userData[key]);
    });

    const user = await dispatch(registerUser(formData));

    if (user.meta.requestStatus != "rejected") {
      toast.success(`Welcome ${user.payload.user.name}`);
      navigate("/");
    } else {
      toast.error(`${error}`);
    }
  };

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    // Outer container: centers content vertically and horizontally, adds padding
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] px-4 py-8">
      {/* Responsive card container */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl md:text-5.5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
            EM
          </h1>
          <h2 className="mt-4 text-center text-2xl font-bold text-gray-900">
            Sign Up
          </h2>
        </div>

        <form onSubmit={handleSignUpFormSubmit} className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <div className="mt-1">
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                autoComplete="name"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700"
            >
              Avatar
            </label>
            <div className="mt-1">
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                required
                className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-600 file:text-white file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
