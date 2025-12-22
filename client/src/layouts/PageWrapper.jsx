export default function PageWrapper({ children }) {
  return (
    <div className="PageWrapper min-h-screen pt-16 px-4 md:px-6 lg:px-8 max-w-5xl mx-auto">
      {children}
    </div>
  )
}
