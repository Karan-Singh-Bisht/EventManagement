import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../state/Auth/authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

export default function LoginForm() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogInFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const user = await dispatch(loginUser(userData));

    if (user.meta.requestStatus != "rejected") {
      toast.success(`Welcome back ${user?.payload?.user?.name}`);
      navigate("/");
    } else {
      toast.error("Invalid email or password");
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
    // Full-screen container that centers content vertically and horizontally
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] px-4 py-8">
      {/* Card container with responsive width */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl md:text-5.5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
            EM
          </h1>
          <h2 className="mt-4 text-center text-2xl font-bold text-gray-900">
            Log In
          </h2>
        </div>

        <form onSubmit={handleLogInFormSubmit} className="mt-6 space-y-6">
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
                autoComplete="current-password"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              Log In
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Not a member?{" "}
          <button
            onClick={() => navigate("/register")}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
