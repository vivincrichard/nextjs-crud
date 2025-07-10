import { ToastContainer } from "react-toastify";



interface IToastProviderProps {
  children: React.ReactNode;
}



export default function ReactToastifyProvider({ children }: IToastProviderProps) {
  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}