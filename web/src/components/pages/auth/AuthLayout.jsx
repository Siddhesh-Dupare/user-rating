
export const AuthLayout = ({children}) => {
  return (
    <main className="min-h-screen bg-[#101114] p-0 text-white sm:p-5 flex justify-center items-center">
      <div className="mx-auto flex min-h-[calc(90vh-5rem)] w-full max-w-7xl overflow-hidden rounded-none bg-[#17181c] shadow-2xl sm:rounded-[2rem]">
        {children}
      </div>
    </main>
  );
}

export default AuthLayout;
