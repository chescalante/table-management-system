import logo from "/logo.svg";

export default function NavBar() {
  return (
    <div className="navbar bg-base-100 sticky top-0 z-50 justify-center">
      <div className="w-full max-w-5xl px-5 inline-flex items-center">
        <div className="navbar-start flex"></div>
        <div className="navbar-center flex">
          <div
            className="tooltip tooltip-bottom"
            data-tip="Table Management System"
          >
            <a
              href="/"
              className="relative cursor-pointer transition-all duration-300 hover:drop-shadow-[0_0_0.3rem_#ffffff70]"
            >
              <img
                src={logo}
                alt="Logo Table Management System"
                width={45}
                height={45}
              />
            </a>
          </div>
        </div>
        <div className="navbar-start flex"></div>
      </div>
    </div>
  );
}
