import React from "react";
import "./Login.css";
import { ErrorMessages } from "../components";
import { LoginResponseInterface, UserContextInterface, ChurchInterface } from "../interfaces";
import { ApiHelper, UserHelper } from "../helpers";
import { Button, FormControl, Alert } from "react-bootstrap";
import { Redirect, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie"

interface Props {
  accessApi?: string,
  context: UserContextInterface,
  jwt: string, auth: string,
  successCallback?: () => void,
  requiredKeyName?: boolean,
  logo?: string,
  appName?: string,
  performGuestLogin?: (churches: ChurchInterface[]) => void;
}

export const LoginPage: React.FC<Props> = (props) => {
  const [welcomeBackName, setWelcomeBackName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [redirectTo, setRedirectTo] = React.useState<string>("");
  const [cookies, setCookie] = useCookies(["jwt", "name", "email"]);
  const location = useLocation();

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(null);
    }
  };

  const validate = () => {
    let errors = [];
    if (email === "") errors.push("Please enter your email address.");
    if (password === "") errors.push("Please enter your password.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = (e: React.MouseEvent) => {
    if (e !== null) e.preventDefault();
    if (validate()) login({ email: email, password: password });
  };

  const init = () => {
    if (props.auth) login({ authGuid: props.auth });
    if (props.jwt) {
      setEmail(cookies.email);
      setWelcomeBackName(cookies.name);
      login({ jwt: props.jwt });
    }
  };

  const handleLoginSuccess = (resp: LoginResponseInterface) => {
    let churches: ChurchInterface[] = [];
    resp.churches.forEach(church => {
      if (church.apps.some(c => c.appName === props.appName)) {
        churches.push(church)
      }
    })
    UserHelper.churches = churches;

    setCookie("name", resp.user.displayName, { path: "/" });
    setCookie("email", resp.user.email, { path: "/" });
    UserHelper.user = resp.user;
    selectChurch();

    /**
         * if user doesn't belong to the church but still wants to log in to that church.
         * We allow them to log in as "Guest", this feature is only supported
         * for "streamingLive" app.
         */
    if (props.appName === "StreamingLive" && !UserHelper.currentChurch) {
      props.performGuestLogin(resp.churches);
      return;
    }

    const hasAccess = UserHelper.currentChurch?.apps.some((app => app.appName === props.appName));

    if (!hasAccess) {
      handleLoginErrors(["No permissions"]);
      return;
    }
    // App has access so lets cookie selected church's access API JWT.
    UserHelper.currentChurch.apis.forEach(api => {
      if (api.keyName === "AccessApi") setCookie("jwt", api.jwt, { path: "/" });
    })

    const search = new URLSearchParams(location.search);
    const returnUrl = search.get("returnUrl");
    if (returnUrl) {
      setRedirectTo(returnUrl);
    }

    if (props.successCallback !== undefined) props.successCallback();
    else props.context.setUserName(UserHelper.currentChurch.id.toString());
  }

  const handleLoginErrors = (errors: string[]) => {
    setWelcomeBackName("");
    if (errors[0] === "No permissions") setErrors(["The provided login does not have access to this application."]);
    else setErrors(["Invalid login. Please check your email or password."]);
    setLoading(false);
  }

  const login = (data: any) => {
    setLoading(true);
    ApiHelper.postAnonymous("/users/login", data, "AccessApi")
      .then((resp: LoginResponseInterface) => {
        if (resp.errors) handleLoginErrors(resp.errors);
        else handleLoginSuccess(resp);
      })
      .catch((e) => { setErrors([e.toString()]); setLoading(false); throw e; });
  };

  const selectChurch = () => {
    let keyName: string;
    if (props.requiredKeyName) {
      keyName = window.location.hostname.split(".")[0];
    }
    UserHelper.selectChurch(props.context, undefined, keyName);
  };

  const getWelcomeBack = () => {
    if (welcomeBackName === "") return null;
    else {
      return <Alert variant="info">Welcome back, <b>{welcomeBackName}</b>!  Please wait while we load your data.</Alert>
    }
  }

  React.useEffect(init, []);

  if (redirectTo) {
    return <Redirect to={redirectTo} />;
  }
  return (
    <div className="smallCenterBlock">
      <img src={props.logo || "/images/logo.png"} alt="logo" className="img-fluid" style={{ width: "100%", marginTop: 100, marginBottom: 60 }} />
      <ErrorMessages errors={errors} />
      {getWelcomeBack()}
      <div id="loginBox">
        <h2 data-cy="sign-in-call-to-action">Please sign in</h2>
        <FormControl id="email" name="email" data-cy="email" value={email} onChange={(e) => { e.preventDefault(); setEmail(e.currentTarget.value); }} placeholder="Email address" onKeyDown={handleKeyDown} />
        <FormControl id="password" name="password" data-cy="password" type="password" placeholder="Password" value={password} onChange={(e) => { e.preventDefault(); setPassword(e.currentTarget.value); }} onKeyDown={handleKeyDown} />
        <Button id="signInButton" data-cy="sign-in-button" size="lg" variant="primary" block onClick={!loading ? handleSubmit : null} disabled={loading}>
          {loading ? "Please wait..." : "Sign in"}
        </Button>
        <br />
        <div className="text-right"><a href="/forgot">Forgot Password</a>&nbsp;</div>
      </div>
    </div>
  );

};
