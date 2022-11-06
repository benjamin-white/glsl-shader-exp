import Header from '../Header'

const Layout = ({ children }: { children: React.ReactNode }) =>
  <div>
    <Header />
    <main className="site-wrap">
      {children}
    </main>
  </div>

export default Layout