import { useSelector, useDispatch } from "react-redux";
import { registerUser } from "../../state/Auth/authSlice";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";

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

    Object.keys(userData).forEach((key) => {
      formData.set(key, userData[key]);
    });

    const user = await dispatch(registerUser(formData));

    if (user) {
      toast.success(`Welcome ${user.payload.user.name}`);
      navigate("/home");
    } else {
      toast.error("Failed to create user");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex h-[47vw] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="EventManagement"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign Up
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSignUpFormSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-900"
              >
                Full name
              </label>
              <div className="mt-2">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  autoComplete="fullName"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-gray-900"
              >
                Avatar
              </label>
              <div className="mt-2">
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  required
                  className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-600 file:text-white file:cursor-pointer focus:outline focus:outline-2 focus:outline-indigo-600"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
