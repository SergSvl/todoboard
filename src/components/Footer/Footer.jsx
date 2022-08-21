export const Footer = () => {
  return (
    <footer className="w-full h-12 text-center fixed bottom-0 leading-[3rem] bg-gray-100">
      Todo board @ {(new Date().getFullYear())}
    </footer>
  )
}