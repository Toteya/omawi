import { useAuth } from "../context/AuthContext"
import { useState } from "react"

export default function Login() {
  const [loginFailed, setLoginFailed] = useState(false);
  const { login } = useAuth()
  async function handleSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.target)

    await login(
      form.get("email"),
      form.get("password"),
      form.get("remember") === "on",
    ).then(() => {
      navigation.navigate("/")
    }).catch(() => {
      setLoginFailed(true)
    })
  }
  return (
    <div className="Page">
      <h1 className="mb-4">Login</h1>
      <form className="bg-white rounded-lg p-4" onSubmit={handleSubmit}>
        <input
          className="mb-4 border text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="email"
          name="email"
          label="email"
          placeholder="email"
          required
        />
        <input
          className="mb-2 border text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="password"
          name="password"
          placeholder="password"
          required
        />
        {loginFailed && (<p className="text-red-500 text-sm">Invalid login credentials</p>)}
        <div className="mt-2">
          <input
            className="inline-flex mr-2"
            type="checkbox"
            name="remember"
          />
          Remember me
          <button className="border ml-4" aria-label="login">Login</button>
        </div>
        <p className="mt-2"> Don't have an account yet? <a href="/signup" className="text-blue-500 text-nowrap">Sign up</a></p>
      </form>
    </div>
  )
}
