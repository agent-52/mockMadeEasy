import { useState } from "react";
import "../index.css";
import "../utilities.css";
import { Button, ButtonWithImage } from "../components/Button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { InputWithLabel } from "../components/Input";
import { Identity } from "../components/Identity";
import { Link, useLocation, useNavigate } from "react-router";
import { googleLogin, loginUser, signupUser } from "../api/auth.api";
import { authStore } from "../store/auth.store";
const AuthScreen = () => {
  const [mode, setMode] = useState("login");
  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
    name: "",
  });
  const { isAuthenticated, setIsAuthenticated } = authStore() as {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
  };

  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/dashboard";

  function changeMode() {
    if (mode == "login") {
      setMode("signup");
    } else {
      setMode("login");
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const targetName = e.target.name;
    setInputValues({
      ...inputValues,
      [targetName]: e.target.value,
    });
  }
  async function handleSumbit() {
    if (mode == "login") {
      try {
        const response = await loginUser({
          email: inputValues.email,
          password: inputValues.password,
        });
        if (response.status == 200) {
          setIsAuthenticated(true);
          navigate(from);
        }
      } catch (error) {
        console.error(error);
      }
    }
    if (mode == "signup") {
      try {
        const response = await signupUser({
          email: inputValues.email,
          password: inputValues.password,
          name: inputValues.name,
        });
        if (response.status == 200) {
          changeMode();
          navigate("/auth");
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  const isLogin = mode === "login";
  return (
    <div className="color1 authScreen">
      <section className="container bg2 borderR flexC justifyB alignC padY2">
        <Link to="/" className="flex  alignC fullWidth ">
          <div className="logoImgContainer">
            <img src="/images/logo1.png" alt="" />
          </div>
          <div className="fM w500">MockMadeEasy</div>
        </Link>

        <div className="flexC gap5 justifyC authContainer ">
          <div className="flexC ">
            <div className="fXL color1">
              {isLogin ? "Welcome Back" : "Create an account"}
            </div>
            <div className="color2">
              {isLogin ? "Continue practicing" : "Start Practicing"}
            </div>
          </div>
          <div className="flexC gap4">
            <ButtonWithImage
              className="btn-secondary flex gap1 alignC justifyC fullWidth"
              paddingX={6}
              paddingY={5}
              text="Continue with Google"
              icon={<FcGoogle />}
              onClickFn={() => {
                window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`;
              }}
              disabled={false}
            />
            <ButtonWithImage
              className="btn-secondary flex gap1 alignC justifyC fullWidth"
              paddingX={6}
              paddingY={5}
              text="Continue with Github"
              icon={<FaGithub />}
              onClickFn={() => {
                window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/github`;
              }}
              disabled={false}
            />

            <div className="flex gap1 alignC">
              <div className="line bg3 fullWidth"></div>
              <div>or</div>
              <div className="line bg3 fullWidth"></div>
            </div>

            <div className="flexC gap3">
              {mode == "signup" ? (
                <InputWithLabel
                  name="name"
                  type="text"
                  placeHolder="john"
                  labelName="Username"
                  onChangeFn={handleInput}
                />
              ) : null}
              <InputWithLabel
                name="email"
                type="email"
                placeHolder="you@example.com"
                labelName="Email"
                onChangeFn={handleInput}
              />
              <InputWithLabel
                name="password"
                type="password"
                placeHolder="abcd@Ad1"
                labelName="Password"
                onChangeFn={handleInput}
              />
            </div>
          </div>
          <Button
            text={isLogin ? "Sign in" : "Sign up"}
            className="btn-primary fS w500"
            paddingX={16}
            paddingY={10}
            onClickFn={handleSumbit}
            disabled={false}
          />
          <div className="color2 flex gap1 justifyC alignC">
            {isLogin ? "Don`t have an account? " : "Have an account? "}{" "}
            <span
              className="decorated color1 hoverEffect pointer"
              onClick={changeMode}
            >
              {isLogin ? "Sign up" : "Log in"}
            </span>
          </div>
        </div>

        <div className="color2 fXS">
          By continuing, you agree to interEase Terms of Service and Privacy
          Policy.
        </div>
      </section>

      <section className="bg1 flexC alignC justifyC">
        <div className="maxW750 flexC gap3 padX2">
          <div>
            <img src="" alt="" />
          </div>
          <p className="color1 fXL">
            If you’re preparing seriously and don’t want to walk into interviews
            unsure about your answers, interPrep fills that gap really well.
          </p>
          <Identity name="@Elsolo244" imageLink="/images/testimonial1.jpeg" />
        </div>
      </section>
    </div>
  );
};

export { AuthScreen };
