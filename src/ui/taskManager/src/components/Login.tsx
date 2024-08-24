import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import apiClient from '../clients/apiClient';

const Login = () => {
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;

    if (idToken)
      {
        await apiClient.setupAuth(idToken);
        location.reload();
      }
  };

  const handleError = () => {
    console.error('Login Failed');
  };

  return (
    <div className="flex flex-col items-center justify-center h-[calc(70vh-50px)]">
      <h2 className="text-xl p-2">Login with Google</h2>
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default Login;

