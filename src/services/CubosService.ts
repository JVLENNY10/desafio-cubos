import axios from 'axios'

class CubosService {
  private email: string | undefined;
  private password: string | undefined;
  private complianceApi: string | undefined;

  constructor() {
    this.email = process.env.EMAIL;
    this.password = process.env.PASSWORD;
    this.complianceApi = process.env.COMPLIANCE_API;
  }

  generateToken = async () => {
    const authCodeResult = await axios
      .post(`${this.complianceApi}/auth/code`, { email: this.email, password: this.password })
      .then((res) => res.data)
      .catch((res) => res.response.data);

    const authTokenResult = await axios
      .post(`${this.complianceApi}/auth/token`, { authCode: authCodeResult.data.authCode })
      .then((res) => res.data)
      .catch((res) => res.response.data);

    return authTokenResult.data.accessToken;
  }

  documentValidate = async (document: string) => {
    const token = await this.generateToken();
    const result = await axios
      .post(`${this.complianceApi}/cpf/validate`, { document }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
      .then((res) => res.data)
      .catch((res) => res.response.data);

    return result;
  }
}

export default CubosService;
