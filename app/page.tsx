// // pages/index.js

import { FcGoogle } from "react-icons/fc";
import { signIn } from "@/auth";
import FeatureContainer from "@/components/landingPage/FeatureContainer";
import NavbarAnchor from "@/components/NavbarAnchor";

export default function Home() {
  const staticImageUrls = [
    "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    "https://i.pravatar.cc/150?u=a04258a2462d826712d",
    "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    "https://i.pravatar.cc/150?u=a04258114e29026302d",
    "https://i.pravatar.cc/150?u=a04258114e29026702d",
    "https://i.pravatar.cc/150?u=a04258114e29026708c",
  ];

  return (
    <main className="min-h-screen mb-10">
      <nav className="sticky top-0 px-4 py-2 md:px-10 flex flex-col md:flex-row justify-between items-center backdrop-blur-md text-charcoal-500 z-10">
        <div className="flex items-center justify-center md:justify-start">
          <h1 className="font-black text-3xl text-primary">Makerhub</h1>
        </div>
        <div className="w-full md:w-1/2 justify-center items-center flex flex-col gap-8 sm:flex-row flex md:justify-end mt-4 md:mt-0">
          <div className="space-x-10 flex text-lg items-center justify-between">
            <NavbarAnchor href="#features" text="Features" />
          </div>
          <a href="/auth/login" className="hover:text-primary text-lg">
            Sign In
          </a>
          <a
            href="/auth/login"
            className="bg-transparent hover:bg-primary text-primary hover:text-white py-3 px-9 border border-primary hover:border-transparent rounded"
          >
            Get Started
          </a>
        </div>
      </nav>
      <section className="h-[50vh] mx-4 md:mx-8 mt-28 space-y-10 flex items-center justify-center flex-col text-charcoal-500">
        <h1 className="font-extrabold text-5xl md:text-7xl font-bold max-w-4xl text-center">
          Generate product roadmaps with
          <span className="dynamic-text"> AI...</span>{" "}
        </h1>

        <span className="text-xl md:text-2xl text-charcoal">
          Transform your ideas into a thriving venture with Makerhub
        </span>
        <div className="flex flex-col md:flex-row gap-4">
          <a
            className="hover:bg-primary text-center hover:text-white text-primary font-bold py-3 px-6 border border-primary rounded transition duration-300 ease-in-out"
            href="/auth/login"
          >
            Start for free
          </a>
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button
              className="bg-white text-darkCharcoal font-bold py-3 px-6 border border-primary rounded flex items-center justify-center transition duration-300 ease-in-out"
              type="submit"
            >
              <FcGoogle size={24} className="mr-2" />
              Start with Google
            </button>
          </form>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center">
            {staticImageUrls.map((item) => {
              return (
                <img
                  src={item}
                  className="w-12 h-12 rounded-full border-2 border-gray-300 shadow-lg hover:shadow-xl -ml-2"
                />
              );
            })}
          </div>
          <div>
            <h1 className="font-bold text-lg">Trusted by</h1>
            <span className="text-lg text-charcoal">many founders</span>
          </div>
        </div>
      </section>
      <section className="mx-4 md:mx-8 mt-28 space-y-10 flex items-center justify-center flex-col text-charcoal-500">
        <div className="w-full max-w-5xl h-auto rounded-xl p-2 shadow-md bg-white ">
          <video
            src="/videos/demoVideo.mov"
            className="w-full h-auto"
            loop
            autoPlay
            muted
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="w-full" id="features">
          <FeatureContainer />
        </div>
        <div className="w-full border-t border-gray-300"></div>
      </section>
      <section className="mx-4 md:mx-8 mt-10 space-y-10 flex flex-col">
        <h2 className="text-2xl font-bold text-center">
          Join a community building better products
        </h2>
        <div className="flex flex-wrap justify-between">
          {Array.from({ length: 12 }).map((_, index) => {
            const randomImage =
              staticImageUrls[
                Math.floor(Math.random() * staticImageUrls.length)
              ];
            return (
              <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <div className="border rounded-lg p-4 shadow-md">
                  <div className="flex items-center mb-2">
                    <img
                      src={randomImage}
                      alt="Founder"
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <div>
                      <h3 className="font-semibold">Name</h3>
                      <span className="text-sm text-gray-500">
                        Role/Position
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    euismod nisl vitae lorem scelerisque, eget aliquet nunc
                    ullamcorper.
                  </p>
                  <div className="mt-2">
                    <span className="text-yellow-500">★★★★★</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-full border-t border-gray-300"></div>
      </section>
    </main>
  );
}
