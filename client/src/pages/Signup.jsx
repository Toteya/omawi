import { useAuth } from "../context/AuthContext"
import { useState } from "react"

export default function Signup() {
  const { signup } = useAuth()
  const [pwdNotMatching, setPwdNotMatching] = useState(false)
  const [userAlreadyExists, setUserAlreadyExists] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.target)

    setPwdNotMatching(false)
    if (form.get("password") !== form.get("confirm_password")) {
      setPwdNotMatching(true)
      return
    }

    setUserAlreadyExists(false)
    await signup(
      form.get("name"),
      form.get("email"),
      form.get("password"),
    ).then(() => {
      navigation.navigate("/")
    }).catch((e) => {
      if(e.message.includes("409")) {
        setUserAlreadyExists(true)
      }
    })
  }

  return (
    <div className="Page">
      <h1 className="mb-4">Sign Up</h1>
      <form className="bg-white rounded-lg p-4" onSubmit={handleSubmit}>
        <input
          className="mb-2 border text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="text"
          name="name"
          placeholder="name"
          required
        />
        <input
          className="mb-2 border text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="email"
          name="email"
          placeholder="email"
          required
        />
        {userAlreadyExists && (<p className="text-red-500 text-sm">An account with that email already exists.</p>)}
        <input
          className="mt-4 mb-2 border text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="password"
          name="password"
          placeholder="password"
          required
        />
        <input
          className="my-2 border text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          type="password"
          name="confirm_password"
          placeholder="confirm password"
          required
        />
        {pwdNotMatching && (<p className="text-red-500 text-sm">Passwords do not match</p>)}
        <button className="border mt-2" aria-label="login">Register</button>
        <p className="mt-2"> Already have an account? <a href="/login" className="text-blue-500 text-nowrap">Log in</a></p>
      </form>
    </div>
  )
}
