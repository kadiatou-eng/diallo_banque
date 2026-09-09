import { SignUp } from "@clerk/clerk-react";
import signUpIllustration from "./illustrations/signUp_illustration.jpg";

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#06122f] text-white">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl px-8 py-16">
        {/* Partie gauche */}
        <div className="flex-1 md:pr-10">
          <h1 className="text-5xl font-extrabold mb-4">
            Créez votre compte <span className="text-yellow-400">DialloBank</span>
          </h1>
          <p className="text-gray-300 mb-6 max-w-md">
            Rejoignez-nous et profitez d’une expérience bancaire moderne et sécurisée.
          </p>
          <img
            src={signUpIllustration}
            alt="Illustration inscription"
            className="w-[320px] mt-6"
          />
        </div>

        {/* Partie droite */}
        <div className="flex-1 flex justify-center">
            <SignUp
              signInUrl="/sign-in"
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-yellow-400 hover:bg-yellow-500 text-black font-semibold",
                  card: "shadow-none",
                },
              }}
            />
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;