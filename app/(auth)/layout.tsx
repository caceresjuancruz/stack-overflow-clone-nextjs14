const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-main-gradient flex min-h-screen w-full items-center justify-center">
      {children}
    </main>
  );
};

export default Layout;
