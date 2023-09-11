export const metadata = {
  title: 'Auth',
  description: 'Discord clone next app',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full flex justify-center items-center">
        {children}
    </div>
  )
}