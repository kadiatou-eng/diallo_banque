import { SignIn } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/accueil"); // redirige vers Accueil après connexion
    }
  }, [user]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#06122f] text-white">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl px-8 py-16">
        {/* Partie gauche : texte + illustration */}
        <div className="flex-1 md:pr-10">
          <h1 className="text-5xl font-extrabold mb-4">
            Bienvenue dans <span className="text-yellow-400">DialloBank</span>
          </h1>
          <p className="text-gray-300 mb-6 max-w-md">
            Connectez-vous pour gérer vos comptes et transactions en toute sécurité.
          </p>
          {/* <img
            src="./illustrations/illustration_bank.jpeg"
            alt="Illustration DialloBank"
            className="w-[320px] mt-6"
          /> */}
        </div>

        {/* Partie droite : formulaire Clerk */}
        <div className="flex-1 flex justify-center">
          <SignIn
            signUpUrl="/sign-up"
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

export default SignInPage;