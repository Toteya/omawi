import { useAuth } from "../context/AuthContext"

export default function Signup() {
  const { signup } = useAuth()
  async function handleSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.target)

    if (form.get("password") !== form.get("confirm_password")) {
      alert("Passwords do not match")
      return
    }

    await signup(
      form.get("name"),
      form.get("email"),
      form.get("password"),
    )
    // navigation.navigate("/")
  }

  return (
    <div className="Page">
      <h1 className="mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="mb-4 border text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="text"
          name="name"
          placeholder="name"
          required
        />
        <input
          className="mb-4 border text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="text"
          name="email"
          placeholder="email"
          required
        />
        <input
          className="mb-4 border text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="password"
          name="password"
          placeholder="password"
          required
        />
        <input
          className="mb-4 border text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="password"
          name="confirm_password"
          placeholder="confirm password"
          required
        />
        <button className="border" aria-label="login">Register</button>
      </form>
    </div>
  )
}
