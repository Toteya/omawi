import { useAuth } from "../context/AuthContext"

export default function Login() {
  const { login } = useAuth()
  async function handleSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.target)

    await login(
      form.get("email"),
      form.get("password"),
      form.get("remember") === "on",
    )
  }
  return (
    <div className="Page">
      <h1 className="mb-4">Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="mb-4 border text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="text"
          name="email"
          label="email"
          placeholder="email"
        />
        <input
          className="mb-4 border text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="password"
          name="password"
          placeholder="password"
        />
        <label className="m-2">
          <input
            className="inline-flex mr-2"
            type="checkbox"
            name="remember"
          />
          Remember me
        </label>
        <button className="border" aria-label="login">Login</button>
        <p> Don't have an account yet? <a href="/signup" className="text-blue-500">Sign up</a></p>
      </form>
    </div>
  )
}
